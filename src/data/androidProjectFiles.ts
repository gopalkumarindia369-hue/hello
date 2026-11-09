import { AndroidProjectFile } from '../types';

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: '.github/workflows/build-apk.yml',
    description: 'Automated Cloud CI/CD: Builds ready-to-install app-debug.apk on GitHub Actions in 90 seconds without local Android Studio',
    category: 'build',
    content: `name: Build NotiVault APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Compile and Assemble Debug APK
        run: ./gradlew assembleDebug --no-daemon

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: NotiVault-app-debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
`
  },
  {
    path: 'settings.gradle.kts',
    description: 'Gradle settings defining repository endpoints and project name',
    category: 'build',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "NotiVault"
include(":app")
`
  },
  {
    path: 'build.gradle.kts',
    description: 'Root Gradle build script with plugin declarations',
    category: 'build',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`
  },
  {
    path: 'gradle/libs.versions.toml',
    description: 'Version catalog for dependencies, plugins, and compile SDKs',
    category: 'build',
    content: `[versions]
agp = "8.5.2"
kotlin = "2.0.20"
coreKtx = "1.13.1"
lifecycleRuntimeKtx = "2.8.6"
activityCompose = "1.9.2"
composeBom = "2024.09.02"
room = "2.6.1"
ksp = "2.0.20-1.0.25"
coroutines = "1.8.1"
navigationCompose = "2.8.1"
biometric = "1.2.0-alpha05"
workManager = "2.9.1"
materialIconsExtended = "1.7.2"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended", version.ref = "materialIconsExtended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-biometric = { group = "androidx.biometric", name = "biometric", version.ref = "biometric" }
androidx-work-runtime-ktx = { group = "androidx.work", name = "work-runtime-ktx", version.ref = "workManager" }

# Room Database
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

# SQLCipher Database Encryption & Android Keystore
sqlcipher-android = { group = "net.zetetic", name = "sqlcipher-android", version = "4.6.0" }
androidx-sqlite-ktx = { group = "androidx.sqlite", name = "sqlite-ktx", version = "2.4.0" }
androidx-security-crypto = { group = "androidx.security", name = "security-crypto", version = "1.1.0-alpha06" }

# Coroutines
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
`
  },
  {
    path: 'app/build.gradle.kts',
    description: 'App module build script with Room, Compose, WorkManager, and MinSdk 26',
    category: 'build',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.notivault.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.notivault.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Room schema export location
        ksp {
            arg("room.schemaLocation", "$projectDir/schemas")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.biometric)
    implementation(libs.androidx.work.runtime.ktx)

    // Room local persistence
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // SQLCipher 256-bit AES Full-Database Encryption
    implementation(libs.sqlcipher.android)
    implementation(libs.androidx.sqlite.ktx)
    implementation(libs.androidx.security.crypto)

    // Kotlin Coroutines
    implementation(libs.kotlinx.coroutines.android)

    debugImplementation(libs.androidx.ui.tooling)
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    description: 'Android Manifest declaring NotificationListenerService, BootReceiver, and zero-internet security',
    category: 'manifest',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permissions -->
    <!-- Required on Android 13+ (API 33+) if the app itself posts notifications (e.g. active service banner) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <!-- Battery optimization exemption check & prompt -->
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
    <!-- Rebind service after device restart -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <!-- Biometric app lock -->
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <!-- Explicitly NO INTERNET PERMISSION to guarantee zero external data transmission -->

    <application
        android:name=".NotiVaultApplication"
        android:allowBackup="false"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.NotiVault"
        tools:targetApi="35">

        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/Theme.NotiVault">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Notification Interceptor Service -->
        <!-- Must be protected with BIND_NOTIFICATION_LISTENER_SERVICE permission -->
        <service
            android:name=".service.NotificationInterceptorService"
            android:label="@string/service_name"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

        <!-- Boot Receiver to rebind service on restart -->
        <receiver
            android:name=".service.BootReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>

    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/res/xml/data_extraction_rules.xml',
    description: 'Security rule preventing Android cloud backup of sensitive notifications',
    category: 'manifest',
    content: `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <!-- Exclude all databases and shared preferences from Google Drive Cloud Backup -->
        <exclude domain="database" path="notivault_database" />
        <exclude domain="sharedpref" path="notivault_prefs.xml" />
    </cloud-backup>
    <device-transfer>
        <!-- Allow encrypted transfer between user's own physical devices via cable/Wi-Fi Direct -->
        <include domain="database" path="notivault_database" />
    </device-transfer>
</data-extraction-rules>
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    description: 'Application string resources',
    category: 'manifest',
    content: `<resources>
    <string name="app_name">NotiVault</string>
    <string name="service_name">NotiVault Interceptor Service</string>
    <string name="inbox_title">Notification Inbox</string>
    <string name="rules_title">Per-App Rules</string>
    <string name="settings_title">Vault Settings</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    description: 'Material 3 theme configuration',
    category: 'manifest',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.NotiVault" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
    </style>
</resources>
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/NotiVaultApplication.kt',
    description: 'Application class initializing Room Database, Repositories, and Periodic Auto-Cleanup Worker',
    category: 'data',
    content: `package com.notivault.app

import android.app.Application
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.notivault.app.data.local.NotiVaultDatabase
import com.notivault.app.data.repository.AppRuleRepository
import com.notivault.app.data.repository.NotificationRepository
import com.notivault.app.data.repository.PreferencesRepository
import com.notivault.app.worker.CleanupWorker
import java.util.concurrent.TimeUnit

class NotiVaultApplication : Application() {

    lateinit var database: NotiVaultDatabase
        private set

    lateinit var notificationRepository: NotificationRepository
        private set

    lateinit var appRuleRepository: AppRuleRepository
        private set

    lateinit var preferencesRepository: PreferencesRepository
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize Room Database
        database = NotiVaultDatabase.getDatabase(this)
        notificationRepository = NotificationRepository(database.notificationDao())
        appRuleRepository = AppRuleRepository(database.appRuleDao())
        preferencesRepository = PreferencesRepository(this)

        // Schedule Daily Database Auto-Cleanup Worker
        scheduleAutoCleanupWorker()
    }

    private fun scheduleAutoCleanupWorker() {
        val cleanupRequest = PeriodicWorkRequestBuilder<CleanupWorker>(24, TimeUnit.HOURS)
            .setConstraints(
                Constraints.Builder()
                    .setRequiresBatteryNotLow(true)
                    .build()
            )
            .build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "NotificationAutoCleanup",
            ExistingPeriodicWorkPolicy.KEEP,
            cleanupRequest
        )
    }

    companion object {
        lateinit var instance: NotiVaultApplication
            private set
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/local/entity/NotificationEntity.kt',
    description: 'Room Entity storing all notification metadata, flags, channels, and content',
    category: 'data',
    content: `package com.notivault.app.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "notifications",
    indices = [
        Index(value = ["notificationKey"]),
        Index(value = ["packageName"]),
        Index(value = ["timestamp"]),
        Index(value = ["isRead"])
    ]
)
data class NotificationEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val notificationKey: String,
    val packageName: String,
    val appName: String,
    val title: String?,
    val text: String?,
    val bigText: String?,
    val subText: String?,
    val timestamp: Long,
    val category: String?,
    val channelId: String?,
    val isIntercepted: Boolean,
    val isOngoing: Boolean,
    val isRead: Boolean = false,
    val contentHash: String
)
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/local/entity/AppRuleEntity.kt',
    description: 'Room Entity storing per-app interception preference, default intercept rule, and exclusion status',
    category: 'data',
    content: `package com.notivault.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "app_rules")
data class AppRuleEntity(
    @PrimaryKey
    val packageName: String,
    val appName: String,
    // Default is true: intercept and hide from status bar
    val shouldIntercept: Boolean = true,
    // System critical apps (Phone dialer, emergency, alarms) that must never be cancelled
    val isProtected: Boolean = false,
    // Explicitly marked as excluded by user
    val isExcluded: Boolean = false
)
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/local/dao/NotificationDao.kt',
    description: 'Room DAO providing reactive Flows, queries, duplicate checking, and multi-mode deletes',
    category: 'data',
    content: `package com.notivault.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.notivault.app.data.local.entity.NotificationEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface NotificationDao {

    @Query("SELECT * FROM notifications ORDER BY timestamp DESC")
    fun getAllNotificationsFlow(): Flow<List<NotificationEntity>>

    @Query("""
        SELECT * FROM notifications 
        WHERE (:packageName IS NULL OR packageName = :packageName)
        AND (:searchQuery IS NULL OR title LIKE '%' || :searchQuery || '%' OR text LIKE '%' || :searchQuery || '%' OR bigText LIKE '%' || :searchQuery || '%')
        AND (:startDate IS NULL OR timestamp >= :startDate)
        AND (:endDate IS NULL OR timestamp <= :endDate)
        ORDER BY timestamp DESC
    """)
    fun getFilteredNotificationsFlow(
        packageName: String?,
        searchQuery: String?,
        startDate: Long?,
        endDate: Long?
    ): Flow<List<NotificationEntity>>

    @Query("SELECT * FROM notifications WHERE id = :id LIMIT 1")
    suspend fun getNotificationById(id: Long): NotificationEntity?

    @Query("SELECT * FROM notifications WHERE notificationKey = :key ORDER BY timestamp DESC LIMIT 1")
    suspend fun getLatestByKey(key: String): NotificationEntity?

    @Query("SELECT COUNT(*) FROM notifications WHERE isRead = 0")
    fun getUnreadCountFlow(): Flow<Int>

    @Query("SELECT DISTINCT packageName, appName FROM notifications ORDER BY appName ASC")
    fun getDistinctAppsFlow(): Flow<List<AppSummary>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: NotificationEntity): Long

    @Update
    suspend fun updateNotification(notification: NotificationEntity)

    @Query("UPDATE notifications SET isRead = 1 WHERE id = :id")
    suspend fun markAsRead(id: Long)

    @Query("UPDATE notifications SET isRead = 1")
    suspend fun markAllAsRead()

    @Query("DELETE FROM notifications WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM notifications WHERE id IN (:ids)")
    suspend fun deleteByIds(ids: List<Long>)

    @Query("DELETE FROM notifications WHERE packageName = :packageName")
    suspend fun deleteByPackage(packageName: String)

    @Query("DELETE FROM notifications")
    suspend fun deleteAll()

    @Query("DELETE FROM notifications WHERE timestamp < :cutoffTimestamp")
    suspend fun deleteOlderThan(cutoffTimestamp: Long): Int
}

data class AppSummary(
    val packageName: String,
    val appName: String
)
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/local/dao/AppRuleDao.kt',
    description: 'Room DAO managing per-app interception rules and exclusion list',
    category: 'data',
    content: `package com.notivault.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.notivault.app.data.local.entity.AppRuleEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AppRuleDao {

    @Query("SELECT * FROM app_rules ORDER BY appName ASC")
    fun getAllRulesFlow(): Flow<List<AppRuleEntity>>

    @Query("SELECT * FROM app_rules WHERE shouldIntercept = 0 ORDER BY appName ASC")
    fun getExcludedAppsFlow(): Flow<List<AppRuleEntity>>

    @Query("SELECT * FROM app_rules WHERE shouldIntercept = 1 ORDER BY appName ASC")
    fun getInterceptedAppsFlow(): Flow<List<AppRuleEntity>>

    @Query("SELECT * FROM app_rules WHERE packageName = :packageName LIMIT 1")
    suspend fun getRuleForPackage(packageName: String): AppRuleEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateRule(rule: AppRuleEntity)

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertRules(rules: List<AppRuleEntity>)

    @Query("UPDATE app_rules SET shouldIntercept = :intercept, isExcluded = :isExcluded WHERE isProtected = 0")
    suspend fun setAllInterceptStatus(intercept: Boolean, isExcluded: Boolean)

    @Query("UPDATE app_rules SET shouldIntercept = :intercept, isExcluded = :isExcluded WHERE packageName = :packageName AND isProtected = 0")
    suspend fun setAppIntercept(packageName: String, intercept: Boolean, isExcluded: Boolean)
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/local/NotiVaultDatabase.kt',
    description: 'Encrypted Room Database with SQLCipher 256-bit AES SupportFactory and Keystore passphrase',
    category: 'data',
    content: `package com.notivault.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.notivault.app.data.local.dao.AppRuleDao
import com.notivault.app.data.local.dao.NotificationDao
import com.notivault.app.data.local.entity.AppRuleEntity
import com.notivault.app.data.local.entity.NotificationEntity
import com.notivault.app.util.SecurityUtil
import net.sqlcipher.database.SupportFactory

@Database(
    entities = [
        NotificationEntity::class,
        AppRuleEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class NotiVaultDatabase : RoomDatabase() {

    abstract fun notificationDao(): NotificationDao
    abstract fun appRuleDao(): AppRuleDao

    companion object {
        @Volatile
        private var INSTANCE: NotiVaultDatabase? = null

        fun getDatabase(context: Context): NotiVaultDatabase {
            return INSTANCE ?: synchronized(this) {
                // Initialize SQLCipher native binary hooks
                System.loadLibrary("sqlcipher")

                // Retrieve or generate 256-bit AES passphrase from Android Keystore
                val passphrase = SecurityUtil.getOrCreateDatabasePassphrase(context)
                val factory = SupportFactory(passphrase)

                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NotiVaultDatabase::class.java,
                    "notivault_encrypted.db"
                )
                    .openHelperFactory(factory)
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/util/SecurityUtil.kt',
    description: 'Hardware-backed Android Keystore key management for SQLCipher 256-bit AES encryption',
    category: 'util',
    content: `package com.notivault.app.util

import android.content.Context
import android.util.Base64
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import java.security.SecureRandom

object SecurityUtil {

    private const val PREFS_NAME = "notivault_secure_keystore_prefs"
    private const val KEY_DB_PASSPHRASE = "encrypted_db_passphrase_key"

    /**
     * Retrieves or generates a 256-bit (32-byte) cryptographic passphrase
     * for SQLCipher database encryption. Stored safely in EncryptedSharedPreferences
     * backed by the Android Keystore (hardware TEE/StrongBox).
     */
    fun getOrCreateDatabasePassphrase(context: Context): ByteArray {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .setUserAuthenticationRequired(false)
            .build()

        val encryptedPrefs = EncryptedSharedPreferences.create(
            context,
            PREFS_NAME,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )

        val existingBase64 = encryptedPrefs.getString(KEY_DB_PASSPHRASE, null)
        if (existingBase64 != null) {
            return Base64.decode(existingBase64, Base64.DEFAULT)
        }

        // Generate 32 cryptographically secure random bytes (256-bit AES key)
        val randomBytes = ByteArray(32)
        SecureRandom().nextBytes(randomBytes)

        val encoded = Base64.encodeToString(randomBytes, Base64.DEFAULT)
        encryptedPrefs.edit().putString(KEY_DB_PASSPHRASE, encoded).apply()

        return randomBytes
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/repository/NotificationRepository.kt',
    description: 'Repository abstracting database operations with Coroutines and Kotlin Flow',
    category: 'data',
    content: `package com.notivault.app.data.repository

import com.notivault.app.data.local.dao.AppSummary
import com.notivault.app.data.local.dao.NotificationDao
import com.notivault.app.data.local.entity.NotificationEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class NotificationRepository(private val notificationDao: NotificationDao) {

    val allNotifications: Flow<List<NotificationEntity>> = notificationDao.getAllNotificationsFlow()
    val unreadCount: Flow<Int> = notificationDao.getUnreadCountFlow()
    val distinctApps: Flow<List<AppSummary>> = notificationDao.getDistinctAppsFlow()

    fun getFiltered(
        packageName: String?,
        searchQuery: String?,
        startDate: Long?,
        endDate: Long?
    ): Flow<List<NotificationEntity>> {
        return notificationDao.getFilteredNotificationsFlow(packageName, searchQuery, startDate, endDate)
    }

    suspend fun getNotificationById(id: Long): NotificationEntity? = withContext(Dispatchers.IO) {
        notificationDao.getNotificationById(id)
    }

    suspend fun insertNotification(notification: NotificationEntity): Long = withContext(Dispatchers.IO) {
        notificationDao.insertNotification(notification)
    }

    suspend fun getLatestByKey(key: String): NotificationEntity? = withContext(Dispatchers.IO) {
        notificationDao.getLatestByKey(key)
    }

    suspend fun markAsRead(id: Long) = withContext(Dispatchers.IO) {
        notificationDao.markAsRead(id)
    }

    suspend fun markAllAsRead() = withContext(Dispatchers.IO) {
        notificationDao.markAllAsRead()
    }

    suspend fun deleteById(id: Long) = withContext(Dispatchers.IO) {
        notificationDao.deleteById(id)
    }

    suspend fun deleteByIds(ids: List<Long>) = withContext(Dispatchers.IO) {
        notificationDao.deleteByIds(ids)
    }

    suspend fun deleteByPackage(packageName: String) = withContext(Dispatchers.IO) {
        notificationDao.deleteByPackage(packageName)
    }

    suspend fun deleteAll() = withContext(Dispatchers.IO) {
        notificationDao.deleteAll()
    }

    suspend fun deleteOlderThan(cutoffTimestamp: Long): Int = withContext(Dispatchers.IO) {
        notificationDao.deleteOlderThan(cutoffTimestamp)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/repository/AppRuleRepository.kt',
    description: 'Repository handling interception rules with system whitelists',
    category: 'data',
    content: `package com.notivault.app.data.repository

import com.notivault.app.data.local.dao.AppRuleDao
import com.notivault.app.data.local.entity.AppRuleEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class AppRuleRepository(private val appRuleDao: AppRuleDao) {

    val allRules: Flow<List<AppRuleEntity>> = appRuleDao.getAllRulesFlow()

    suspend fun getRuleForPackage(packageName: String): AppRuleEntity? = withContext(Dispatchers.IO) {
        appRuleDao.getRuleForPackage(packageName)
    }

    suspend fun setRule(packageName: String, appName: String, shouldIntercept: Boolean, isProtected: Boolean = false) {
        withContext(Dispatchers.IO) {
            appRuleDao.insertOrUpdateRule(
                AppRuleEntity(
                    packageName = packageName,
                    appName = appName,
                    shouldIntercept = shouldIntercept,
                    isProtected = isProtected
                )
            )
        }
    }

    suspend fun setAllInterceptStatus(intercept: Boolean) = withContext(Dispatchers.IO) {
        appRuleDao.setAllInterceptStatus(intercept)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/data/repository/PreferencesRepository.kt',
    description: 'EncryptedSharedPreferences / SharedPreferences wrapper for Master Toggle and Lock config',
    category: 'data',
    content: `package com.notivault.app.data.repository

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class PreferencesRepository(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences("notivault_prefs", Context.MODE_PRIVATE)

    private val _isMasterInterceptEnabled = MutableStateFlow(prefs.getBoolean(KEY_MASTER_INTERCEPT, true))
    val isMasterInterceptEnabled: StateFlow<Boolean> = _isMasterInterceptEnabled.asStateFlow()

    private val _defaultAction = MutableStateFlow(prefs.getString(KEY_DEFAULT_ACTION, "intercept") ?: "intercept")
    val defaultAction: StateFlow<String> = _defaultAction.asStateFlow()

    private val _autoCleanupDays = MutableStateFlow(prefs.getInt(KEY_AUTO_CLEANUP_DAYS, 30))
    val autoCleanupDays: StateFlow<Int> = _autoCleanupDays.asStateFlow()

    private val _isAppLockEnabled = MutableStateFlow(prefs.getBoolean(KEY_APP_LOCK_ENABLED, false))
    val isAppLockEnabled: StateFlow<Boolean> = _isAppLockEnabled.asStateFlow()

    private val _appPinCode = MutableStateFlow(prefs.getString(KEY_APP_PIN, "") ?: "")
    val appPinCode: StateFlow<String> = _appPinCode.asStateFlow()

    fun setMasterIntercept(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_MASTER_INTERCEPT, enabled).apply()
        _isMasterInterceptEnabled.value = enabled
    }

    fun setDefaultAction(action: String) {
        prefs.edit().putString(KEY_DEFAULT_ACTION, action).apply()
        _defaultAction.value = action
    }

    fun setAutoCleanupDays(days: Int) {
        prefs.edit().putInt(KEY_AUTO_CLEANUP_DAYS, days).apply()
        _autoCleanupDays.value = days
    }

    fun setAppLock(enabled: Boolean, pin: String = "") {
        prefs.edit()
            .putBoolean(KEY_APP_LOCK_ENABLED, enabled)
            .putString(KEY_APP_PIN, pin)
            .apply()
        _isAppLockEnabled.value = enabled
        _appPinCode.value = pin
    }

    companion object {
        private const val KEY_MASTER_INTERCEPT = "key_master_intercept"
        private const val KEY_DEFAULT_ACTION = "key_default_action"
        private const val KEY_AUTO_CLEANUP_DAYS = "key_auto_cleanup_days"
        private const val KEY_APP_LOCK_ENABLED = "key_app_lock_enabled"
        private const val KEY_APP_PIN = "key_app_pin"
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/service/NotificationInterceptorService.kt',
    description: 'Core NotificationListenerService: extracts details, protects ongoing notifications, and cancels shade popups',
    category: 'service',
    content: `package com.notivault.app.service

import android.app.Notification
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.notivault.app.NotiVaultApplication
import com.notivault.app.data.local.entity.NotificationEntity
import com.notivault.app.util.NotificationExtractor
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

class NotificationInterceptorService : NotificationListenerService() {

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    // Known critical apps that should never be intercepted from status bar
    private val protectedPackages = setOf(
        "com.google.android.dialer",
        "com.android.server.telecom",
        "com.samsung.android.dialer",
        "com.google.android.deskclock",
        "com.sec.android.app.clockpackage",
        "com.android.emergency"
    )

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.i(TAG, "NotiVault NotificationListenerService connected successfully")
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        Log.w(TAG, "NotificationListenerService disconnected! Requesting rebind...")
        // Request rebind to survive system resource cleanup
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            requestRebind(ComponentName(this, NotificationInterceptorService::class.java))
        }
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        val pkgName = sbn.packageName

        // 1. Skip our own app's notifications to prevent infinite loops
        if (pkgName == packageName) return

        val notification = sbn.notification ?: return

        // 2. Extract title, text, subtext, bigText
        val extracted = NotificationExtractor.extract(this, sbn)

        // 3. Check if ongoing / foreground service / non-clearable
        val isOngoing = (notification.flags and Notification.FLAG_ONGOING_EVENT) != 0 ||
                (notification.flags and Notification.FLAG_FOREGROUND_SERVICE) != 0 ||
                (notification.flags and Notification.FLAG_NO_CLEAR) != 0

        // 4. Compute content hash to detect duplicate spam
        val contentHash = NotificationExtractor.computeContentHash(
            pkgName,
            extracted.title,
            extracted.text,
            extracted.bigText
        )

        serviceScope.launch {
            try {
                val app = NotiVaultApplication.instance
                val repo = app.notificationRepository
                val rulesRepo = app.appRuleRepository
                val prefsRepo = app.preferencesRepository

                // Check duplicate: if same key and same content hash was received within last 3 seconds
                val existing = repo.getLatestByKey(sbn.key)
                if (existing != null && existing.contentHash == contentHash &&
                    (System.currentTimeMillis() - existing.timestamp < 3000)
                ) {
                    // Skip identical duplicate
                    return@launch
                }

                // Determine interception decision
                val masterInterceptOn = prefsRepo.isMasterInterceptEnabled.value
                val appRule = rulesRepo.getRuleForPackage(pkgName)
                val defaultAction = prefsRepo.defaultAction.value

                val isProtectedApp = protectedPackages.contains(pkgName) || (appRule?.isProtected == true)

                val shouldInterceptThisApp = if (isProtectedApp) {
                    false
                } else if (appRule != null) {
                    appRule.shouldIntercept
                } else {
                    defaultAction == "intercept"
                }

                val willIntercept = masterInterceptOn && shouldInterceptThisApp && !isOngoing

                // 5. Store in Room database
                val entity = NotificationEntity(
                    notificationKey = sbn.key,
                    packageName = pkgName,
                    appName = extracted.appName,
                    title = extracted.title,
                    text = extracted.text,
                    bigText = extracted.bigText,
                    subText = extracted.subText,
                    timestamp = sbn.postTime.takeIf { it > 0 } ?: System.currentTimeMillis(),
                    category = notification.category,
                    channelId = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) notification.channelId else null,
                    isIntercepted = willIntercept,
                    isOngoing = isOngoing,
                    isRead = false,
                    contentHash = contentHash
                )

                repo.insertNotification(entity)

                // 6. If intercept is ON and it is clearable, dismiss from notification shade
                if (willIntercept) {
                    try {
                        cancelNotification(sbn.key)
                        Log.d(TAG, "Intercepted and dismissed from shade: \${sbn.key}")
                    } catch (e: Exception) {
                        Log.e(TAG, "Failed to cancel notification: \${e.message}")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error processing notification: \${e.message}", e)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    companion object {
        private const val TAG = "NotiVaultService"

        fun ensureRebound(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                try {
                    requestRebind(ComponentName(context, NotificationInterceptorService::class.java))
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to trigger requestRebind: \${e.message}")
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/service/BootReceiver.kt',
    description: 'BroadcastReceiver ensuring the listener is rebound after phone restart',
    category: 'service',
    content: `package com.notivault.app.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (context == null || intent == null) return
        val action = intent.action
        Log.i("BootReceiver", "Received boot event: \$action")

        if (action == Intent.ACTION_BOOT_COMPLETED ||
            action == Intent.ACTION_MY_PACKAGE_REPLACED ||
            action == "android.intent.action.QUICKBOOT_POWERON"
        ) {
            NotificationInterceptorService.ensureRebound(context)
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/worker/CleanupWorker.kt',
    description: 'WorkManager periodic worker purging notifications older than user retention policy',
    category: 'service',
    content: `package com.notivault.app.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.notivault.app.NotiVaultApplication
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CleanupWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            val app = NotiVaultApplication.instance
            val cleanupDays = app.preferencesRepository.autoCleanupDays.value

            if (cleanupDays > 0) {
                val cutoffTimestamp = System.currentTimeMillis() - (cleanupDays.toLong() * 24L * 60L * 60L * 1000L)
                val deletedCount = app.notificationRepository.deleteOlderThan(cutoffTimestamp)
                android.util.Log.i("CleanupWorker", "Auto-cleanup deleted \$deletedCount notifications older than \$cleanupDays days.")
            }
            Result.success()
        } catch (e: Exception) {
            android.util.Log.e("CleanupWorker", "Cleanup failed: \${e.message}")
            Result.retry()
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/util/NotificationExtractor.kt',
    description: 'Helper class extracting app label, text, big text, and calculating hash codes',
    category: 'util',
    content: `package com.notivault.app.util

import android.app.Notification
import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.service.notification.StatusBarNotification
import java.security.MessageDigest

data class ExtractedNotification(
    val appName: String,
    val title: String?,
    val text: String?,
    val bigText: String?,
    val subText: String?
)

object NotificationExtractor {

    fun extract(context: Context, sbn: StatusBarNotification): ExtractedNotification {
        val pm = context.packageManager
        val pkgName = sbn.packageName

        val appName = try {
            val appInfo = pm.getApplicationInfo(pkgName, PackageManager.GET_META_DATA)
            pm.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            pkgName
        }

        val extras: Bundle? = sbn.notification?.extras

        var title: String? = extras?.getCharSequence(Notification.EXTRA_TITLE)?.toString()
        var text: String? = extras?.getCharSequence(Notification.EXTRA_TEXT)?.toString()
        val bigText: String? = extras?.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()
        val subText: String? = extras?.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString()

        // Fallback for messaging style conversation notifications
        if (text == null && extras?.containsKey(Notification.EXTRA_MESSAGES) == true) {
            text = "[Message Conversation]"
        }

        return ExtractedNotification(
            appName = appName,
            title = title?.trim()?.takeIf { it.isNotEmpty() },
            text = text?.trim()?.takeIf { it.isNotEmpty() },
            bigText = bigText?.trim()?.takeIf { it.isNotEmpty() },
            subText = subText?.trim()?.takeIf { it.isNotEmpty() }
        )
    }

    fun computeContentHash(packageName: String, title: String?, text: String?, bigText: String?): String {
        val raw = "\$packageName|\${title ?: ""}|\${text ?: ""}|\${bigText ?: ""}"
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(raw.toByteArray())
        return digest.fold("") { str, it -> str + "%02x".format(it) }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/util/ExportUtil.kt',
    description: 'Utility for exporting stored notifications to JSON and CSV formats with file share Intent',
    category: 'util',
    content: `package com.notivault.app.util

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.notivault.app.data.local.entity.NotificationEntity
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object ExportUtil {

    fun exportToJson(context: Context, notifications: List<NotificationEntity>): File {
        val jsonArray = JSONArray()
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())

        for (item in notifications) {
            val obj = JSONObject().apply {
                put("id", item.id)
                put("packageName", item.packageName)
                put("appName", item.appName)
                put("title", item.title ?: "")
                put("text", item.text ?: "")
                put("bigText", item.bigText ?: "")
                put("subText", item.subText ?: "")
                put("timestamp", item.timestamp)
                put("formattedDate", dateFormat.format(Date(item.timestamp)))
                put("category", item.category ?: "")
                put("channelId", item.channelId ?: "")
                put("isIntercepted", item.isIntercepted)
                put("isOngoing", item.isOngoing)
            }
            jsonArray.put(obj)
        }

        val exportDir = File(context.cacheDir, "exports").apply { mkdirs() }
        val file = File(exportDir, "notivault_export_\${System.currentTimeMillis()}.json")
        file.writeText(jsonArray.toString(2))
        return file
    }

    fun exportToCsv(context: Context, notifications: List<NotificationEntity>): File {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        val sb = StringBuilder()
        sb.append("ID,PackageName,AppName,Title,Text,SubText,Timestamp,Date,Category,Intercepted,Ongoing\\n")

        for (item in notifications) {
            sb.append("\${item.id},")
            sb.append("\"\${escapeCsv(item.packageName)}\",")
            sb.append("\"\${escapeCsv(item.appName)}\",")
            sb.append("\"\${escapeCsv(item.title ?: "")}\",")
            sb.append("\"\${escapeCsv(item.text ?: "")}\",")
            sb.append("\"\${escapeCsv(item.subText ?: "")}\",")
            sb.append("\${item.timestamp},")
            sb.append("\"\${dateFormat.format(Date(item.timestamp))}\",")
            sb.append("\"\${escapeCsv(item.category ?: "")}\",")
            sb.append("\${item.isIntercepted},")
            sb.append("\${item.isOngoing}\\n")
        }

        val exportDir = File(context.cacheDir, "exports").apply { mkdirs() }
        val file = File(exportDir, "notivault_export_\${System.currentTimeMillis()}.csv")
        file.writeText(sb.toString())
        return file
    }

    private fun escapeCsv(str: String): String {
        return str.replace("\"", "\"\"").replace("\\n", " ").replace("\\r", "")
    }

    fun shareExportedFile(context: Context, file: File, mimeType: String) {
        val uri = FileProvider.getUriForFile(context, "\${context.packageName}.fileprovider", file)
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = mimeType
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(shareIntent, "Export Notifications"))
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/theme/Color.kt',
    description: 'Material 3 dynamic color palette tokens',
    category: 'ui',
    content: `package com.notivault.app.ui.theme

import androidx.compose.ui.graphics.Color

val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)

val Slate950 = Color(0xFF0F172A)
val Slate900 = Color(0xFF1E293B)
val Slate800 = Color(0xFF334155)
val Emerald500 = Color(0xFF10B981)
val Rose500 = Color(0xFFF43F5E)
val Amber500 = Color(0xFFF59E0B)
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/theme/Theme.kt',
    description: 'Material 3 theme composable with Dynamic Color support on Android 12+',
    category: 'ui',
    content: `package com.notivault.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = Purple80,
    secondary = PurpleGrey80,
    tertiary = Pink80,
    background = Slate950,
    surface = Slate900
)

private val LightColorScheme = lightColorScheme(
    primary = Purple40,
    secondary = PurpleGrey40,
    tertiary = Pink40
)

@Composable
fun NotiVaultTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/navigation/Screen.kt',
    description: 'Navigation routes and bottom navigation bar destination specs',
    category: 'ui',
    content: `package com.notivault.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inbox
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector? = null) {
    object Inbox : Screen("inbox", "Inbox", Icons.Default.Inbox)
    object Rules : Screen("rules", "App Rules", Icons.Default.Security)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
    object Onboarding : Screen("onboarding", "Permissions Setup")
    object Lock : Screen("lock", "Unlock Vault")
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/inbox/InboxViewModel.kt',
    description: 'ViewModel managing notification list, group vs flat view, search, multi-selection, and deletion',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.inbox

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.notivault.app.NotiVaultApplication
import com.notivault.app.data.local.dao.AppSummary
import com.notivault.app.data.local.entity.NotificationEntity
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class InboxViewModel : ViewModel() {

    private val repository = NotiVaultApplication.instance.notificationRepository
    private val prefs = NotiVaultApplication.instance.preferencesRepository

    val isMasterIntercept: StateFlow<Boolean> = prefs.isMasterInterceptEnabled
    val unreadCount: StateFlow<Int> = repository.unreadCount
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val distinctApps: StateFlow<List<AppSummary>> = repository.distinctApps
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Search and filters
    val searchQuery = MutableStateFlow("")
    val selectedAppFilter = MutableStateFlow<String?>(null)
    val isGroupedByApp = MutableStateFlow(true)

    // Selection mode for batch delete
    val isSelectionMode = MutableStateFlow(false)
    val selectedIds = MutableStateFlow<Set<Long>>(emptySet())

    // Selected notification for detail modal
    val selectedNotification = MutableStateFlow<NotificationEntity?>(null)

    val notifications: StateFlow<List<NotificationEntity>> = combine(
        searchQuery,
        selectedAppFilter
    ) { query, app ->
        Pair(query.takeIf { it.isNotBlank() }, app)
    }.flatMapLatest { (query, app) ->
        repository.getFiltered(
            packageName = app,
            searchQuery = query,
            startDate = null,
            endDate = null
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleMasterIntercept() {
        val current = isMasterIntercept.value
        prefs.setMasterIntercept(!current)
    }

    fun toggleSelectionMode() {
        val active = !isSelectionMode.value
        isSelectionMode.value = active
        if (!active) {
            selectedIds.value = emptySet()
        }
    }

    fun toggleSelectItem(id: Long) {
        val set = selectedIds.value.toMutableSet()
        if (set.contains(id)) {
            set.remove(id)
        } else {
            set.add(id)
        }
        selectedIds.value = set
        if (set.isEmpty() && isSelectionMode.value) {
            // Keep selection mode active or allow user to exit
        }
    }

    fun deleteNotification(id: Long) {
        viewModelScope.launch {
            repository.deleteById(id)
        }
    }

    fun deleteSelected() {
        val ids = selectedIds.value.toList()
        viewModelScope.launch {
            repository.deleteByIds(ids)
            selectedIds.value = emptySet()
            isSelectionMode.value = false
        }
    }

    fun deleteAll() {
        viewModelScope.launch {
            repository.deleteAll()
        }
    }

    fun deleteFromApp(packageName: String) {
        viewModelScope.launch {
            repository.deleteByPackage(packageName)
        }
    }

    fun markAsRead(id: Long) {
        viewModelScope.launch {
            repository.markAsRead(id)
        }
    }

    fun markAllAsRead() {
        viewModelScope.launch {
            repository.markAllAsRead()
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/inbox/InboxScreen.kt',
    description: 'Jetpack Compose Inbox UI with Collapsible App Groups, Swipe-to-Dismiss, Master Switch, and Badges',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.inbox

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.notivault.app.data.local.entity.NotificationEntity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InboxScreen(
    viewModel: InboxViewModel,
    modifier: Modifier = Modifier
) {
    val notifications by viewModel.notifications.collectAsState()
    val isMasterIntercept by viewModel.isMasterIntercept.collectAsState()
    val unreadCount by viewModel.unreadCount.collectAsState()
    val isGrouped by viewModel.isGroupedByApp.collectAsState()
    val isSelectionMode by viewModel.isSelectionMode.collectAsState()
    val selectedIds by viewModel.selectedIds.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedAppFilter by viewModel.selectedAppFilter.collectAsState()
    val distinctApps by viewModel.distinctApps.collectAsState()
    val selectedItemForDetail by viewModel.selectedNotification.collectAsState()

    var showDeleteAllDialog by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = if (isSelectionMode) "\${selectedIds.size} Selected" else "Inbox",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        if (!isSelectionMode && unreadCount > 0) {
                            Text(
                                text = "\$unreadCount unread notifications",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                },
                actions = {
                    if (isSelectionMode) {
                        IconButton(onClick = { viewModel.deleteSelected() }) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete Selected")
                        }
                        IconButton(onClick = { viewModel.toggleSelectionMode() }) {
                            Icon(Icons.Default.Close, contentDescription = "Cancel")
                        }
                    } else {
                        IconButton(onClick = { viewModel.isGroupedByApp.value = !isGrouped }) {
                            Icon(
                                if (isGrouped) Icons.Default.ViewAgenda else Icons.Default.ViewList,
                                contentDescription = "Toggle Grouping"
                            )
                        }
                        IconButton(onClick = { showDeleteAllDialog = true }) {
                            Icon(Icons.Default.DeleteSweep, contentDescription = "Clear All")
                        }
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Master Intercept Banner
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(16.dp),
                color = if (isMasterIntercept) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isMasterIntercept) "Intercept Mode Active" else "Intercept Mode Paused",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (isMasterIntercept)
                                "Notifications hidden from status bar & saved here"
                            else
                                "Notifications appear in status bar normally",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Switch(
                        checked = isMasterIntercept,
                        onCheckedChange = { viewModel.toggleMasterIntercept() }
                    )
                }
            }

            // Search Bar & Filter chips
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.searchQuery.value = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                placeholder = { Text("Search notification text or title...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.searchQuery.value = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(12.dp)
            )

            // Notifications List
            if (notifications.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.NotificationsNone,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.outline
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No notifications yet",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Incoming notifications will be securely intercepted and displayed here.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.outline
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (isGrouped) {
                        val grouped = notifications.groupBy { it.packageName }
                        grouped.forEach { (pkg, items) ->
                            item(key = "header_\$pkg") {
                                AppGroupHeader(
                                    appName = items.firstOrNull()?.appName ?: pkg,
                                    count = items.size,
                                    onClearGroup = { viewModel.deleteFromApp(pkg) }
                                )
                            }
                            items(items, key = { it.id }) { item ->
                                NotificationRowItem(
                                    notification = item,
                                    isSelected = selectedIds.contains(item.id),
                                    isSelectionMode = isSelectionMode,
                                    onClick = {
                                        if (isSelectionMode) {
                                            viewModel.toggleSelectItem(item.id)
                                        } else {
                                            viewModel.markAsRead(item.id)
                                            viewModel.selectedNotification.value = item
                                        }
                                    },
                                    onLongClick = {
                                        if (!isSelectionMode) {
                                            viewModel.toggleSelectionMode()
                                        }
                                        viewModel.toggleSelectItem(item.id)
                                    },
                                    onDismiss = { viewModel.deleteNotification(item.id) }
                                )
                            }
                        }
                    } else {
                        items(notifications, key = { it.id }) { item ->
                            NotificationRowItem(
                                notification = item,
                                isSelected = selectedIds.contains(item.id),
                                isSelectionMode = isSelectionMode,
                                onClick = {
                                    if (isSelectionMode) {
                                        viewModel.toggleSelectItem(item.id)
                                    } else {
                                        viewModel.markAsRead(item.id)
                                        viewModel.selectedNotification.value = item
                                    }
                                },
                                onLongClick = {
                                    if (!isSelectionMode) {
                                        viewModel.toggleSelectionMode()
                                    }
                                    viewModel.toggleSelectItem(item.id)
                                },
                                onDismiss = { viewModel.deleteNotification(item.id) }
                            )
                        }
                    }
                }
            }
        }
    }

    // Detail Bottom Sheet
    selectedItemForDetail?.let { item ->
        NotificationDetailSheet(
            notification = item,
            onDismiss = { viewModel.selectedNotification.value = null },
            onDelete = {
                viewModel.deleteNotification(item.id)
                viewModel.selectedNotification.value = null
            }
        )
    }

    // Confirmation Dialog
    if (showDeleteAllDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteAllDialog = false },
            title = { Text("Delete All Notifications?") },
            text = { Text("This will permanently remove all stored notifications from your device.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.deleteAll()
                        showDeleteAllDialog = false
                    }
                ) {
                    Text("Delete All", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteAllDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun AppGroupHeader(
    appName: String,
    count: Int,
    onClearGroup: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = appName,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Row(verticalAlignment = Alignment.CenterVertically) {
            Badge {
                Text("\$count")
            }
            Spacer(modifier = Modifier.width(8.dp))
            IconButton(onClick = onClearGroup, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Clear, contentDescription = "Clear group", modifier = Modifier.size(16.dp))
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationRowItem(
    notification: NotificationEntity,
    isSelected: Boolean,
    isSelectionMode: Boolean,
    onClick: () -> Unit,
    onLongClick: () -> Unit,
    onDismiss: () -> Unit
) {
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            if (value == SwipeToDismissBoxValue.EndToStart) {
                onDismiss()
                true
            } else {
                false
            }
        }
    )

    SwipeToDismissBox(
        state = dismissState,
        enableDismissFromStartToEnd = false,
        backgroundContent = {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.errorContainer, RoundedCornerShape(12.dp))
                    .padding(horizontal = 20.dp),
                contentAlignment = Alignment.CenterEnd
            ) {
                Icon(
                    Icons.Default.Delete,
                    contentDescription = "Delete",
                    tint = MaterialTheme.colorScheme.onErrorContainer
                )
            }
        }
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(
                containerColor = if (isSelected)
                    MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                else if (!notification.isRead)
                    MaterialTheme.colorScheme.surface
                else
                    MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = if (!notification.isRead) 2.dp else 0.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.Top
            ) {
                if (isSelectionMode) {
                    Checkbox(
                        checked = isSelected,
                        onCheckedChange = { onClick() },
                        modifier = Modifier.padding(end = 8.dp)
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = notification.appName,
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = formatTime(notification.timestamp),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.outline
                        )
                    }

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = notification.title ?: "(No title)",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = if (!notification.isRead) FontWeight.Bold else FontWeight.Medium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = notification.text ?: notification.bigText ?: "(No content)",
                        style = MaterialTheme.typography.bodyMedium,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    if (notification.isOngoing) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Ongoing Foreground Event",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    }
                }
            }
        }
    }
}

fun formatTime(timestamp: Long): String {
    val sdf = SimpleDateFormat("h:mm a", Locale.getDefault())
    return sdf.format(Date(timestamp))
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/inbox/NotificationDetailSheet.kt',
    description: 'ModalBottomSheet presenting full metadata and Launch In Original App button',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.inbox

import android.content.Intent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Launch
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.notivault.app.data.local.entity.NotificationEntity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationDetailSheet(
    notification: NotificationEntity,
    onDismiss: () -> Unit,
    onDelete: () -> Unit
) {
    val context = LocalContext.current
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val dateFormat = SimpleDateFormat("MMM d, yyyy · h:mm:ss a", Locale.getDefault())

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = notification.appName,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = notification.title ?: "(No Title)",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = dateFormat.format(Date(notification.timestamp)),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.outline
            )

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(16.dp))

            // Body text
            Text(
                text = notification.bigText ?: notification.text ?: "(No Content)",
                style = MaterialTheme.typography.bodyLarge,
                lineHeight = MaterialTheme.typography.bodyLarge.lineHeight
            )

            if (notification.subText != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Subtext: \${notification.subText}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(20.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(16.dp))

            // Technical metadata breakdown
            Text(
                text = "TECHNICAL METADATA",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.outline
            )

            Spacer(modifier = Modifier.height(8.dp))
            MetadataRow("Package", notification.packageName)
            MetadataRow("Channel ID", notification.channelId ?: "Default")
            MetadataRow("Category", notification.category ?: "None")
            MetadataRow("Intercepted", if (notification.isIntercepted) "Yes (Hidden from Shade)" else "No (Allowed Through)")
            MetadataRow("Ongoing Event", if (notification.isOngoing) "Yes (Call/Media/Foreground)" else "No")

            Spacer(modifier = Modifier.height(24.dp))

            // Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = {
                        val launchIntent = context.packageManager.getLaunchIntentForPackage(notification.packageName)
                        if (launchIntent != null) {
                            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            context.startActivity(launchIntent)
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Launch, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Open in App")
                }

                OutlinedButton(
                    onClick = onDelete,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
                ) {
                    Icon(Icons.Default.Delete, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Delete")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun MetadataRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.outline)
        Text(text = value, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Medium)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/rules/RulesViewModel.kt',
    description: 'ViewModel managing installed apps and individual interception toggles',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.rules

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.notivault.app.NotiVaultApplication
import com.notivault.app.data.local.entity.AppRuleEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class InstalledAppItem(
    val packageName: String,
    val appName: String,
    val shouldIntercept: Boolean,
    val isProtected: Boolean
)

class RulesViewModel : ViewModel() {

    private val rulesRepo = NotiVaultApplication.instance.appRuleRepository
    private val prefsRepo = NotiVaultApplication.instance.preferencesRepository

    val searchQuery = MutableStateFlow("")

    val rules = rulesRepo.allRules
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleAppIntercept(app: InstalledAppItem) {
        if (app.isProtected) return
        viewModelScope.launch {
            rulesRepo.setRule(
                packageName = app.packageName,
                appName = app.appName,
                shouldIntercept = !app.shouldIntercept,
                isProtected = app.isProtected
            )
        }
    }

    fun setAll(intercept: Boolean) {
        viewModelScope.launch {
            rulesRepo.setAllInterceptStatus(intercept)
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/rules/RulesScreen.kt',
    description: 'Jetpack Compose Screen for managing per-app interception rules and protected exclusions',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.rules

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RulesScreen(
    viewModel: RulesViewModel,
    modifier: Modifier = Modifier
) {
    val rules by viewModel.rules.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()

    val filteredRules = remember(rules, searchQuery) {
        if (searchQuery.isBlank()) rules else rules.filter {
            it.appName.contains(searchQuery, ignoreCase = true) || it.packageName.contains(searchQuery, ignoreCase = true)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Per-App Rules", fontWeight = FontWeight.Bold) },
                actions = {
                    TextButton(onClick = { viewModel.setAll(true) }) {
                        Text("Intercept All")
                    }
                    TextButton(onClick = { viewModel.setAll(false) }) {
                        Text("Allow All")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.searchQuery.value = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("Search installed applications...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                singleLine = true,
                shape = RoundedCornerShape(12.dp)
            )

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(filteredRules, key = { it.packageName }) { rule ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = rule.appName,
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    if (rule.isProtected) {
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Icon(
                                            Icons.Default.Shield,
                                            contentDescription = "Protected",
                                            modifier = Modifier.size(16.dp),
                                            tint = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                }
                                Text(
                                    text = if (rule.isProtected) "Protected System App (Always Passed Through)" else rule.packageName,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.outline
                                )
                            }

                            if (!rule.isProtected) {
                                Switch(
                                    checked = rule.shouldIntercept,
                                    onCheckedChange = {
                                        viewModel.toggleAppIntercept(
                                            InstalledAppItem(
                                                packageName = rule.packageName,
                                                appName = rule.appName,
                                                shouldIntercept = rule.shouldIntercept,
                                                isProtected = rule.isProtected
                                            )
                                        )
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/settings/SettingsViewModel.kt',
    description: 'ViewModel controlling master settings, auto cleanup days, biometric app lock, and data export',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.settings

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.notivault.app.NotiVaultApplication
import com.notivault.app.util.ExportUtil
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class SettingsViewModel : ViewModel() {

    private val prefs = NotiVaultApplication.instance.preferencesRepository
    private val repo = NotiVaultApplication.instance.notificationRepository

    val masterIntercept = prefs.isMasterInterceptEnabled
    val defaultAction = prefs.defaultAction
    val autoCleanupDays = prefs.autoCleanupDays
    val isAppLockEnabled = prefs.isAppLockEnabled

    fun setMasterIntercept(enabled: Boolean) = prefs.setMasterIntercept(enabled)
    fun setAutoCleanupDays(days: Int) = prefs.setAutoCleanupDays(days)
    fun setAppLock(enabled: Boolean, pin: String = "") = prefs.setAppLock(enabled, pin)

    fun exportData(context: Context, format: String) {
        viewModelScope.launch {
            val list = repo.allNotifications.first()
            if (format == "json") {
                val file = ExportUtil.exportToJson(context, list)
                ExportUtil.shareExportedFile(context, file, "application/json")
            } else {
                val file = ExportUtil.exportToCsv(context, list)
                ExportUtil.shareExportedFile(context, file, "text/csv")
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/settings/SettingsScreen.kt',
    description: 'Settings UI with Auto-Cleanup Selector, Biometric App Lock Toggle, Export JSON/CSV, and Battery Tip Links',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.settings

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel,
    onNavigateToOnboarding: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val masterIntercept by viewModel.masterIntercept.collectAsState()
    val autoCleanupDays by viewModel.autoCleanupDays.collectAsState()
    val isAppLockEnabled by viewModel.isAppLockEnabled.collectAsState()

    var showCleanupDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.Bold) }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Interception Category
            Text("INTERCEPTION & PRIVACY", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)

            Card(shape = RoundedCornerShape(12.dp)) {
                Column {
                    ListItem(
                        headlineContent = { Text("Master Intercept Switch") },
                        supportingContent = { Text("Cancel notifications from notification shade") },
                        trailingContent = {
                            Switch(
                                checked = masterIntercept,
                                onCheckedChange = { viewModel.setMasterIntercept(it) }
                            )
                        }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Auto-Delete Retention") },
                        supportingContent = {
                            Text(if (autoCleanupDays == 0) "Keep Forever" else "Delete after \$autoCleanupDays days")
                        },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { showCleanupDialog = true }
                    )
                }
            }

            // Security Category
            Text("SECURITY", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)

            Card(shape = RoundedCornerShape(12.dp)) {
                Column {
                    ListItem(
                        headlineContent = { Text("Biometric / PIN Lock") },
                        supportingContent = { Text("Require authentication when opening NotiVault") },
                        trailingContent = {
                            Switch(
                                checked = isAppLockEnabled,
                                onCheckedChange = { viewModel.setAppLock(it) }
                            )
                        }
                    )
                }
            }

            // Data Export Category
            Text("DATA EXPORT", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)

            Card(shape = RoundedCornerShape(12.dp)) {
                Column {
                    ListItem(
                        headlineContent = { Text("Export Notifications as JSON") },
                        supportingContent = { Text("Download complete structured notification log") },
                        leadingContent = { Icon(Icons.Default.Download, contentDescription = null) },
                        modifier = Modifier.clickable { viewModel.exportData(context, "json") }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Export Notifications as CSV") },
                        supportingContent = { Text("Spreadsheet compatible format") },
                        leadingContent = { Icon(Icons.Default.TableChart, contentDescription = null) },
                        modifier = Modifier.clickable { viewModel.exportData(context, "csv") }
                    )
                }
            }

            // Diagnostics & Background Restrictions
            Text("SYSTEM & PERMISSIONS", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)

            Card(shape = RoundedCornerShape(12.dp)) {
                Column {
                    ListItem(
                        headlineContent = { Text("Permission & Battery Optimization Wizard") },
                        supportingContent = { Text("Configure Notification Access and OEM auto-kill exemptions") },
                        leadingContent = { Icon(Icons.Default.BatteryAlert, contentDescription = null) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onNavigateToOnboarding() }
                    )
                }
            }
        }
    }

    if (showCleanupDialog) {
        val options = listOf(0 to "Keep Forever", 7 to "7 Days", 30 to "30 Days", 90 to "90 Days")
        AlertDialog(
            onDismissRequest = { showCleanupDialog = false },
            title = { Text("Select Retention Period") },
            text = {
                Column {
                    options.forEach { (days, label) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.setAutoCleanupDays(days)
                                    showCleanupDialog = false
                                }
                                .padding(vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(selected = autoCleanupDays == days, onClick = null)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(label)
                        }
                    }
                }
            },
            confirmButton = {}
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/screens/onboarding/OnboardingScreen.kt',
    description: 'Onboarding & Permission flow guiding Notification Access and OEM battery optimizations',
    category: 'ui',
    content: `package com.notivault.app.ui.screens.onboarding

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.app.NotificationManagerCompat

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnboardingScreen(
    onFinish: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var isNotificationAccessGranted by remember {
        mutableStateOf(isNotificationServiceEnabled(context))
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Permissions & Setup", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onFinish) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Notification Access card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isNotificationAccessGranted)
                        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
                    else
                        MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.3f)
                )
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            if (isNotificationAccessGranted) Icons.Default.CheckCircle else Icons.Default.Warning,
                            contentDescription = null,
                            tint = if (isNotificationAccessGranted) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = if (isNotificationAccessGranted) "Notification Access Granted" else "Notification Access Required",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Android requires explicit permission for NotiVault to listen to incoming notifications and hide them from the status bar.",
                        style = MaterialTheme.typography.bodyMedium
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = {
                            val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                            context.startActivity(intent)
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(if (isNotificationAccessGranted) "Open Settings Again" else "Grant Notification Access")
                    }
                }
            }

            // Battery Optimization card
            Card(shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Disable Battery Optimization",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "To guarantee the background service never gets killed by Android during sleep, disable battery optimization for NotiVault.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    OutlinedButton(
                        onClick = {
                            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                                data = Uri.parse("package:\${context.packageName}")
                            }
                            context.startActivity(intent)
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Disable Battery Restrictions")
                    }
                }
            }

            // OEM Tips Card
            Card(shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "OEM Background Guides",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "• Samsung (One UI): Settings > Apps > NotiVault > Battery > Select 'Unrestricted'. Ensure App is removed from 'Sleeping Apps'.\\n" +
                                "• Xiaomi (MIUI / HyperOS): Enable 'Autostart' in App Info and set Battery Saver to 'No Restrictions'.\\n" +
                                "• OnePlus / Oppo / Realme: Enable 'Allow background activity' and disable 'Auto-optimize'.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Button(
                onClick = onFinish,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Continue to Vault")
            }
        }
    }
}

fun isNotificationServiceEnabled(context: Context): Boolean {
    val pkgName = context.packageName
    val enabledPackages = NotificationManagerCompat.getEnabledListenerPackages(context)
    return enabledPackages.contains(pkgName)
}
`
  },
  {
    path: 'app/src/main/java/com/notivault/app/ui/MainActivity.kt',
    description: 'Main Activity setting up Navigation Compose, BiometricPrompt, and bottom navigation bar',
    category: 'ui',
    content: `package com.notivault.app.ui

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.notivault.app.ui.navigation.Screen
import com.notivault.app.ui.screens.inbox.InboxScreen
import com.notivault.app.ui.screens.inbox.InboxViewModel
import com.notivault.app.ui.screens.onboarding.OnboardingScreen
import com.notivault.app.ui.screens.rules.RulesScreen
import com.notivault.app.ui.screens.rules.RulesViewModel
import com.notivault.app.ui.screens.settings.SettingsScreen
import com.notivault.app.ui.screens.settings.SettingsViewModel
import com.notivault.app.ui.theme.NotiVaultTheme

class MainActivity : AppCompatActivity() {

    private val inboxViewModel: InboxViewModel by viewModels()
    private val rulesViewModel: RulesViewModel by viewModels()
    private val settingsViewModel: SettingsViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            NotiVaultTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                val bottomBarScreens = listOf(
                    Screen.Inbox,
                    Screen.Rules,
                    Screen.Settings
                )

                val showBottomBar = currentRoute in bottomBarScreens.map { it.route }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        if (showBottomBar) {
                            NavigationBar {
                                bottomBarScreens.forEach { screen ->
                                    NavigationBarItem(
                                        icon = { screen.icon?.let { Icon(it, contentDescription = screen.title) } },
                                        label = { Text(screen.title) },
                                        selected = currentRoute == screen.route,
                                        onClick = {
                                            if (currentRoute != screen.route) {
                                                navController.navigate(screen.route) {
                                                    popUpTo(Screen.Inbox.route) { saveState = true }
                                                    launchSingleTop = true
                                                    restoreState = true
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Inbox.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(Screen.Inbox.route) {
                            InboxScreen(viewModel = inboxViewModel)
                        }
                        composable(Screen.Rules.route) {
                            RulesScreen(viewModel = rulesViewModel)
                        }
                        composable(Screen.Settings.route) {
                            SettingsScreen(
                                viewModel = settingsViewModel,
                                onNavigateToOnboarding = { navController.navigate(Screen.Onboarding.route) }
                            )
                        }
                        composable(Screen.Onboarding.route) {
                            OnboardingScreen(
                                onFinish = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}
`
  }
];
