# DoseTrack - Medicine & Pill Reminder (Android)

A modern, native Android application built with Kotlin, Jetpack Compose, and Material Design 3 for tracking daily medicine intake, managing prescriptions, scheduling dosage reminders, and maintaining adherence.

## Architecture & Features

- **Kotlin & Jetpack Compose**: Modern reactive declarative UI built exclusively using Jetpack Compose and Material 3 components.
- **MVVM Architecture**: `MedicineViewModel` with Kotlin Coroutines and reactive `StateFlow` streams.
- **Comprehensive Medicine Data Model**:
  - `Medicine`: Unique ID, name, dosage, form factor (tablet, capsule, liquid, drops, inhaler, etc.), color accent, daily schedule times, meal intake instructions, stock total inventory, low-stock alert threshold, doctor name, and notes.
  - `DoseLog`: Daily dose tracking with taken/skipped timestamps, reasons, and status.
  - `ScheduledDoseItem`: Real-time computation grouped into daily time periods (Morning, Afternoon, Evening, Night).
- **Core Views & Capabilities**:
  1. **Today View**:
     - Interactive horizontal 7-day date scroller with adherence indicators.
     - Daily intake progress card with percentage circular gauge.
     - Low-stock alert banner for medications running low.
     - Dose cards grouped by time of day with quick actions: Take Dose, Skip Dose, Undo, and Snooze.
     - Floating Action Button (FAB) for adding new medications.
  2. **Cabinet View**:
     - Searchable prescription inventory (search by medication name, dosage, doctor, or notes).
     - Form filter chips (All, Tablet, Capsule, Liquid, Drops, Inhaler).
     - Stock level indicator with low stock alert badge.
     - Quick Refill dialog (+15, +30, +60, +90 quantity shortcuts).
     - Pause and resume schedule capabilities.
  3. **History & Insights View**:
     - Adherence streak counter with flame badge.
     - Overall consistency percentage and all-time dose count.
     - 7-day consistency bar chart with daily touch targets.
     - Exportable Doctor Medication Report with copy-to-clipboard functionality.
     - Filterable recent activity log feed (All, Taken, Skipped).
  4. **Settings View**:
     - Multi-language support (English, Hindi हिन्दी, Urdu اردو).
     - Material 3 theme switcher (System match, Light, Dark).
     - In-app dose reminder test trigger.
     - Audio chime and tactile vibration preferences.
     - Configurable snooze duration (5, 10, 15, 30 minutes).
     - Active schedule triggers overview.

## Project Structure

```
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/example/dosetrack/
│       │   ├── MainActivity.kt
│       │   ├── data/
│       │   │   ├── model/MedicineModels.kt
│       │   │   └── repository/MedicineRepository.kt
│       │   └── ui/
│       │       ├── components/
│       │       │   ├── AddEditMedicineDialog.kt
│       │       │   ├── DateScroller.kt
│       │       │   ├── DoseCard.kt
│       │       │   ├── ExportReportDialog.kt
│       │       │   ├── RefillDialog.kt
│       │       │   └── ReminderBanner.kt
│       │       ├── screens/
│       │       │   ├── CabinetScreen.kt
│       │       │   ├── HistoryScreen.kt
│       │       │   ├── SettingsScreen.kt
│       │       │   └── TodayScreen.kt
│       │       ├── theme/
│       │       │   ├── Color.kt
│       │       │   ├── Theme.kt
│       │       │   └── Type.kt
│       │       └── viewmodel/MedicineViewModel.kt
│       └── res/
│           ├── drawable/
│           ├── mipmap-*/
│           └── values/
│               ├── colors.xml
│               ├── strings.xml
│               └── themes.xml
├── gradle/
│   └── libs.versions.toml
├── build.gradle.kts
├── settings.gradle.kts
└── metadata.json
```
