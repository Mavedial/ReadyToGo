import React, { useState } from 'react';

interface CalendarProps {
    startDate: Date;
    endDate: Date;
    selectedDates: Date[];
    onDatesChange: (dates: Date[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({
                                               startDate,
                                               endDate,
                                               selectedDates,
                                               onDatesChange
                                           }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(startDate));

    // Générer tous les jours entre startDate et endDate
    const getDaysInRange = () => {
        const days: Date[] = [];
        let current = new Date(startDate);

        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const daysInRange = getDaysInRange();

    // Grouper par mois
    const daysByMonth = daysInRange.reduce((acc, day) => {
        const monthKey = `${day.getFullYear()}-${day.getMonth()}`;
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(day);
        return acc;
    }, {} as Record<string, Date[]>);

    const toggleDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const isSelected = selectedDates.some(
            d => d.toISOString().split('T')[0] === dateStr
        );

        if (isSelected) {
            onDatesChange(
                selectedDates.filter(d => d.toISOString().split('T')[0] !== dateStr)
            );
        } else {
            onDatesChange([...selectedDates, date]);
        }
    };

    const isDateSelected = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return selectedDates.some(d => d.toISOString().split('T')[0] === dateStr);
    };

    return (
        <div className="calendar">
            <div className="calendar-info">
                <p>
                    ✓ Sélectionnez les dates où vous êtes disponible
                    ({selectedDates.length} date(s) sélectionnée(s))
                </p>
            </div>

            {Object.entries(daysByMonth).map(([monthKey, days]) => {
                const firstDay = days[0];
                const monthName = firstDay.toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                });

                return (
                    <div key={monthKey} className="calendar-month">
                        <h3>{monthName}</h3>
                        <div className="calendar-grid">
                            {days.map((day) => {
                                const dayName = day.toLocaleDateString('fr-FR', {
                                    weekday: 'short'
                                });
                                const dayNum = day.getDate();
                                const isSelected = isDateSelected(day);
                                const isToday = day.toDateString() === new Date().toDateString();

                                return (
                                    <button
                                        key={day.toISOString()}
                                        type="button"
                                        className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                        onClick={() => toggleDate(day)}
                                    >
                                        <span className="day-name">{dayName}</span>
                                        <span className="day-number">{dayNum}</span>
                                        {isSelected && <span className="check">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Calendar;