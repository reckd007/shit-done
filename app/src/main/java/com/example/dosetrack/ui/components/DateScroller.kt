package com.example.dosetrack.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dosetrack.data.model.DoseLog
import com.example.dosetrack.data.model.DoseStatus
import com.example.dosetrack.data.model.Medicine
import com.example.dosetrack.ui.theme.EmeraldAccent
import java.time.LocalDate
import java.time.format.TextStyle
import java.util.Locale

@Composable
fun DateScroller(
    selectedDate: LocalDate,
    onSelectDate: (LocalDate) -> Unit,
    medicines: List<Medicine>,
    logs: List<DoseLog>,
    modifier: Modifier = Modifier
) {
    val today = LocalDate.now()
    val dates = (-3..3).map { today.plusDays(it.toLong()) }

    LazyRow(
        modifier = modifier
            .fillMaxWidth()
            .testTag("date_scroller"),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(horizontal = 16.dp)
    ) {
        items(dates) { date ->
            val isSelected = date == selectedDate
            val isToday = date == today

            val dayOfWeek = date.dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.getDefault()).uppercase()
            val dayOfMonth = date.dayOfMonth.toString()

            val dayMeds = medicines.filter { it.isActive && it.startDate <= date.toString() }
            val dayLogs = logs.filter { it.date == date.toString() }
            val allTaken = dayMeds.isNotEmpty() && dayLogs.isNotEmpty() &&
                    dayLogs.count { it.status == DoseStatus.TAKEN } >= dayMeds.sumOf { it.scheduleTimes.size }

            Surface(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .clickable { onSelectDate(date) }
                    .testTag("date_pill_${date}"),
                shape = RoundedCornerShape(16.dp),
                color = when {
                    isSelected -> MaterialTheme.colorScheme.primary
                    isToday -> MaterialTheme.colorScheme.primaryContainer
                    else -> MaterialTheme.colorScheme.surface
                },
                shadowElevation = if (isSelected) 3.dp else 0.dp
            ) {
                Column(
                    modifier = Modifier
                        .width(54.dp)
                        .padding(vertical = 10.dp),
                    horizontalAlignment = Alignment.CenterVertically,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = if (isToday) "TODAY" else dayOfWeek,
                        style = MaterialTheme.typography.labelSmall,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = when {
                            isSelected -> MaterialTheme.colorScheme.onPrimary
                            isToday -> MaterialTheme.colorScheme.onPrimaryContainer
                            else -> MaterialTheme.colorScheme.onSurfaceVariant
                        }
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = dayOfMonth,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = when {
                            isSelected -> MaterialTheme.colorScheme.onPrimary
                            isToday -> MaterialTheme.colorScheme.onPrimaryContainer
                            else -> MaterialTheme.colorScheme.onSurface
                        }
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    // Small indicator dot
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .clip(RoundedCornerShape(2.dp))
                            .background(
                                when {
                                    allTaken -> EmeraldAccent
                                    isSelected -> MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.6f)
                                    dayLogs.any { it.status == DoseStatus.TAKEN } -> MaterialTheme.colorScheme.primary
                                    else -> Color.Transparent
                                }
                            )
                    )
                }
            }
        }
    }
}
