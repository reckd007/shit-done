package com.example.dosetrack.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.dosetrack.data.model.*
import com.example.dosetrack.data.repository.MedicineRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate

class MedicineViewModel(
    private val repository: MedicineRepository = MedicineRepository()
) : ViewModel() {

    val medicines: StateFlow<List<Medicine>> = repository.medicines
    val logs: StateFlow<List<DoseLog>> = repository.logs
    val settings: StateFlow<UserSettings> = repository.settings
    val activeReminder: StateFlow<ReminderNotification?> = repository.activeReminder

    private val _selectedDate = MutableStateFlow<LocalDate>(LocalDate.now())
    val selectedDate: StateFlow<LocalDate> = _selectedDate.asStateFlow()

    private val _currentTab = MutableStateFlow<String>("today")
    val currentTab: StateFlow<String> = _currentTab.asStateFlow()

    // Dialog & Modal states
    private val _showAddEditDialog = MutableStateFlow(false)
    val showAddEditDialog: StateFlow<Boolean> = _showAddEditDialog.asStateFlow()

    private val _medicineToEdit = MutableStateFlow<Medicine?>(null)
    val medicineToEdit: StateFlow<Medicine?> = _medicineToEdit.asStateFlow()

    private val _showRefillDialog = MutableStateFlow(false)
    val showRefillDialog: StateFlow<Boolean> = _showRefillDialog.asStateFlow()

    private val _refillTargetMedicine = MutableStateFlow<Medicine?>(null)
    val refillTargetMedicine: StateFlow<Medicine?> = _refillTargetMedicine.asStateFlow()

    private val _showExportDialog = MutableStateFlow(false)
    val showExportDialog: StateFlow<Boolean> = _showExportDialog.asStateFlow()

    private val _showSkipDialog = MutableStateFlow(false)
    val showSkipDialog: StateFlow<Boolean> = _showSkipDialog.asStateFlow()

    private val _skipTargetDose = MutableStateFlow<Pair<String, String>?>(null)
    val skipTargetDose: StateFlow<Pair<String, String>?> = _skipTargetDose.asStateFlow()

    val streak: StateFlow<Int> = combine(medicines, logs) { _, _ ->
        repository.calculateStreak()
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), repository.calculateStreak())

    fun setSelectedDate(date: LocalDate) {
        _selectedDate.value = date
    }

    fun setCurrentTab(tab: String) {
        _currentTab.value = tab
    }

    fun takeDose(medicineId: String, time: String) {
        repository.takeDose(medicineId, time, _selectedDate.value.toString())
    }

    fun undoDose(medicineId: String, time: String) {
        repository.undoDose(medicineId, time, _selectedDate.value.toString())
    }

    fun openSkipDialog(medicineId: String, time: String) {
        _skipTargetDose.value = Pair(medicineId, time)
        _showSkipDialog.value = true
    }

    fun closeSkipDialog() {
        _showSkipDialog.value = false
        _skipTargetDose.value = null
    }

    fun confirmSkipDose(reason: String? = null) {
        val target = _skipTargetDose.value
        if (target != null) {
            repository.skipDose(target.first, target.second, _selectedDate.value.toString(), reason)
        }
        closeSkipDialog()
    }

    fun snoozeDose(medicine: Medicine, time: String) {
        repository.snoozeDose(medicine, time)
    }

    fun dismissReminder() {
        repository.dismissReminder()
    }

    fun triggerTestReminder() {
        repository.triggerTestReminder()
    }

    fun openAddMedicine() {
        _medicineToEdit.value = null
        _showAddEditDialog.value = true
    }

    fun openEditMedicine(medicine: Medicine) {
        _medicineToEdit.value = medicine
        _showAddEditDialog.value = true
    }

    fun closeAddEditDialog() {
        _showAddEditDialog.value = false
        _medicineToEdit.value = null
    }

    fun saveMedicine(medicine: Medicine) {
        repository.saveMedicine(medicine)
        closeAddEditDialog()
    }

    fun deleteMedicine(id: String) {
        repository.deleteMedicine(id)
        closeAddEditDialog()
    }

    fun toggleMedicineActive(id: String) {
        repository.toggleMedicineActive(id)
    }

    fun openRefillDialog(medicine: Medicine) {
        _refillTargetMedicine.value = medicine
        _showRefillDialog.value = true
    }

    fun closeRefillDialog() {
        _showRefillDialog.value = false
        _refillTargetMedicine.value = null
    }

    fun confirmRefill(amount: Int) {
        val target = _refillTargetMedicine.value
        if (target != null && amount > 0) {
            repository.refillStock(target.id, amount)
        }
        closeRefillDialog()
    }

    fun openExportDialog() {
        _showExportDialog.value = true
    }

    fun closeExportDialog() {
        _showExportDialog.value = false
    }

    fun getDoctorReport(): String {
        return repository.generateDoctorReport()
    }

    fun updateSettings(newSettings: UserSettings) {
        repository.updateSettings(newSettings)
    }
}
