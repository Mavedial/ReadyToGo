import React from 'react';

interface CalendarProps {
    startDate: Date;
    endDate: Date;
    selectedDates: Date[];
    onDatesChange: (dates: Date[]) => void;
}

const toDateString = (d: Date) => d.toISOString().split('T')[0];

const Calendar: React.FC<CalendarProps> = ({
                                               startDate,
                                               endDate,
                                               selectedDates,
                                               onDatesChange,
                                           }) => {
    // Generate all days in the range
    const getDaysInRange = (): Date[] => {
        const days: Date[] = [];
        const current = new Date(startDate);
        current.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        while (current <= end) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    const days = getDaysInRange();

    // Group by month
    const daysByMonth = days.reduce<Record<string, Date[]>>((acc, day) => {
        const key = `${day.getFullYear()}-${day.getMonth()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(day);
        return acc;
    }, {});

    const isSelected = (date: Date) =>
        selectedDates.some((d) => toDateString(d) === toDateString(date));

    const toggleDate = (date: Date) => {
        const str = toDateString(date);
        if (isSelected(date)) {
            onDatesChange(selectedDates.filter((d) => toDateString(d) !== str));
        } else {
            onDatesChange([...selectedDates, date]);
        }
    };

    const todayStr = toDateString(new Date());

    return (
        <div className="calendar">
            <p className="calendar-info">
                {selectedDates.length} date(s) sélectionnée(s) — cliquez pour
                sélectionner/désélectionner
            </p>

            {Object.entries(daysByMonth).map(([key, monthDays]) => {
                const monthName = monthDays[0].toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric',
                });
                return (
                    <div key={key} className="calendar-month">
                        <h3>{monthName}</h3>
                        <div className="calendar-grid">
                            {monthDays.map((day) => {
                                const selected = isSelected(day);
                                const isToday = toDateString(day) === todayStr;
                                return (
                                    <button
                                        key={day.toISOString()}
                                        type="button"
                                        className={`btn${selected ? ' selected' : ''}${isToday ? ' today' : ''}`}
                                        onClick={() => toggleDate(day)}
                                        title={day.toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                        })}
                                    >
                                        <span className="day-name">
                                            {day.toLocaleDateString('fr-FR', {
                                                weekday: 'short',
                                            })}
                                        </span>
                                        <span className="day-number">{day.getDate()}</span>
                                        {selected && <span className="check">✓</span>}
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