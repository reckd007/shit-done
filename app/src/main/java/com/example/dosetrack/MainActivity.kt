package com.example.dosetrack

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.dosetrack.data.model.Medicine
import com.example.dosetrack.ui.components.*
import com.example.dosetrack.ui.screens.*
import com.example.dosetrack.ui.theme.AmberAccent
import com.example.dosetrack.ui.theme.DoseTrackTheme
import com.example.dosetrack.ui.viewmodel.MedicineViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val viewModel: MedicineViewModel = viewModel()
            val settings by viewModel.settings.collectAsState()

            DoseTrackTheme(themeMode = settings.themeMode) {
                MainAppScreen(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen(viewModel: MedicineViewModel) {
    val currentTab by viewModel.currentTab.collectAsState()
    val selectedDate by viewModel.selectedDate.collectAsState()
    val medicines by viewModel.medicines.collectAsState()
    val logs by viewModel.logs.collectAsState()
    val settings by viewModel.settings.collectAsState()
    val streak by viewModel.streak.collectAsState()
    val activeReminder by viewModel.activeReminder.collectAsState()

    val showAddEditDialog by viewModel.showAddEditDialog.collectAsState()
    val medicineToEdit by viewModel.medicineToEdit.collectAsState()
    val showRefillDialog by viewModel.showRefillDialog.collectAsState()
    val refillTargetMed by viewModel.refillTargetMedicine.collectAsState()
    val showExportDialog by viewModel.showExportDialog.collectAsState()
    val showSkipDialog by viewModel.showSkipDialog.collectAsState()

    var skipReasonText by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "MedTrack",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black
                            )
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = AmberAccent.copy(alpha = 0.15f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.LocalFireDepartment,
                                        contentDescription = null,
                                        tint = AmberAccent,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Text(
                                        text = "$streak",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Black,
                                        color = AmberAccent
                                    )
                                }
                            }
                        }
                        Text(
                            text = "Medicine & Pill Reminder",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(
                        onClick = { viewModel.openAddMedicine() },
                        modifier = Modifier.testTag("top_bar_add_medicine")
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add Medicine")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                modifier = Modifier.testTag("bottom_nav_bar"),
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 6.dp
            ) {
                NavigationBarItem(
                    selected = currentTab == "today",
                    onClick = { viewModel.setCurrentTab("today") },
                    icon = {
                        Icon(
                            if (currentTab == "today") Icons.Filled.Today else Icons.Outlined.Today,
                            contentDescription = "Today"
                        )
                    },
                    label = { Text("Today", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                    modifier = Modifier.testTag("nav_item_today")
                )

                NavigationBarItem(
                    selected = currentTab == "cabinet",
                    onClick = { viewModel.setCurrentTab("cabinet") },
                    icon = {
                        Icon(
                            if (currentTab == "cabinet") Icons.Filled.Medication else Icons.Outlined.Medication,
                            contentDescription = "Cabinet"
                        )
                    },
                    label = { Text("Cabinet", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                    modifier = Modifier.testTag("nav_item_cabinet")
                )

                NavigationBarItem(
                    selected = currentTab == "history",
                    onClick = { viewModel.setCurrentTab("history") },
                    icon = {
                        Icon(
                            if (currentTab == "history") Icons.Filled.BarChart else Icons.Outlined.BarChart,
                            contentDescription = "History"
                        )
                    },
                    label = { Text("History", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                    modifier = Modifier.testTag("nav_item_history")
                )

                NavigationBarItem(
                    selected = currentTab == "settings",
                    onClick = { viewModel.setCurrentTab("settings") },
                    icon = {
                        Icon(
                            if (currentTab == "settings") Icons.Filled.Settings else Icons.Outlined.Settings,
                            contentDescription = "Settings"
                        )
                    },
                    label = { Text("Settings", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                    modifier = Modifier.testTag("nav_item_settings")
                )
            }
        },
        contentWindowInsets = WindowInsets.safeDrawing
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // In-app interactive reminder prompt
            ReminderBanner(
                reminder = activeReminder,
                onTake = { id, time -> viewModel.takeDose(id, time) },
                onSnooze = { id, time ->
                    val med = medicines.find { it.id == id }
                    if (med != null) viewModel.snoozeDose(med, time)
                },
                onDismiss = { viewModel.dismissReminder() }
            )

            // Current Tab View
            when (currentTab) {
                "today" -> {
                    TodayScreen(
                        selectedDate = selectedDate,
                        onSelectDate = { viewModel.setSelectedDate(it) },
                        medicines = medicines,
                        logs = logs,
                        onTakeDose = { id, time -> viewModel.takeDose(id, time) },
                        onUndoDose = { id, time -> viewModel.undoDose(id, time) },
                        onSkipDose = { id, time -> viewModel.openSkipDialog(id, time) },
                        onSnoozeDose = { med, time -> viewModel.snoozeDose(med, time) },
                        onEditMedicine = { viewModel.openEditMedicine(it) },
                        onOpenAddMedicine = { viewModel.openAddMedicine() },
                        onOpenRefill = { viewModel.openRefillDialog(it) },
                        modifier = Modifier.weight(1f)
                    )
                }

                "cabinet" -> {
                    CabinetScreen(
                        medicines = medicines,
                        onOpenAddMedicine = { viewModel.openAddMedicine() },
                        onEditMedicine = { viewModel.openEditMedicine(it) },
                        onToggleActive = { viewModel.toggleMedicineActive(it) },
                        onRefillMedicine = { viewModel.openRefillDialog(it) },
                        modifier = Modifier.weight(1f)
                    )
                }

                "history" -> {
                    HistoryScreen(
                        streak = streak,
                        medicines = medicines,
                        logs = logs,
                        onOpenExportReport = { viewModel.openExportDialog() },
                        onSelectDate = {
                            viewModel.setSelectedDate(it)
                            viewModel.setCurrentTab("today")
                        },
                        modifier = Modifier.weight(1f)
                    )
                }

                "settings" -> {
                    SettingsScreen(
                        settings = settings,
                        medicines = medicines,
                        onUpdateSettings = { viewModel.updateSettings(it) },
                        onTriggerTestReminder = { viewModel.triggerTestReminder() },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }

    // Add / Edit Medication Dialog
    if (showAddEditDialog) {
        AddEditMedicineDialog(
            medicineToEdit = medicineToEdit,
            onDismiss = { viewModel.closeAddEditDialog() },
            onSave = { viewModel.saveMedicine(it) },
            onDelete = { viewModel.deleteMedicine(it) }
        )
    }

    // Refill Stock Dialog
    if (showRefillDialog) {
        RefillDialog(
            medicine = refillTargetMed,
            onDismiss = { viewModel.closeRefillDialog() },
            onConfirm = { amount -> viewModel.confirmRefill(amount) }
        )
    }

    // Export Report Dialog
    if (showExportDialog) {
        ExportReportDialog(
            reportText = viewModel.getDoctorReport(),
            onDismiss = { viewModel.closeExportDialog() }
        )
    }

    // Skip Dose Reason Dialog
    if (showSkipDialog) {
        AlertDialog(
            onDismissRequest = { viewModel.closeSkipDialog() },
            title = { Text("Skip Dose") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Would you like to record a reason for skipping this dose?",
                        style = MaterialTheme.typography.bodyMedium
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf("Felt sick", "Away", "Doctor advised").forEach { reason ->
                            SuggestionChip(
                                onClick = { skipReasonText = reason },
                                label = { Text(reason, fontSize = 11.sp) }
                            )
                        }
                    }

                    OutlinedTextField(
                        value = skipReasonText,
                        onValueChange = { skipReasonText = it },
                        placeholder = { Text("Reason (Optional)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(onClick = {
                    val r = skipReasonText.trim().ifBlank { null }
                    viewModel.confirmSkipDose(r)
                    skipReasonText = ""
                }) {
                    Text("Confirm Skip")
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    viewModel.closeSkipDialog()
                    skipReasonText = ""
                }) {
                    Text("Cancel")
                }
            }
        )
    }
}
