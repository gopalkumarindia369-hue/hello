import React, { useState } from 'react';
import { 
  GitBranch, 
  X, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Shield, 
  ArrowRight, 
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import { pushProjectToGithub, GithubPushProgress } from '../utils/githubPusher';

interface GithubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubPushModal: React.FC<GithubPushModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState('notivault-android');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [progress, setProgress] = useState<GithubPushProgress | null>(null);

  if (!isOpen) return null;

  const handlePush = async () => {
    if (!token.trim()) {
      alert('Please enter your GitHub Personal Access Token.');
      return;
    }
    if (!repoName.trim()) {
      alert('Please enter a repository name.');
      return;
    }

    try {
      setIsPushing(true);
      await pushProjectToGithub(token, repoName, isPrivate, (p) => {
        setProgress(p);
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-200 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Push Code to GitHub
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full">
                  Instant Cloud Build
                </span>
              </h3>
              <p className="text-xs text-slate-400">Push to your GitHub account & trigger automatic APK build</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPushing}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content States */}
        {progress?.step === 'done' ? (
          /* Success Screen */
          <div className="space-y-4 py-2">
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-bold text-emerald-300">Repository Created & Code Pushed!</div>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  All 28+ Android project files and the automated build pipeline were committed to your repository. GitHub Actions has started compiling your APK in the cloud right now!
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                What to do next (Takes ~90 seconds):
              </div>
              <ol className="text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Click <strong>&ldquo;Watch APK Build in GitHub Actions&rdquo;</strong> below.
                </li>
                <li>
                  Wait ~90 seconds until the workflow completes with a green checkmark <span className="text-emerald-400 font-bold">&#10003;</span>.
                </li>
                <li>
                  Click the completed run, scroll down to <strong>Artifacts</strong>, and tap <strong>&ldquo;NotiVault-app-debug-apk&rdquo;</strong> to download the APK directly onto your phone!
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {progress.actionsUrl && (
                <a
                  href={progress.actionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/30 text-center"
                >
                  <span>Watch APK Build in GitHub Actions</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {progress.repoUrl && (
                <a
                  href={progress.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ) : (
          /* Form Input Screen */
          <div className="space-y-4">
            {/* Step 1: Token */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  1. GitHub Personal Access Token (PAT):
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=NotiVault-APK-Builder"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
                >
                  Generate Token on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                disabled={isPushing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Token requires <code className="text-indigo-300 font-mono">repo</code> permissions. It is used only in your browser for this push and never stored anywhere.
              </p>
            </div>

            {/* Step 2: Repository Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                2. Repository Name:
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="notivault-android"
                disabled={isPushing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Step 3: Visibility */}
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                {isPrivate ? <Lock className="w-4 h-4 text-amber-400" /> : <Globe className="w-4 h-4 text-slate-400" />}
                <div>
                  <div className="font-semibold text-slate-200">
                    {isPrivate ? 'Private Repository' : 'Public Repository'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isPrivate ? 'Only you can see the repository' : 'Anyone on GitHub can view code'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                disabled={isPushing}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  isPrivate
                    ? 'bg-amber-500/20 border-amber-600 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isPrivate ? 'Make Public' : 'Make Private'}
              </button>
            </div>

            {/* In-progress status message */}
            {progress && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                progress.step === 'error'
                  ? 'bg-rose-950/50 border-rose-800/80 text-rose-300'
                  : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-300'
              }`}>
                {progress.step === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                )}
                <span>{progress.message}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isPushing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePush}
                disabled={isPushing || !token.trim() || !repoName.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
              >
                {isPushing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Pushing Project to GitHub...</span>
                  </>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4" />
                    <span>Create Repo & Push to GitHub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
