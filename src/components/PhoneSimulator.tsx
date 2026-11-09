import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Search, 
  Trash2, 
  Eye, 
  EyeOff, 
  SlidersHorizontal, 
  ChevronRight, 
  CheckCircle, 
  Download, 
  PhoneCall, 
  Music, 
  Mail, 
  MessageSquare, 
  ArrowLeft,
  X,
  ExternalLink,
  RotateCcw,
  Plus
} from 'lucide-react';
import { AppNotification, AppRule } from '../types';

interface PhoneSimulatorProps {
  initialNotifications?: AppNotification[];
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'rules' | 'settings'>('inbox');
  const [masterIntercept, setMasterIntercept] = useState(true);
  const [defaultAction, setDefaultAction] = useState<'show' | 'hide'>('hide');
  const [isGrouped, setIsGrouped] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppFilter, setSelectedAppFilter] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [undoItem, setUndoItem] = useState<AppNotification | null>(null);
  const [showShadeToast, setShowShadeToast] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Default app rules
  const [appRules, setAppRules] = useState<AppRule[]>([
    { packageName: 'com.whatsapp', appName: 'WhatsApp', category: 'msg', shouldIntercept: true, iconColor: 'bg-emerald-500' },
    { packageName: 'com.google.android.gm', appName: 'Gmail', category: 'email', shouldIntercept: true, iconColor: 'bg-red-500' },
    { packageName: 'com.Slack', appName: 'Slack', category: 'msg', shouldIntercept: true, iconColor: 'bg-indigo-500' },
    { packageName: 'org.telegram.messenger', appName: 'Telegram', category: 'msg', shouldIntercept: true, iconColor: 'bg-sky-500' },
    { packageName: 'com.instagram.android', appName: 'Instagram', category: 'social', shouldIntercept: true, iconColor: 'bg-pink-500' },
    { packageName: 'com.spotify.music', appName: 'Spotify', category: 'media', shouldIntercept: false, iconColor: 'bg-green-600' },
    { packageName: 'com.google.android.dialer', appName: 'Phone', category: 'call', shouldIntercept: false, isProtected: true, iconColor: 'bg-blue-600' },
    { packageName: 'com.google.android.deskclock', appName: 'Clock & Alarms', category: 'alarm', shouldIntercept: false, isProtected: true, iconColor: 'bg-amber-600' },
  ]);

  // Initial simulated notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      key: 'notif_whatsapp_101',
      packageName: 'com.whatsapp',
      appName: 'WhatsApp',
      title: 'Elena Vance',
      text: 'Hey! Are you still working on the Android notification listener?',
      bigText: 'Hey! Are you still working on the Android notification listener? Let me know when you get the APK ready so I can test it.',
      timestamp: Date.now() - 1000 * 60 * 3,
      category: 'msg',
      channelId: 'messages',
      isRead: false,
      isIntercepted: true,
      isOngoing: false,
      iconBgColor: 'bg-emerald-500',
    },
    {
      id: '2',
      key: 'notif_gmail_202',
      packageName: 'com.google.android.gm',
      appName: 'Gmail',
      title: 'Google Cloud Security',
      text: 'Security alert: New sign-in detected on Pixel 8 Pro',
      bigText: 'Your Google Account was recently used to sign in from a new device in Tokyo, Japan. If this was you, you can disregard this alert.',
      timestamp: Date.now() - 1000 * 60 * 25,
      category: 'email',
      channelId: 'security',
      isRead: false,
      isIntercepted: true,
      isOngoing: false,
      iconBgColor: 'bg-red-500',
    },
    {
      id: '3',
      key: 'notif_slack_303',
      packageName: 'com.Slack',
      appName: 'Slack',
      title: '#mobile-eng · Alex Chen',
      text: 'Merged PR #842: Bump compileSdk to 35 and add Room 2.6 schema',
      timestamp: Date.now() - 1000 * 60 * 75,
      category: 'msg',
      channelId: 'mentions',
      isRead: true,
      isIntercepted: true,
      isOngoing: false,
      iconBgColor: 'bg-indigo-500',
    },
    {
      id: '4',
      key: 'notif_call_404',
      packageName: 'com.google.android.dialer',
      appName: 'Phone',
      title: 'Incoming call · David Miller',
      text: 'Ongoing Call · 02:45',
      timestamp: Date.now() - 1000 * 60 * 2,
      category: 'call',
      channelId: 'phone_call',
      isRead: true,
      isIntercepted: false, // Ongoing calls are never intercepted from shade
      isOngoing: true,
      iconBgColor: 'bg-blue-600',
    }
  ]);

  // Inject a simulated notification
  const handleSimulateNotification = (type: 'whatsapp' | 'slack' | 'bank' | 'call' | 'spotify') => {
    let newNotif: AppNotification;
    const now = Date.now();

    switch (type) {
      case 'whatsapp':
        newNotif = {
          id: Math.random().toString(36).substring(2, 9),
          key: `wa_${now}`,
          packageName: 'com.whatsapp',
          appName: 'WhatsApp',
          title: 'Sarah Jenkins',
          text: 'Did the notification interceptor hide this from the status bar?',
          bigText: 'Did the notification interceptor hide this from the status bar? Check your NotiVault inbox right now!',
          timestamp: now,
          category: 'msg',
          channelId: 'chats',
          isRead: false,
          isIntercepted: false,
          isOngoing: false,
          iconBgColor: 'bg-emerald-500'
        };
        break;
      case 'slack':
        newNotif = {
          id: Math.random().toString(36).substring(2, 9),
          key: `slack_${now}`,
          packageName: 'com.Slack',
          appName: 'Slack',
          title: '#general · CTO',
          text: 'Reminder: All-hands meeting starts in 10 minutes.',
          timestamp: now,
          category: 'msg',
          channelId: 'announcements',
          isRead: false,
          isIntercepted: false,
          isOngoing: false,
          iconBgColor: 'bg-indigo-500'
        };
        break;
      case 'bank':
        newNotif = {
          id: Math.random().toString(36).substring(2, 9),
          key: `bank_${now}`,
          packageName: 'com.chase.sig.android',
          appName: 'Chase Bank',
          title: 'Chase Verification Code',
          text: 'Your one-time passcode is 782-910. Valid for 10 minutes.',
          bigText: 'Use security code 782-910 to authorize your transaction of $42.50. Never share this code.',
          timestamp: now,
          category: 'promo',
          channelId: 'alerts',
          isRead: false,
          isIntercepted: false,
          isOngoing: false,
          iconBgColor: 'bg-blue-800'
        };
        break;
      case 'call':
        newNotif = {
          id: Math.random().toString(36).substring(2, 9),
          key: `call_${now}`,
          packageName: 'com.google.android.dialer',
          appName: 'Phone',
          title: 'Incoming Call · Marcus Vance',
          text: 'Ringing...',
          timestamp: now,
          category: 'call',
          channelId: 'incoming_call',
          isRead: false,
          isIntercepted: false,
          isOngoing: true, // Non-clearable
          iconBgColor: 'bg-blue-600'
        };
        break;
      case 'spotify':
        newNotif = {
          id: Math.random().toString(36).substring(2, 9),
          key: `spotify_${now}`,
          packageName: 'com.spotify.music',
          appName: 'Spotify',
          title: 'Starboy · The Weeknd, Daft Punk',
          text: 'Playing on Pixel 8 Pro',
          timestamp: now,
          category: 'media',
          channelId: 'playback',
          isRead: false,
          isIntercepted: false,
          isOngoing: true, // Foreground service media player
          iconBgColor: 'bg-green-600'
        };
        break;
    }

    // Determine interception decision
    const rule = appRules.find(r => r.packageName === newNotif.packageName);
    const shouldInterceptApp = rule ? rule.shouldIntercept : (defaultAction === 'hide');
    const isProtected = rule?.isProtected || newNotif.isOngoing;

    const willIntercept = masterIntercept && shouldInterceptApp && !isProtected;
    newNotif.isIntercepted = willIntercept;

    setNotifications(prev => [newNotif, ...prev]);

    // Show simulation toast
    if (willIntercept) {
      setShowShadeToast(`Intercepted ${newNotif.appName}: Hidden from shade and saved to vault!`);
    } else if (newNotif.isOngoing) {
      setShowShadeToast(`${newNotif.appName} is ONGOING (Call/Media). Saved to vault, kept on screen!`);
    } else {
      setShowShadeToast(`Allowed ${newNotif.appName}: Displayed in shade & logged in vault.`);
    }

    setTimeout(() => {
      setShowShadeToast(null);
    }, 3800);
  };

  // Toggle rule for app
  const toggleAppRule = (pkgName: string) => {
    setAppRules(prev => prev.map(rule => {
      if (rule.packageName === pkgName) {
        if (rule.isProtected) return rule;
        return { ...rule, shouldIntercept: !rule.shouldIntercept };
      }
      return rule;
    }));
  };

  // Delete notification
  const handleDelete = (notif: AppNotification) => {
    setUndoItem(notif);
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    if (selectedNotification?.id === notif.id) {
      setSelectedNotification(null);
    }
  };

  // Undo delete
  const handleUndo = () => {
    if (undoItem) {
      setNotifications(prev => [undoItem, ...prev]);
      setUndoItem(null);
    }
  };

  // Batch delete
  const handleDeleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = searchQuery === '' || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.appName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesApp = selectedAppFilter === null || n.packageName === selectedAppFilter;
    return matchesSearch && matchesApp;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Format time
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Export real JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notifications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `notivault_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export real CSV
  const handleExportCsv = () => {
    const headers = "ID,PackageName,AppName,Title,Text,Timestamp,Category,Intercepted,Ongoing\n";
    const rows = notifications.map(n => 
      `"${n.id}","${n.packageName}","${n.appName}","${(n.title||'').replace(/"/g, '""')}","${(n.text||'').replace(/"/g, '""')}","${new Date(n.timestamp).toISOString()}","${n.category||''}","${n.isIntercepted}","${n.isOngoing}"`
    ).join("\n");
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `notivault_export_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-8 py-4">
      {/* Phone Hardware Mockup */}
      <div className="w-[360px] sm:w-[390px] h-[780px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 relative flex flex-col shrink-0 select-none">
        {/* Speaker / Punch Hole Camera */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full flex items-center justify-center z-50">
          <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800 ml-auto mr-3"></div>
        </div>

        {/* Inner Screen */}
        <div className="w-full h-full bg-slate-950 rounded-[38px] overflow-hidden flex flex-col relative text-slate-100">
          
          {/* Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs font-mono text-slate-400 z-40 bg-slate-950/80 backdrop-blur-sm">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              {masterIntercept && (
                <Shield className="w-3 h-3 text-emerald-400" />
              )}
              <span>5G</span>
              <span>88%</span>
            </div>
          </div>

          {/* Interception Notification Shade HUD Pop-up */}
          {showShadeToast && (
            <div className="absolute top-11 left-3 right-3 bg-slate-800/95 border border-slate-700 shadow-xl rounded-2xl p-3 z-50 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1 text-slate-200 font-medium leading-snug">
                {showShadeToast}
              </div>
            </div>
          )}

          {/* Main App Content Viewport */}
          <div className="flex-1 overflow-y-auto pb-16 flex flex-col">
            
            {/* View: INBOX */}
            {activeTab === 'inbox' && (
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="px-4 pt-2 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        NotiVault
                        {unreadCount > 0 && (
                          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400">Local Encrypted Notification Shade</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setIsGrouped(!isGrouped)}
                        title={isGrouped ? "Flat View" : "Group by App"}
                        className={`p-2 rounded-xl border text-xs transition-colors ${isGrouped ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectionMode(!selectionMode);
                          setSelectedIds(new Set());
                        }}
                        className={`p-2 rounded-xl border text-xs transition-colors ${selectionMode ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        title="Multi-select"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Master Intercept Quick Switch */}
                  <div className={`mt-3 p-3 rounded-2xl border transition-all flex items-center justify-between ${masterIntercept ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${masterIntercept ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {masterIntercept ? 'Intercept Mode ON' : 'Intercept Mode OFF'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {masterIntercept ? 'Canceled from status bar' : 'Allowed in status bar'}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setMasterIntercept(!masterIntercept)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${masterIntercept ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${masterIntercept ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="mt-3 relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, sender, content..." 
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Selection Mode Actions */}
                  {selectionMode && (
                    <div className="mt-2.5 flex items-center justify-between bg-rose-950/40 border border-rose-900/60 rounded-xl px-3 py-2 text-xs text-rose-300">
                      <span>{selectedIds.size} selected</span>
                      <button 
                        onClick={handleDeleteSelected}
                        disabled={selectedIds.size === 0}
                        className="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications List */}
                <div className="flex-1 px-4 space-y-2.5 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                      <Bell className="w-10 h-10 stroke-1 mb-2 opacity-50" />
                      <p className="text-sm font-medium text-slate-400">Vault is empty</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                        Send a simulated notification below to test interception!
                      </p>
                    </div>
                  ) : isGrouped ? (
                    // Grouped by App View
                    Object.entries(
                      filteredNotifications.reduce((acc, notif) => {
                        if (!acc[notif.packageName]) acc[notif.packageName] = [];
                        acc[notif.packageName].push(notif);
                        return acc;
                      }, {} as Record<string, AppNotification[]>)
                    ).map(([pkg, items]) => {
                      const first = items[0];
                      const rule = appRules.find(r => r.packageName === pkg);
                      const isIntercepted = rule ? rule.shouldIntercept : (defaultAction === 'hide');

                      return (
                        <div key={pkg} className="space-y-1.5">
                          {/* Group Header */}
                          <div className="flex items-center justify-between text-xs pt-1 px-1 text-slate-400">
                            <div className="flex items-center gap-1.5 font-medium text-slate-300">
                              <span className={`w-2 h-2 rounded-full ${first.iconBgColor || 'bg-indigo-500'}`} />
                              <span>{first.appName}</span>
                              <span className="text-[11px] text-slate-500 font-mono">({items.length})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isIntercepted ? (
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                  <EyeOff className="w-3 h-3" /> Hidden from shade
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                  <Eye className="w-3 h-3" /> Visible in shade
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Items in group */}
                          {items.map(notif => (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                if (selectionMode) {
                                  const next = new Set(selectedIds);
                                  if (next.has(notif.id)) next.delete(notif.id);
                                  else next.add(notif.id);
                                  setSelectedIds(next);
                                } else {
                                  // Mark read
                                  setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                                  setSelectedNotification(notif);
                                }
                              }}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                                selectionMode && selectedIds.has(notif.id) 
                                  ? 'bg-indigo-950/50 border-indigo-500/80 ring-1 ring-indigo-500' 
                                  : notif.isRead 
                                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400' 
                                    : 'bg-slate-900 border-slate-700/80 text-slate-200 shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${notif.iconBgColor || 'bg-indigo-500'}`} />
                                  <span className="text-xs font-semibold text-slate-100 truncate max-w-[180px]">
                                    {notif.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 shrink-0">
                                  {notif.isOngoing && (
                                    <span className="text-blue-400 bg-blue-950/60 px-1.5 py-0.2 rounded">Ongoing</span>
                                  )}
                                  <span>{formatTime(notif.timestamp)}</span>
                                </div>
                              </div>

                              <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed pl-4.5">
                                {notif.text}
                              </p>

                              {/* Swipe / quick delete button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notif);
                                }}
                                title="Delete"
                                className="absolute right-2.5 bottom-2.5 text-slate-600 hover:text-rose-400 p-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })
                  ) : (
                    // Flat View
                    filteredNotifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          if (selectionMode) {
                            const next = new Set(selectedIds);
                            if (next.has(notif.id)) next.delete(notif.id);
                            else next.add(notif.id);
                            setSelectedIds(next);
                          } else {
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                            setSelectedNotification(notif);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                          selectionMode && selectedIds.has(notif.id) 
                            ? 'bg-indigo-950/50 border-indigo-500/80' 
                            : notif.isRead 
                              ? 'bg-slate-900/40 border-slate-800/80 text-slate-400' 
                              : 'bg-slate-900 border-slate-700/80 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${notif.iconBgColor || 'bg-indigo-500'}`} />
                            <span className="text-xs font-bold text-indigo-300">
                              {notif.appName}
                            </span>
                            <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                              · {notif.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {formatTime(notif.timestamp)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed pl-4.5">
                          {notif.text}
                        </p>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif);
                          }}
                          className="absolute right-2.5 bottom-2.5 text-slate-600 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Undo Notification Bar */}
                {undoItem && (
                  <div className="mx-4 my-2 p-2.5 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between text-xs text-slate-200 shadow-lg">
                    <span>Notification deleted</span>
                    <button 
                      onClick={handleUndo}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Undo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* View: RULES (Per-App Display Control) */}
            {activeTab === 'rules' && (
              <div className="flex-1 px-4 pt-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                      Manage Apps
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" /> SQLCipher Encrypted
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">Default: Intercept All · Exclusion List</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setAppRules(prev => prev.map(r => r.isProtected ? r : { ...r, shouldIntercept: true }))}
                      className="text-[11px] font-medium text-emerald-400 hover:underline"
                    >
                      Intercept All
                    </button>
                    <span className="text-slate-600">·</span>
                    <button 
                      onClick={() => setAppRules(prev => prev.map(r => r.isProtected ? r : { ...r, shouldIntercept: false }))}
                      className="text-[11px] font-medium text-amber-400 hover:underline"
                    >
                      Exclude All
                    </button>
                  </div>
                </div>

                {/* Exclusion policy banner */}
                <div className="mt-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px]">Interception Default: <strong className="text-white">Active (Hide)</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {appRules.filter(r => !r.shouldIntercept && !r.isProtected).length} in Exclusion List
                  </span>
                </div>

                {/* Global default for unlisted apps */}
                <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">Default for New Apps</div>
                      <div className="text-[11px] text-slate-400">Policy applied to newly installed apps</div>
                    </div>
                    <select 
                      value={defaultAction} 
                      onChange={(e) => setDefaultAction(e.target.value as any)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="hide">Hide from screen</option>
                      <option value="show">Show on screen</option>
                    </select>
                  </div>
                </div>

                {/* App List */}
                <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
                  {appRules.map(app => (
                    <div 
                      key={app.packageName}
                      className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3.5 h-3.5 rounded-lg shrink-0 ${app.iconColor}`} />
                        <div>
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                            {app.appName}
                            {app.isProtected && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                                Protected
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[170px]">
                            {app.packageName}
                          </div>
                        </div>
                      </div>

                      {app.isProtected ? (
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-400" />
                          Always Show
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono ${app.shouldIntercept ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {app.shouldIntercept ? 'Hide' : 'Show'}
                          </span>
                          <button 
                            onClick={() => toggleAppRule(app.packageName)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${app.shouldIntercept ? 'bg-emerald-500' : 'bg-slate-700'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${app.shouldIntercept ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="flex-1 px-4 pt-2 flex flex-col space-y-4 overflow-y-auto">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Settings</h2>
                  <p className="text-xs text-slate-400">Security, Storage & Exports</p>
                </div>

                {/* Storage & Export Section */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Data & Export
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
                    <button 
                      onClick={handleExportJson}
                      className="w-full p-3 flex items-center justify-between text-left text-xs text-slate-200 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="font-semibold">Export as JSON</div>
                          <div className="text-[10px] text-slate-500">Download raw notification database</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>

                    <button 
                      onClick={handleExportCsv}
                      className="w-full p-3 flex items-center justify-between text-left text-xs text-slate-200 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-semibold">Export as CSV</div>
                          <div className="text-[10px] text-slate-500">Spreadsheet-ready format</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Permissions Status */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Permissions & Background
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium text-slate-200">Notification Access</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium text-slate-200">Battery Exemption</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded">
                        Unrestricted
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        <span className="font-medium text-slate-200">Internet Access</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                        None (100% Offline)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auto cleanup */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Auto-Cleanup Retention
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Purge logs older than:</span>
                      <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none">
                        <option value="30">30 days</option>
                        <option value="7">7 days</option>
                        <option value="90">90 days</option>
                        <option value="0">Never (keep forever)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notification Detail Bottom Sheet */}
          {selectedNotification && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end">
              <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 text-slate-200 space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[85%] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${selectedNotification.iconBgColor || 'bg-indigo-500'}`} />
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      {selectedNotification.appName}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedNotification(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{selectedNotification.title}</h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {new Date(selectedNotification.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.bigText || selectedNotification.text}
                </div>

                {/* Technical breakdown */}
                <div className="space-y-1.5 text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="text-slate-300">{selectedNotification.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Channel ID:</span>
                    <span className="text-slate-300">{selectedNotification.channelId || 'default'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interception:</span>
                    <span className={selectedNotification.isIntercepted ? 'text-emerald-400' : 'text-slate-400'}>
                      {selectedNotification.isIntercepted ? 'Hidden from Status Bar' : 'Shown on Screen'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongoing Event:</span>
                    <span className={selectedNotification.isOngoing ? 'text-blue-400' : 'text-slate-400'}>
                      {selectedNotification.isOngoing ? 'Yes (Call/Media Protected)' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={() => {
                      alert(`In native Android, this fires pendingIntent.send() or opens intent for ${selectedNotification.packageName}`);
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in {selectedNotification.appName}
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedNotification)}
                    className="py-2.5 px-3 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Android Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-around px-4 z-40">
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${activeTab === 'inbox' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Bell className="w-4 h-4" />
              <span>Inbox</span>
            </button>

            <button 
              onClick={() => setActiveTab('rules')}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${activeTab === 'rules' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <EyeOff className="w-4 h-4" />
              <span>Manage Apps</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Bottom Gestural Pill Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full pointer-events-none z-50"></div>
        </div>
      </div>

      {/* Simulator Control Sandbox Panel */}
      <div className="flex-1 max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-bold text-white tracking-tight">Interactive Notification Tester</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Trigger simulated incoming notifications to verify how the Room database captures them and how the Per-App Rule intercepts or passes them through.
          </p>
        </div>

        {/* Quick Trigger Buttons */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Inject Incoming Notifications:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button 
              onClick={() => handleSimulateNotification('whatsapp')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl flex items-center gap-3 text-left transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-200">WhatsApp Message</div>
                <div className="text-[10px] text-slate-400">Rule: Hide from screen</div>
              </div>
            </button>

            <button 
              onClick={() => handleSimulateNotification('bank')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl flex items-center gap-3 text-left transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-200">Bank OTP / 2FA</div>
                <div className="text-[10px] text-slate-400">Rule: Default policy</div>
              </div>
            </button>

            <button 
              onClick={() => handleSimulateNotification('slack')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl flex items-center gap-3 text-left transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-200">Slack Mention</div>
                <div className="text-[10px] text-slate-400">Rule: Hide from screen</div>
              </div>
            </button>

            <button 
              onClick={() => handleSimulateNotification('call')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl flex items-center gap-3 text-left transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-200">Phone Call (Ongoing)</div>
                <div className="text-[10px] text-amber-400">Protected · Kept in shade</div>
              </div>
            </button>
          </div>
        </div>

        {/* Technical Highlights Checklist */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2.5 text-xs text-slate-300">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-400" />
            Verified Technical Requirements
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
            <li><strong className="text-slate-300">Room Entity & DAO:</strong> Saves every single notification regardless of rule.</li>
            <li><strong className="text-slate-300">cancelNotification(key):</strong> Only invoked if rule is &apos;Hide&apos; and event is clearable.</li>
            <li><strong className="text-slate-300">Protected ongoing events:</strong> Phone calls & Spotify foreground players never dismissed.</li>
            <li><strong className="text-slate-300">Duplicate detection:</strong> SHA-256 hash checks title + text + timestamp within 3s.</li>
            <li><strong className="text-slate-300">Zero Internet:</strong> No <code className="text-indigo-300 font-mono">android.permission.INTERNET</code> declared in Manifest.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
