import React from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle, Info, Smartphone, Cpu } from 'lucide-react';

export const BuildGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Build & Installation Guide (Android Studio & CLI)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Follow these steps to compile, install to your physical device or emulator, and grant special notification listener permissions.
        </p>

        {/* Requirements */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Android SDK</span>
            <span className="text-slate-200 font-mono font-semibold">Min SDK 26 · Target SDK 35</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Java / Kotlin</span>
            <span className="text-slate-200 font-mono font-semibold">JDK 17+ · Kotlin 2.0.20</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Gradle Plugin</span>
            <span className="text-slate-200 font-mono font-semibold">AGP 8.5.2 · Gradle 8.9</span>
          </div>
        </div>
      </div>

      {/* Step by step */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Step-by-Step Execution
        </h4>

        {/* Step 1 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
            <h5 className="text-sm font-semibold text-white">Extract and Open in Android Studio</h5>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pl-8">
            Download the <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">NotiVault-Android-Source.zip</code> using the button in the Code Explorer tab, extract it to a directory on your machine, then choose <strong>File &gt; Open</strong> in Android Studio (Koala, Ladybug, or later). Allow Gradle Sync to finish downloading dependencies.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
            <h5 className="text-sm font-semibold text-white">Assemble Debug APK via Terminal</h5>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pl-8">
            You can build directly from Android Studio&apos;s Run button or execute via command line:
          </p>
          <div className="ml-8 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto">
            <code>./gradlew assembleDebug</code>
          </div>
          <p className="text-[11px] text-slate-500 pl-8">
            The output APK will be placed at: <code className="text-slate-400">app/build/outputs/apk/debug/app-debug.apk</code>
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
            <h5 className="text-sm font-semibold text-white">Install via ADB</h5>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pl-8">
            Connect your device via USB with USB Debugging enabled, and run:
          </p>
          <div className="ml-8 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
            <div>adb install -r app/build/outputs/apk/debug/app-debug.apk</div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
            <h5 className="text-sm font-semibold text-white">Grant Notification Listener Access</h5>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pl-8">
            Android will NOT prompt for Notification Access via regular runtime dialogs. The user must manually toggle it in system settings. NotiVault has an in-app button that launches this screen, or you can invoke it directly via ADB:
          </p>
          <div className="ml-8 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
            <div className="text-slate-500"># Direct command to grant listener access via ADB without manual taps:</div>
            <div>adb shell cmd notification set_notification_listener_access_granted com.notivault.app/com.notivault.app.service.NotificationInterceptorService 1</div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs flex items-center justify-center font-bold">5</span>
            <h5 className="text-sm font-semibold text-white">Disable Battery Optimization</h5>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pl-8">
            Whitelist NotiVault so Android Doze or OEM task-killers do not unbind the listener:
          </p>
          <div className="ml-8 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto">
            <div>adb shell dumpsys deviceidle whitelist +com.notivault.app</div>
          </div>
        </div>
      </div>

      {/* Critical Android OS Limitations Section */}
      <div className="bg-slate-900 border border-amber-800/40 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Known Android OS Limitations & Technical Caveats
        </h4>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="font-bold text-slate-100 block mb-1">1. Android 14+ Non-Dismissible Notification Policy</span>
            <p className="text-slate-400">
              Starting in Android 14 (API 34), notifications flagged with <code className="text-indigo-300 font-mono">FLAG_ONGOING_EVENT</code>, foreground services (music players, active downloads, navigation, ongoing phone calls), and device health alerts cannot be dismissed by third-party apps calling <code className="text-indigo-300 font-mono">cancelNotification()</code>. NotiVault checks flags beforehand, records them in the local database, but purposefully leaves them intact so calls and music controls do not malfunction.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="font-bold text-slate-100 block mb-1">2. Transient PendingIntent Lifecycle</span>
            <p className="text-slate-400">
              When a notification is dismissed with <code className="text-indigo-300 font-mono">cancelNotification(key)</code>, some originating apps cancel their internal <code className="text-indigo-300 font-mono">PendingIntent</code> after a few minutes. NotiVault implements a graceful fallback: if the original intent has expired, it falls back to <code className="text-indigo-300 font-mono">packageManager.getLaunchIntentForPackage(packageName)</code> so tapping &quot;Open in app&quot; never crashes.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="font-bold text-slate-100 block mb-1">3. OEM Background Battery Aggression (MIUI/HyperOS, ColorOS, One UI)</span>
            <p className="text-slate-400">
              Aggressive task managers on Xiaomi, Samsung, and BBK devices periodically kill background services even if granted Notification Access. To mitigate this:
              (a) NotiVault registers a <code className="text-indigo-300 font-mono">BootReceiver</code> to request rebind upon reboot,
              (b) Overrides <code className="text-indigo-300 font-mono">onListenerDisconnected()</code> with <code className="text-indigo-300 font-mono">requestRebind()</code>, and
              (c) Guides users to set battery optimization to &quot;Unrestricted&quot;.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="font-bold text-slate-100 block mb-1">4. Work Profile & Samsung Knox Isolation</span>
            <p className="text-slate-400">
              If an app is installed inside a Work Profile (managed profile) and NotiVault is installed in Personal Profile, Android security sandboxing prevents reading Work Profile notifications unless an enterprise MDM policy explicitly allows cross-profile listener binding.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="font-bold text-slate-100 block mb-1">5. Heads-Up (Peek) Notification Glitch</span>
            <p className="text-slate-400">
              When an app posts a high-priority heads-up notification (pop-up banner at the top of the screen), <code className="text-indigo-300 font-mono">cancelNotification()</code> removes it within 50–150ms. On some older chipsets, a tiny visual flicker of the banner may appear for a split-second before the cancel command executes.
            </p>
          </div>
        </div>
      </div>

      {/* SQLCipher Database Encryption & Android Keystore Section */}
      <div className="bg-slate-900 border border-emerald-800/40 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          SQLCipher Encryption & Hardware Key Management Guide
        </h4>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-100 block">How SQLCipher 256-bit AES Works with Room</span>
            <p className="text-slate-400">
              Unlike stock SQLite which leaves notification headers and preview texts unencrypted in plaintext on flash storage, SQLCipher transparently encrypts every single database page using 256-bit AES in CBC mode with HMAC-SHA512 integrity checks.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-100 block">Hardware Keystore Key Derivation</span>
            <p className="text-slate-400">
              Instead of hardcoding a passphrase or prompting users every reboot, <code className="text-indigo-300 font-mono">SecurityUtil.kt</code> utilizes the <strong>Android Keystore System</strong> to generate a hardware-backed master key (AES-256 GCM) in the device&apos;s Trusted Execution Environment (TEE) or StrongBox chip. This master key wraps a cryptographically secure 32-byte seed stored in <code className="text-indigo-300 font-mono">EncryptedSharedPreferences</code>. The seed is passed to <code className="text-indigo-300 font-mono">SupportFactory(passphrase)</code> when building the Room database.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-100 block">Alternative: EncryptedFile vs SQLCipher</span>
            <p className="text-slate-400">
              <code className="text-indigo-300 font-mono">EncryptedFile</code> (from AndroidX Security) is ideal for flat file blobs (e.g. exporting JSON/CSV backups), but cannot provide indexed SQL queries, paging, or reactive <code className="text-indigo-300 font-mono">Flow</code> emissions. Direct SQLCipher integration with Room provides the best of both worlds: full SQL query capability + complete page-level at-rest encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

