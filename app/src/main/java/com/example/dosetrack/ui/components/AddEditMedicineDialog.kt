package com.example.dosetrack.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.dosetrack.data.model.*
import java.util.UUID

data class CommonMedPreset(
    val name: String,
    val dosage: String,
    val form: MedicineForm,
    val color: AccentColor,
    val instructions: FoodInstruction
)

val COMMON_PRESETS = listOf(
    CommonMedPreset("Metformin", "500 mg", MedicineForm.TABLET, AccentColor.SKY, FoodInstruction.WITH_FOOD),
    CommonMedPreset("Lisinopril", "10 mg", MedicineForm.TABLET, AccentColor.EMERALD, FoodInstruction.ANYTIME),
    CommonMedPreset("Vitamin D3", "2000 IU", MedicineForm.CAPSULE, AccentColor.AMBER, FoodInstruction.WITH_FOOD),
    CommonMedPreset("Atorvastatin", "20 mg", MedicineForm.TABLET, AccentColor.INDIGO, FoodInstruction.ANYTIME),
    CommonMedPreset("Amoxicillin", "500 mg", MedicineForm.CAPSULE, AccentColor.ROSE, FoodInstruction.WITH_FOOD),
    CommonMedPreset("Melatonin", "3 mg", MedicineForm.TABLET, AccentColor.INDIGO, FoodInstruction.BEFORE_FOOD)
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditMedicineDialog(
    medicineToEdit: Medicine?,
    onDismiss: () -> Unit,
    onSave: (Medicine) -> Unit,
    onDelete: ((String) -> Unit)? = null
) {
    var name by remember { mutableStateOf(medicineToEdit?.name ?: "") }
    var dosage by remember { mutableStateOf(medicineToEdit?.dosage ?: "") }
    var selectedForm by remember { mutableStateOf(medicineToEdit?.form ?: MedicineForm.TABLET) }
    var selectedColor by remember { mutableStateOf(medicineToEdit?.color ?: AccentColor.SKY) }
    var selectedInstructions by remember { mutableStateOf(medicineToEdit?.instructions ?: FoodInstruction.WITH_FOOD) }
    var scheduleTimes by remember { mutableStateOf(medicineToEdit?.scheduleTimes ?: listOf("08:30")) }
    var stockTotal by remember { mutableStateOf((medicineToEdit?.stockTotal ?: 30).toString()) }
    var stockThreshold by remember { mutableStateOf((medicineToEdit?.stockLowAlertThreshold ?: 7).toString()) }
    var unit by remember { mutableStateOf(medicineToEdit?.unit ?: "pills") }
    var doctorName by remember { mutableStateOf(medicineToEdit?.doctorName ?: "") }
    var rxNumber by remember { mutableStateOf(medicineToEdit?.rxNumber ?: "") }
    var notes by remember { mutableStateOf(medicineToEdit?.notes ?: "") }

    var newTimeInput by remember { mutableStateOf("12:00") }
    var showTimeDialog by remember { mutableStateOf(false) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.90f)
                .testTag("add_edit_medicine_dialog"),
            shape = RoundedCornerShape(28.dp),
            color = MaterialTheme.colorScheme.surface
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (medicineToEdit != null) "Edit Medication" else "Add Medication",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Quick Preset Chips (when adding new)
                    if (medicineToEdit == null) {
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                text = "Quick Suggestions",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                items(COMMON_PRESETS) { preset ->
                                    SuggestionChip(
                                        onClick = {
                                            name = preset.name
                                            dosage = preset.dosage
                                            selectedForm = preset.form
                                            selectedColor = preset.color
                                            selectedInstructions = preset.instructions
                                        },
                                        label = { Text("${preset.name} (${preset.dosage})") }
                                    )
                                }
                            }
                        }
                    }

                    // Medicine Name
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Medication Name *") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("medicine_name_input"),
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp)
                    )

                    // Dosage & Unit
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = dosage,
                            onValueChange = { dosage = it },
                            label = { Text("Dosage * (e.g. 500 mg)") },
                            modifier = Modifier
                                .weight(1f)
                                .testTag("medicine_dosage_input"),
                            singleLine = true,
                            shape = RoundedCornerShape(14.dp)
                        )
                        OutlinedTextField(
                            value = unit,
                            onValueChange = { unit = it },
                            label = { Text("Unit") },
                            modifier = Modifier.width(100.dp),
                            singleLine = true,
                            shape = RoundedCornerShape(14.dp)
                        )
                    }

                    // Medicine Form Selector
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "Form Factor",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(MedicineForm.values()) { form ->
                                FilterChip(
                                    selected = selectedForm == form,
                                    onClick = { selectedForm = form },
                                    label = { Text("${form.iconEmoji} ${form.label}") }
                                )
                            }
                        }
                    }

                    // Schedule Times
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = "Daily Schedule Times",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            scheduleTimes.forEach { time ->
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = MaterialTheme.colorScheme.primaryContainer
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Text(
                                            text = time,
                                            style = MaterialTheme.typography.labelMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onPrimaryContainer
                                        )
                                        if (scheduleTimes.size > 1) {
                                            Icon(
                                                imageVector = Icons.Default.Close,
                                                contentDescription = "Remove time",
                                                modifier = Modifier
                                                    .size(16.dp)
                                                    .clickable {
                                                        scheduleTimes = scheduleTimes.filter { it != time }
                                                    },
                                                tint = MaterialTheme.colorScheme.onPrimaryContainer
                                            )
                                        }
                                    }
                                }
                            }

                            // Add time button
                            IconButton(
                                onClick = { showTimeDialog = true },
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = "Add Time", modifier = Modifier.size(18.dp))
                            }
                        }
                    }

                    // Food Instructions
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "Meal Instructions",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(FoodInstruction.values()) { inst ->
                                FilterChip(
                                    selected = selectedInstructions == inst,
                                    onClick = { selectedInstructions = inst },
                                    label = { Text(inst.label) }
                                )
                            }
                        }
                    }

                    // Stock Inventory
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = stockTotal,
                            onValueChange = { stockTotal = it },
                            label = { Text("Stock Total") },
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            shape = RoundedCornerShape(14.dp)
                        )
                        OutlinedTextField(
                            value = stockThreshold,
                            onValueChange = { stockThreshold = it },
                            label = { Text("Low Stock Alert at") },
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            shape = RoundedCornerShape(14.dp)
                        )
                    }

                    // Prescriber & Notes
                    OutlinedTextField(
                        value = doctorName,
                        onValueChange = { doctorName = it },
                        label = { Text("Doctor / Prescriber Name (Optional)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp)
                    )

                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Notes & Instructions (Optional)") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        shape = RoundedCornerShape(14.dp)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Footer Actions
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (medicineToEdit != null && onDelete != null) {
                        TextButton(
                            onClick = { onDelete(medicineToEdit.id) },
                            colors = ButtonDefaults.textButtonColors(
                                contentColor = MaterialTheme.colorScheme.error
                            )
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Delete")
                        }
                    } else {
                        Spacer(modifier = Modifier.width(1.dp))
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(
                            onClick = onDismiss,
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Cancel")
                        }

                        Button(
                            onClick = {
                                if (name.isNotBlank() && dosage.isNotBlank()) {
                                    val med = Medicine(
                                        id = medicineToEdit?.id ?: "med-${UUID.randomUUID()}",
                                        name = name.trim(),
                                        dosage = dosage.trim(),
                                        form = selectedForm,
                                        color = selectedColor,
                                        scheduleTimes = scheduleTimes,
                                        instructions = selectedInstructions,
                                        stockTotal = stockTotal.toIntOrNull() ?: 30,
                                        stockLowAlertThreshold = stockThreshold.toIntOrNull() ?: 7,
                                        unit = unit.trim().ifBlank { "pills" },
                                        doctorName = doctorName.trim(),
                                        rxNumber = rxNumber.trim(),
                                        notes = notes.trim(),
                                        isActive = medicineToEdit?.isActive ?: true,
                                        startDate = medicineToEdit?.startDate ?: java.time.LocalDate.now().toString()
                                    )
                                    onSave(med)
                                }
                            },
                            enabled = name.isNotBlank() && dosage.isNotBlank(),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.testTag("save_medicine_button")
                        ) {
                            Text("Save")
                        }
                    }
                }
            }
        }
    }

    // Add time dialog
    if (showTimeDialog) {
        AlertDialog(
            onDismissRequest = { showTimeDialog = false },
            title = { Text("Add Scheduled Time") },
            text = {
                OutlinedTextField(
                    value = newTimeInput,
                    onValueChange = { newTimeInput = it },
                    label = { Text("Time (24h format, e.g. 14:00)") },
                    singleLine = true
                )
            },
            confirmButton = {
                Button(onClick = {
                    if (newTimeInput.isNotBlank() && !scheduleTimes.contains(newTimeInput)) {
                        scheduleTimes = (scheduleTimes + newTimeInput).sorted()
                    }
                    showTimeDialog = false
                }) {
                    Text("Add")
                }
            },
            dismissButton = {
                TextButton(onClick = { showTimeDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}
