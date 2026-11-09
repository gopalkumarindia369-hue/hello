import React, { useState } from 'react';
import { 
  Smartphone, 
  FileCode, 
  Terminal, 
  Download, 
  Shield, 
  Database, 
  Bell, 
  CheckCircle,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  Zap,
  GitBranch,
  ArrowRight
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { BuildGuide } from './components/BuildGuide';
import { GithubPushModal } from './components/GithubPushModal';
import { generateProjectZip, downloadBlob } from './utils/zipGenerator';

export default function App() {
  const [activeView, setActiveView] = useState<'simulator' | 'code' | 'guide'>('simulator');
  const [isZipping, setIsZipping] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);

  const handleDownloadFullZip = async () => {
    try {
      setIsZipping(true);
      const blob = await generateProjectZip();
      downloadBlob(blob, 'NotiVault-Android-Source.zip');
    } catch (e) {
      console.error(e);
      alert('Failed to package project. Please copy files directly from the Code Explorer.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Bar following Top Bar Contract: 1-line brand, nav links, 1 primary action */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              NotiVault
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => setActiveView('simulator')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${activeView === 'simulator' ? 'text-indigo-400 font-semibold' : ''}`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Interactive Phone</span>
            </button>
            <button
              onClick={() => setActiveView('code')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${activeView === 'code' ? 'text-indigo-400 font-semibold' : ''}`}
            >
              <FileCode className="w-4 h-4" />
              <span>Android Codebase</span>
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${activeView === 'guide' ? 'text-indigo-400 font-semibold' : ''}`}
            >
              <Terminal className="w-4 h-4" />
              <span>Build & Limitations</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowGithubModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Push to GitHub</span>
            </button>

            <button
              onClick={() => setShowInstallModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/70 border border-indigo-700/60 rounded-xl hover:bg-indigo-900/50 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Install on Phone</span>
            </button>

            <button
              onClick={handleDownloadFullZip}
              disabled={isZipping}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling...' : 'Download .ZIP'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Strip with Clean Unboxed Metadata */}
      <section className="border-b border-slate-900 bg-gradient-to-b from-slate-900/60 to-slate-950 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Android 14/15 Ready</span>
              <span aria-hidden="true">·</span>
              <span>Jetpack Compose</span>
              <span aria-hidden="true">·</span>
              <span>Room 2.6 Database</span>
              <span aria-hidden="true">·</span>
              <span>NotificationListenerService</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">100% Offline (No Internet)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1 max-w-3xl">
              Android Notification Interceptor & Private Vault
            </h1>
          </div>

          {/* View Switcher Tabs (Segmented Control) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveView('simulator')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </button>
            <button
              onClick={() => setActiveView('code')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'guide'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full">
        {activeView === 'simulator' && (
          <div className="space-y-6">
            <PhoneSimulator />
          </div>
        )}

        {activeView === 'code' && (
          <div className="space-y-6">
            <CodeExplorer />
          </div>
        )}

        {activeView === 'guide' && (
          <div className="space-y-6">
            <BuildGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            NotiVault Architecture Specification · minSdk 26 · targetSdk 35 · Room · Jetpack Compose
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Local Encryption Ready</span>
            <span aria-hidden="true">·</span>
            <span>Zero Tracking</span>
            <span aria-hidden="true">·</span>
            <span>Background Rebind Guard</span>
          </div>
        </div>
      </footer>

      {/* Install on My Phone Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">How to Install NotiVault on Your Phone</h3>
                  <p className="text-xs text-slate-400">Step-by-step to get notifications captured & intercepted</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crucial Android Security Notice */}
            <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                Why Android Requires You to Toggle &ldquo;Notification Access&rdquo;
              </div>
              <p className="text-amber-200/80 text-[11px] leading-relaxed">
                By design, Android never allows any app (web or native) to intercept other apps&apos; notifications silently without explicit permission. When you open NotiVault for the first time, you must tap <strong>&ldquo;Grant Notification Access&rdquo;</strong> in the app to activate the interception service.
              </p>
            </div>

            {/* The 2 Paths to Install */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Choose How to Get the APK:
              </div>

              {/* Path 1: Cloud Build with GitHub Actions */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center font-mono">A</span>
                    <span className="text-xs font-bold text-white">Instant Cloud Build (Free &middot; No Android Studio Needed)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">Easiest</span>
                </div>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
                  <li>Download the project via the <strong>&ldquo;Download Project .ZIP&rdquo;</strong> button below.</li>
                  <li>Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 underline">github.com/new</a> and create a free repository.</li>
                  <li>Upload the unzipped project. The included <code className="text-indigo-300 font-mono">.github/workflows/build-apk.yml</code> will build the APK automatically!</li>
                  <li>In GitHub, click the <strong>&ldquo;Actions&rdquo;</strong> tab &gt; download <code className="text-indigo-300 font-mono">app-debug.apk</code> directly on your phone.</li>
                </ol>
              </div>

              {/* Path 2: USB / Android Studio */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center font-mono">B</span>
                    <span className="text-xs font-bold text-white">Via Android Studio / USB Debugging</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">For Developers</span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed space-y-1">
                  <p>Open the unzipped project folder in Android Studio, connect your phone via USB with USB Debugging enabled, and click <strong>Run (&lsquo;Play&rsquo;)</strong> or execute:</p>
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl font-mono text-[11px] text-slate-300">
                    ./gradlew assembleDebug &amp;&amp; adb install -r app/build/outputs/apk/debug/app-debug.apk
                  </div>
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowInstallModal(false);
                  setShowGithubModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <GitBranch className="w-4 h-4" />
                <span>Push Directly to GitHub</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadFullZip}
                  disabled={isZipping}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isZipping ? 'Packaging...' : 'Download .ZIP'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1-Click Push to GitHub Modal */}
      <GithubPushModal
        isOpen={showGithubModal}
        onClose={() => setShowGithubModal(false)}
      />
    </div>
  );
}
