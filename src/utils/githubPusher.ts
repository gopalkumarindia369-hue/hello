import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export interface GithubPushProgress {
  step: 'validating' | 'creating_repo' | 'preparing_tree' | 'committing' | 'done' | 'error';
  message: string;
  repoUrl?: string;
  actionsUrl?: string;
  error?: string;
}

export async function pushProjectToGithub(
  token: string,
  repoName: string,
  isPrivate: boolean,
  onProgress: (p: GithubPushProgress) => void
): Promise<{ repoUrl: string; actionsUrl: string }> {
  const cleanToken = token.trim();
  const cleanRepoName = repoName.trim().replace(/\s+/g, '-');

  const headers = {
    'Authorization': `Bearer ${cleanToken}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  try {
    // 1. Validate token and get authenticated user info
    onProgress({ step: 'validating', message: 'Validating GitHub token & user...' });
    const userRes = await fetch('https://api.github.com/user', { headers });
    if (!userRes.ok) {
      if (userRes.status === 401) {
        throw new Error('Invalid GitHub token. Please verify your token has "repo" permissions.');
      }
      throw new Error(`GitHub user authentication failed (${userRes.status}): ${await userRes.text()}`);
    }
    const userData = await userRes.json();
    const owner = userData.login;

    // 2. Check if repository already exists or create it
    onProgress({ step: 'creating_repo', message: `Setting up repository ${owner}/${cleanRepoName}...` });
    
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}`, { headers });
    let isNewRepo = false;

    if (repoRes.status === 404) {
      // Create new repo with auto_init: true to establish the initial default branch
      isNewRepo = true;
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: cleanRepoName,
          description: 'NotiVault: Android Notification Interceptor & Private Vault (Room, Jetpack Compose, SQLCipher)',
          private: isPrivate,
          auto_init: true,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        throw new Error(`Failed to create repository: ${errText}`);
      }
      repoRes = createRes;
      // Wait 1.5s for GitHub to initialize branch
      await new Promise(r => setTimeout(r, 1500));
    } else if (!repoRes.ok) {
      throw new Error(`Failed to access repository: ${await repoRes.text()}`);
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || 'main';

    // 3. Get latest commit on default branch
    let parentCommitSha: string | null = null;
    let baseTreeSha: string | null = null;

    const refRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/ref/heads/${defaultBranch}`, { headers });
    if (refRes.ok) {
      const refData = await refRes.json();
      parentCommitSha = refData.object.sha;

      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/commits/${parentCommitSha}`, { headers });
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        baseTreeSha = commitData.tree.sha;
      }
    } else {
      // If repo was just created without init, initialize with a simple readme commit
      const initRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/contents/README.md`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Initialize NotiVault repository',
          content: btoa('# NotiVault Android App\nLocal notification interceptor and vault.\n'),
          branch: defaultBranch,
        }),
      });
      if (initRes.ok) {
        const initData = await initRes.json();
        parentCommitSha = initData.commit.sha;
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    // 4. Build Git Tree with all Android project files
    onProgress({ step: 'preparing_tree', message: `Uploading ${ANDROID_PROJECT_FILES.length + 2} project files...` });

    // Include gradlew script files as well
    const filesToUpload = [
      ...ANDROID_PROJECT_FILES,
      {
        path: 'gradlew',
        content: `#!/bin/sh
exec gradle "$@"
`
      },
      {
        path: 'gradlew.bat',
        content: `@rem Gradle Wrapper Windows script
gradle %*
`
      },
      {
        path: 'gradle/wrapper/gradle-wrapper.properties',
        content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
      }
    ];

    const treeEntries = filesToUpload.map(f => ({
      path: f.path,
      mode: f.path === 'gradlew' ? '100755' : '100644', // executable bit for gradlew
      type: 'blob',
      content: f.content,
    }));

    const treePayload: any = {
      tree: treeEntries,
    };
    if (baseTreeSha) {
      treePayload.base_tree = baseTreeSha;
    }

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify(treePayload),
    });

    if (!treeRes.ok) {
      throw new Error(`Failed to create Git tree: ${await treeRes.text()}`);
    }
    const treeData = await treeRes.json();

    // 5. Create Commit
    onProgress({ step: 'committing', message: 'Creating Git commit and updating main branch...' });
    const commitPayload: any = {
      message: 'Initial commit: Complete NotiVault Native Android App (Room, Compose, SQLCipher)',
      tree: treeData.sha,
    };
    if (parentCommitSha) {
      commitPayload.parents = [parentCommitSha];
    }

    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify(commitPayload),
    });

    if (!newCommitRes.ok) {
      throw new Error(`Failed to create commit: ${await newCommitRes.text()}`);
    }
    const newCommitData = await newCommitRes.json();

    // 6. Update Branch Reference
    const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/refs/heads/${defaultBranch}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        sha: newCommitData.sha,
        force: true,
      }),
    });

    if (!updateRefRes.ok) {
      // Try creating ref if update fails
      await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/refs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${defaultBranch}`,
          sha: newCommitData.sha,
        }),
      });
    }

    const repoUrl = `https://github.com/${owner}/${cleanRepoName}`;
    const actionsUrl = `https://github.com/${owner}/${cleanRepoName}/actions`;

    onProgress({
      step: 'done',
      message: 'Successfully pushed! GitHub Actions is now compiling your APK in the cloud.',
      repoUrl,
      actionsUrl,
    });

    return { repoUrl, actionsUrl };
  } catch (err: any) {
    onProgress({
      step: 'error',
      message: err.message || 'An unexpected error occurred while pushing to GitHub.',
      error: err.message,
    });
    throw err;
  }
}
