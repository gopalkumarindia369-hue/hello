export interface AppNotification {
  id: string;
  key: string;
  packageName: string;
  appName: string;
  title: string;
  text: string;
  bigText?: string;
  subText?: string;
  timestamp: number;
  category?: string;
  channelId?: string;
  isRead: boolean;
  isIntercepted: boolean;
  isOngoing: boolean;
  actions?: Array<{ title: string; actionId: string }>;
  iconBgColor?: string;
}

export interface AppRule {
  packageName: string;
  appName: string;
  category: string;
  shouldIntercept: boolean;
  isProtected?: boolean; // e.g. Phone, Alarm
  iconColor: string;
}

export interface AppSettings {
  masterIntercept: boolean;
  defaultAction: 'intercept' | 'allow';
  autoCleanupDays: number; // 0 = never, 7, 30, 90
  appLockEnabled: boolean;
  lockType: 'biometric' | 'pin';
  pinCode: string;
  showBadges: boolean;
  theme: 'system' | 'dark' | 'light';
  isNotificationAccessGranted: boolean;
  isBatteryOptimizedExempt: boolean;
}

export interface AndroidProjectFile {
  path: string;
  description: string;
  category: 'build' | 'manifest' | 'data' | 'service' | 'ui' | 'util';
  content: string;
}
