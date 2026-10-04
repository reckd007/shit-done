package com.example.dosetrack.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dosetrack.data.model.*
import com.example.dosetrack.ui.components.DateScroller
import com.example.dosetrack.ui.components.DoseCard
import com.example.dosetrack.ui.theme.AmberAccent
import com.example.dosetrack.ui.theme.EmeraldAccent
import java.time.LocalDate

@Composable
fun TodayScreen(
    selectedDate: LocalDate,
    onSelectDate: (LocalDate) -> Unit,
    medicines: List<Medicine>,
    logs: List<DoseLog>,
    onTakeDose: (medicineId: String, time: String) -> Unit,
    onUndoDose: (medicineId: String, time: String) -> Unit,
    onSkipDose: (medicineId: String, time: String) -> Unit,
    onSnoozeDose: (medicine: Medicine, time: String) -> Unit,
    onEditMedicine: (medicine: Medicine) -> Unit,
    onOpenAddMedicine: () -> Unit,
    onOpenRefill: (medicine: Medicine) -> Unit,
    modifier: Modifier = Modifier
) {
    val dateStr = selectedDate.toString()
    val activeMeds = remember(medicines, selectedDate) {
        medicines.filter { it.isActive && it.startDate <= dateStr }
    }

    // Build scheduled doses
    val scheduledDoses = remember(activeMeds, logs, dateStr) {
        val list = mutableListOf<ScheduledDoseItem>()
        activeMeds.forEach { med ->
            med.scheduleTimes.forEach { time ->
                val log = logs.find { it.date == dateStr && it.medicineId == med.id && it.scheduledTime == time }
                val status = log?.status ?: DoseStatus.PENDING

                val hour = time.split(":").firstOrNull()?.toIntOrNull() ?: 8
                val window = when {
                    hour in 6..11 -> TimeWindow.MORNING
                    hour in 12..16 -> TimeWindow.AFTERNOON
                    hour in 17..20 -> TimeWindow.EVENING
                    else -> TimeWindow.NIGHT
                }

                list.add(
                    ScheduledDoseItem(
                        id = "${med.id}_${dateStr}_$time",
                        medicine = med,
                        date = dateStr,
                        scheduledTime = time,
                        status = status,
                        loggedAt = log?.loggedAt,
                        timeWindow = window
                    )
                )
            }
        }
        list.sortedBy { it.scheduledTime }
    }

    val totalCount = scheduledDoses.size
    val takenCount = scheduledDoses.count { it.status == DoseStatus.TAKEN }
    val skippedCount = scheduledDoses.count { it.status == DoseStatus.SKIPPED }
    val remainingCount = totalCount - takenCount - skippedCount
    val percentage = if (totalCount > 0) ((takenCount.toFloat() / totalCount.toFloat()) * 100).toInt() else 0

    // Low stock medicines
    val lowStockMeds = remember(medicines) {
        medicines.filter { it.isActive && it.stockTotal <= it.stockLowAlertThreshold }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = onOpenAddMedicine,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.testTag("today_fab_add_medicine")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Medicine")
            }
        },
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .testTag("today_screen_content"),
            contentPadding = PaddingValues(bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Horizontal Date Scroller
            item {
                Spacer(modifier = Modifier.height(4.dp))
                DateScroller(
                    selectedDate = selectedDate,
                    onSelectDate = onSelectDate,
                    medicines = medicines,
                    logs = logs
                )
            }

            // Summary Progress Card
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                        .testTag("daily_progress_card"),
                    shape = RoundedCornerShape(24.dp),
                    color = MaterialTheme.colorScheme.primary,
                    shadowElevation = 4.dp
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "DAILY INTAKE",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f)
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "$takenCount / $totalCount Taken",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = if (totalCount > 0 && remainingCount == 0) {
                                    "All doses complete! Great job!"
                                } else {
                                    "$remainingCount doses remaining today"
                                },
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.9f)
                            )
                        }

                        // Circular percentage badge
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier.size(62.dp)
                        ) {
                            CircularProgressIndicator(
                                progress = { if (totalCount > 0) takenCount.toFloat() / totalCount.toFloat() else 0f },
                                modifier = Modifier.fillMaxSize(),
                                color = MaterialTheme.colorScheme.onPrimary,
                                trackColor = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.25f),
                                strokeWidth = 5.dp
                            )
                            Text(
                                text = "$percentage%",
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                        }
                    }
                }
            }

            // Low Stock Warning Banner
            if (lowStockMeds.isNotEmpty()) {
                item {
                    val firstLow = lowStockMeds.first()
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                            .testTag("low_stock_banner"),
                        shape = RoundedCornerShape(16.dp),
                        color = AmberAccent.copy(alpha = 0.15f),
                        border = ButtonDefaults.outlinedButtonBorder.copy(
                            brush = androidx.compose.ui.graphics.SolidColor(AmberAccent.copy(alpha = 0.4f))
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Warning,
                                    contentDescription = null,
                                    tint = AmberAccent,
                                    modifier = Modifier.size(20.dp)
                                )
                                Column {
                                    Text(
                                        text = "Refill Alert: ${firstLow.name}",
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = "Only ${firstLow.stockTotal} ${firstLow.unit} remaining.",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            FilledTonalButton(
                                onClick = { onOpenRefill(firstLow) },
                                shape = RoundedCornerShape(10.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text("Refill", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // Empty state
            if (scheduledDoses.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Medication,
                                contentDescription = null,
                                modifier = Modifier.size(48.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "No medications scheduled today",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Add prescriptions to start tracking your doses.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(
                                onClick = onOpenAddMedicine,
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Add Medication")
                            }
                        }
                    }
                }
            }

            // Grouped doses by time window
            TimeWindow.values().forEach { window ->
                val windowDoses = scheduledDoses.filter { it.timeWindow == window }
                if (windowDoses.isNotEmpty()) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = when (window) {
                                        TimeWindow.MORNING -> Icons.Default.WbSunny
                                        TimeWindow.AFTERNOON -> Icons.Default.Brightness5
                                        TimeWindow.EVENING -> Icons.Default.Brightness4
                                        TimeWindow.NIGHT -> Icons.Default.NightsStay
                                    },
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = window.title.uppercase(),
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "· ${window.timeRange}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            windowDoses.forEach { dose ->
                                DoseCard(
                                    medicine = dose.medicine,
                                    scheduledTime = dose.scheduledTime,
                                    status = dose.status,
                                    onTake = { onTakeDose(dose.medicine.id, dose.scheduledTime) },
                                    onUndo = { onUndoDose(dose.medicine.id, dose.scheduledTime) },
                                    onSkip = { onSkipDose(dose.medicine.id, dose.scheduledTime) },
                                    onSnooze = { onSnoozeDose(dose.medicine, dose.scheduledTime) },
                                    onEdit = { onEditMedicine(dose.medicine) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
