// Campus operating hours confirmed by the owner on 28–29 October 2026.
// Programme/class times and tour appointment slots are separate schedules.
export const weekdayHours = 'Mon–Fri, 8:30 am – 6:30 pm';
export const saturdayHours = 'Saturday, 9 am – 5 pm';
export const openingHoursSummary = `${weekdayHours}; ${saturdayHours}; Sunday closed`;

export const openingHoursSpecification = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:30',
    closes: '18:30',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday'],
    opens: '09:00',
    closes: '17:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday'],
    opens: '00:00',
    closes: '00:00',
  },
];
