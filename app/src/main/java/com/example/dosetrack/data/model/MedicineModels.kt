package com.example.dosetrack.data.model

import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter

enum class MedicineForm(val label: String, val iconEmoji: String) {
    TABLET("Tablet", "⚪"),
    CAPSULE("Capsule", "💊"),
    LIQUID("Liquid", "💧"),
    DROPS("Drops", "👁️"),
    INHALER("Inhaler", "💨"),
    INJECTION("Injection", "💉"),
    CREAM("Cream", "🧴"),
    POWDER("Powder", "🥄")
}

enum class FoodInstruction(val label: String) {
    WITH_FOOD("With food"),
    BEFORE_FOOD("Before food"),
    AFTER_FOOD("After food"),
    EMPTY_STOMACH("Empty stomach"),
    ANYTIME("Anytime")
}

enum class AccentColor(val hex: Long) {
    SKY(0xFF0284C7),
    EMERALD(0xFF10B981),
    AMBER(0xFFF59E0B),
    INDIGO(0xFF6366F1),
    ROSE(0xFFF43F5E),
    PURPLE(0xFFA855F7),
    TEAL(0xFF14B8A6)
}

enum class DoseStatus {
    TAKEN,
    SKIPPED,
    PENDING
}

enum class TimeWindow(val title: String, val timeRange: String) {
    MORNING("Morning", "06:00 – 12:00"),
    AFTERNOON("Afternoon", "12:00 – 17:00"),
    EVENING("Evening", "17:00 – 21:00"),
    NIGHT("Night", "21:00 – 06:00")
}

data class Medicine(
    val id: String,
    val name: String,
    val dosage: String,
    val form: MedicineForm = MedicineForm.TABLET,
    val color: AccentColor = AccentColor.SKY,
    val scheduleTimes: List<String>, // ["08:30", "20:00"]
    val instructions: FoodInstruction = FoodInstruction.WITH_FOOD,
    val stockTotal: Int = 30,
    val stockLowAlertThreshold: Int = 7,
    val unit: String = "pills",
    val notes: String = "",
    val doctorName: String = "",
    val rxNumber: String = "",
    val imageUrl: String = "",
    val isActive: Boolean = true,
    val startDate: String = LocalDate.now().toString(),
    val createdAt: Long = System.currentTimeMillis()
)

data class DoseLog(
    val id: String,
    val medicineId: String,
    val date: String, // YYYY-MM-DD
    val scheduledTime: String, // HH:mm
    val status: DoseStatus,
    val loggedAt: Long = System.currentTimeMillis(),
    val notes: String = "",
    val skippedReason: String? = null
)

data class ScheduledDoseItem(
    val id: String,
    val medicine: Medicine,
    val date: String,
    val scheduledTime: String,
    val status: DoseStatus,
    val loggedAt: Long? = null,
    val timeWindow: TimeWindow
)

data class ReminderNotification(
    val id: String,
    val medicineId: String,
    val medicineName: String,
    val dosage: String,
    val time: String,
    val instructions: FoodInstruction,
    val color: AccentColor,
    val timestamp: Long = System.currentTimeMillis()
)

enum class ThemeMode {
    SYSTEM,
    LIGHT,
    DARK
}

enum class AppLanguage(val code: String, val displayName: String, val nativeName: String) {
    EN("en", "English", "English"),
    HI("hi", "Hindi", "हिन्दी"),
    UR("ur", "Urdu", "اردو")
}

data class UserSettings(
    val soundEnabled: Boolean = true,
    val vibrationEnabled: Boolean = true,
    val snoozeMinutes: Int = 15,
    val remindMinutesBefore: Int = 0,
    val themeMode: ThemeMode = ThemeMode.SYSTEM,
    val language: AppLanguage = AppLanguage.EN
)
