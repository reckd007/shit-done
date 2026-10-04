package com.example.dosetrack.data.repository

import com.example.dosetrack.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import kotlin.math.max

class MedicineRepository {

    private val _medicines = MutableStateFlow<List<Medicine>>(initialMedicines())
    val medicines: StateFlow<List<Medicine>> = _medicines.asStateFlow()

    private val _logs = MutableStateFlow<List<DoseLog>>(initialLogs())
    val logs: StateFlow<List<DoseLog>> = _logs.asStateFlow()

    private val _settings = MutableStateFlow(UserSettings())
    val settings: StateFlow<UserSettings> = _settings.asStateFlow()

    private val _activeReminder = MutableStateFlow<ReminderNotification?>(null)
    val activeReminder: StateFlow<ReminderNotification?> = _activeReminder.asStateFlow()

    fun takeDose(medicineId: String, time: String, date: String) {
        val logId = "log-$date-$medicineId-${time.replace(":", "")}"
        val currentLogs = _logs.value.toMutableList()
        val existingIndex = currentLogs.indexOfFirst {
            it.date == date && it.medicineId == medicineId && it.scheduledTime == time
        }

        if (existingIndex >= 0) {
            currentLogs[existingIndex] = currentLogs[existingIndex].copy(
                status = DoseStatus.TAKEN,
                loggedAt = System.currentTimeMillis()
            )
        } else {
            currentLogs.add(
                DoseLog(
                    id = logId,
                    medicineId = medicineId,
                    date = date,
                    scheduledTime = time,
                    status = DoseStatus.TAKEN,
                    loggedAt = System.currentTimeMillis()
                )
            )
        }
        _logs.value = currentLogs

        // Decrement stock by 1
        _medicines.value = _medicines.value.map { med ->
            if (med.id == medicineId) {
                med.copy(stockTotal = max(0, med.stockTotal - 1))
            } else {
                med
            }
        }

        // Dismiss active reminder if it matches
        if (_activeReminder.value?.medicineId == medicineId) {
            _activeReminder.value = null
        }
    }

    fun undoDose(medicineId: String, time: String, date: String) {
        val existing = _logs.value.find {
            it.date == date && it.medicineId == medicineId && it.scheduledTime == time
        }

        if (existing?.status == DoseStatus.TAKEN) {
            // Restore stock
            _medicines.value = _medicines.value.map { med ->
                if (med.id == medicineId) {
                    med.copy(stockTotal = med.stockTotal + 1)
                } else {
                    med
                }
            }
        }

        _logs.value = _logs.value.filterNot {
            it.date == date && it.medicineId == medicineId && it.scheduledTime == time
        }
    }

    fun skipDose(medicineId: String, time: String, date: String, reason: String? = null) {
        val logId = "log-skip-$date-$medicineId-${time.replace(":", "")}"
        val filtered = _logs.value.filterNot {
            it.date == date && it.medicineId == medicineId && it.scheduledTime == time
        }.toMutableList()

        filtered.add(
            DoseLog(
                id = logId,
                medicineId = medicineId,
                date = date,
                scheduledTime = time,
                status = DoseStatus.SKIPPED,
                loggedAt = System.currentTimeMillis(),
                skippedReason = reason
            )
        )
        _logs.value = filtered

        if (_activeReminder.value?.medicineId == medicineId) {
            _activeReminder.value = null
        }
    }

    fun snoozeDose(medicine: Medicine, time: String) {
        _activeReminder.value = ReminderNotification(
            id = "snooze-${System.currentTimeMillis()}",
            medicineId = medicine.id,
            medicineName = medicine.name,
            dosage = medicine.dosage,
            time = time,
            instructions = medicine.instructions,
            color = medicine.color
        )
    }

    fun dismissReminder() {
        _activeReminder.value = null
    }

    fun triggerTestReminder() {
        val med = _medicines.value.firstOrNull { it.isActive } ?: _medicines.value.first()
        _activeReminder.value = ReminderNotification(
            id = "test-${System.currentTimeMillis()}",
            medicineId = med.id,
            medicineName = med.name,
            dosage = med.dosage,
            time = med.scheduleTimes.firstOrNull() ?: "08:30",
            instructions = med.instructions,
            color = med.color
        )
    }

    fun saveMedicine(medicine: Medicine) {
        val list = _medicines.value.toMutableList()
        val index = list.indexOfFirst { it.id == medicine.id }
        if (index >= 0) {
            list[index] = medicine
        } else {
            list.add(0, medicine)
        }
        _medicines.value = list
    }

    fun deleteMedicine(id: String) {
        _medicines.value = _medicines.value.filterNot { it.id == id }
    }

    fun toggleMedicineActive(id: String) {
        _medicines.value = _medicines.value.map {
            if (it.id == id) it.copy(isActive = !it.isActive) else it
        }
    }

    fun refillStock(medicineId: String, amount: Int) {
        _medicines.value = _medicines.value.map {
            if (it.id == medicineId) it.copy(stockTotal = it.stockTotal + amount) else it
        }
    }

    fun updateSettings(newSettings: UserSettings) {
        _settings.value = newSettings
    }

    fun calculateStreak(): Int {
        var streak = 0
        val today = LocalDate.now()

        for (i in 1..60) {
            val d = today.minusDays(i.toLong())
            val dateKey = d.toString()

            val dayMeds = _medicines.value.filter { it.isActive && it.startDate <= dateKey }
            if (dayMeds.isEmpty()) continue

            var totalDoses = 0
            dayMeds.forEach { totalDoses += it.scheduleTimes.size }

            val dayLogs = _logs.value.filter { it.date == dateKey }
            val taken = dayLogs.count { it.status == DoseStatus.TAKEN }
            val skipped = dayLogs.count { it.status == DoseStatus.SKIPPED }

            if (totalDoses > 0 && taken >= (totalDoses - skipped) && taken > 0) {
                streak++
            } else {
                break
            }
        }

        // Add 1 if today has taken doses
        val todayTaken = _logs.value.count { it.date == today.toString() && it.status == DoseStatus.TAKEN }
        if (todayTaken > 0) streak++

        return streak
    }

    fun generateDoctorReport(): String {
        val today = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.US))
        val sb = StringBuilder()
        sb.append("========================================\n")
        sb.append("DOSETRACK - PATIENT MEDICATION REPORT\n")
        sb.append("Generated on: $today\n")
        sb.append("========================================\n\n")

        sb.append("CURRENT ACTIVE MEDICATIONS (${_medicines.value.size}):\n")
        sb.append("----------------------------------------\n")
        _medicines.value.forEachIndexed { idx, m ->
            sb.append("${idx + 1}. ${m.name} - ${m.dosage}\n")
            sb.append("   Form: ${m.form.name} | Times: ${m.scheduleTimes.joinToString(", ")}\n")
            sb.append("   Instructions: ${m.instructions.label}\n")
            sb.append("   Current Stock: ${m.stockTotal} ${m.unit}\n")
            if (m.doctorName.isNotBlank()) sb.append("   Prescriber: ${m.doctorName}\n")
            if (m.notes.isNotBlank()) sb.append("   Notes: ${m.notes}\n")
            sb.append("\n")
        }

        sb.append("RECENT 7-DAY INTAKE ADHERENCE:\n")
        sb.append("----------------------------------------\n")
        val baseDate = LocalDate.now()
        for (i in 0..6) {
            val d = baseDate.minusDays(i.toLong())
            val dateStr = d.toString()
            val dayLogs = _logs.value.filter { it.date == dateStr }
            val taken = dayLogs.count { it.status == DoseStatus.TAKEN }
            val skipped = dayLogs.count { it.status == DoseStatus.SKIPPED }
            sb.append("$dateStr: $taken Taken, $skipped Skipped\n")
        }

        return sb.toString()
    }

    companion object {
        private fun initialMedicines(): List<Medicine> {
            val baseDate = LocalDate.now().minusDays(25).toString()
            return listOf(
                Medicine(
                    id = "med-1",
                    name = "Metformin",
                    dosage = "500 mg",
                    form = MedicineForm.TABLET,
                    color = AccentColor.SKY,
                    scheduleTimes = listOf("08:30", "20:00"),
                    instructions = FoodInstruction.WITH_FOOD,
                    stockTotal = 48,
                    stockLowAlertThreshold = 10,
                    unit = "pills",
                    notes = "Take with breakfast and dinner to minimize GI upset",
                    doctorName = "Dr. Sarah Mitchell",
                    rxNumber = "RX-884219",
                    startDate = baseDate
                ),
                Medicine(
                    id = "med-2",
                    name = "Lisinopril",
                    dosage = "10 mg",
                    form = MedicineForm.TABLET,
                    color = AccentColor.EMERALD,
                    scheduleTimes = listOf("08:30"),
                    instructions = FoodInstruction.ANYTIME,
                    stockTotal = 22,
                    stockLowAlertThreshold = 7,
                    unit = "pills",
                    notes = "Blood pressure maintenance. Take at same time each morning",
                    doctorName = "Dr. Robert Chen",
                    rxNumber = "RX-491204",
                    startDate = baseDate
                ),
                Medicine(
                    id = "med-3",
                    name = "Vitamin D3 & K2",
                    dosage = "2000 IU",
                    form = MedicineForm.CAPSULE,
                    color = AccentColor.AMBER,
                    scheduleTimes = listOf("09:00"),
                    instructions = FoodInstruction.WITH_FOOD,
                    stockTotal = 65,
                    stockLowAlertThreshold = 15,
                    unit = "capsules",
                    notes = "Fat soluble vitamin; best absorbed with healthy fats",
                    startDate = baseDate
                ),
                Medicine(
                    id = "med-4",
                    name = "Omega 3 Fish Oil",
                    dosage = "1000 mg",
                    form = MedicineForm.CAPSULE,
                    color = AccentColor.TEAL,
                    scheduleTimes = listOf("13:00"),
                    instructions = FoodInstruction.WITH_FOOD,
                    stockTotal = 18,
                    stockLowAlertThreshold = 10,
                    unit = "softgels",
                    notes = "Cardiovascular health",
                    startDate = baseDate
                ),
                Medicine(
                    id = "med-5",
                    name = "Melatonin",
                    dosage = "3 mg",
                    form = MedicineForm.TABLET,
                    color = AccentColor.INDIGO,
                    scheduleTimes = listOf("22:00"),
                    instructions = FoodInstruction.BEFORE_FOOD,
                    stockTotal = 4, // Low stock to trigger alert
                    stockLowAlertThreshold = 7,
                    unit = "tablets",
                    notes = "Take 30 minutes before sleep in a dark room",
                    startDate = baseDate
                )
            )
        }

        private fun initialLogs(): List<DoseLog> {
            val list = mutableListOf<DoseLog>()
            val today = LocalDate.now()

            for (i in 4 downTo 1) {
                val d = today.minusDays(i.toLong()).toString()
                list.add(DoseLog("seed-$d-1-0830", "med-1", d, "08:30", DoseStatus.TAKEN))
                list.add(DoseLog("seed-$d-2-0830", "med-2", d, "08:30", DoseStatus.TAKEN))
                list.add(DoseLog("seed-$d-3-0900", "med-3", d, "09:00", DoseStatus.TAKEN))
                list.add(
                    DoseLog(
                        "seed-$d-4-1300",
                        "med-4",
                        d,
                        "13:00",
                        if (i == 2) DoseStatus.SKIPPED else DoseStatus.TAKEN,
                        skippedReason = if (i == 2) "Away from home" else null
                    )
                )
                list.add(DoseLog("seed-$d-1-2000", "med-1", d, "20:00", DoseStatus.TAKEN))
                list.add(DoseLog("seed-$d-5-2200", "med-5", d, "22:00", DoseStatus.TAKEN))
            }

            // Today's morning doses taken
            val todayStr = today.toString()
            list.add(DoseLog("seed-$todayStr-1-0830", "med-1", todayStr, "08:30", DoseStatus.TAKEN))
            list.add(DoseLog("seed-$todayStr-2-0830", "med-2", todayStr, "08:30", DoseStatus.TAKEN))

            return list
        }
    }
}
