import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Search, Folder, ChevronRight } from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { generateProjectZip, downloadBlob } from '../utils/zipGenerator';

interface CodeExplorerProps {
  initialSelectedFile?: string;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ initialSelectedFile }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    initialSelectedFile || 'app/src/main/AndroidManifest.xml'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFiles = ANDROID_PROJECT_FILES.filter(file => {
    const matchesSearch = file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const selectedFile = ANDROID_PROJECT_FILES.find(f => f.path === selectedFilePath) || ANDROID_PROJECT_FILES[0];

  const handleCopy = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const blob = await generateProjectZip();
      downloadBlob(blob, 'NotiVault-Android-Source.zip');
    } catch (e) {
      console.error('Failed to generate ZIP:', e);
      alert('Error creating ZIP bundle. Please copy files directly from viewer.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[740px]">
      {/* Top Toolbar */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Android Project Codebase</h3>
            <p className="text-xs text-slate-400">Complete, production-ready Kotlin & Gradle files</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-900/30"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Bundling ZIP...' : 'Download Full Project (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane: File Tree */}
        <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/40 flex flex-col shrink-0">
          {/* Search & Category Filter */}
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search filenames..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-medium py-0.5">
              {['all', 'manifest', 'build', 'service', 'data', 'ui'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-md capitalize transition-colors ${selectedCategory === cat ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* File Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
            {filteredFiles.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center gap-2.5 ${isSelected ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'}`}
                >
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Code Viewer */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* File Header */}
          <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-indigo-400" />
                <span>{selectedFile.path}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {selectedFile.description}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code display with line numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 selection:bg-indigo-900 selection:text-white">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
