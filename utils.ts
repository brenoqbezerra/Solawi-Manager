export const getWeekNumber = (d: Date = new Date()): number => {
  // ISO 8601 week number
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const getYear = (): number => new Date().getFullYear();

// Helper to get a date object from Week and Year (approximate, Monday of that week)
export const getDateFromWeek = (w: number, y: number): Date => {
  const simple = new Date(y, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
};

// Returns a formatted string "DD.MMM - DD.MMM" for a given week/year
export const getDateRangeOfWeek = (w: number, y: number, locale: string = 'de-DE'): string => {
  const d = new Date(y, 0, 1 + (w - 1) * 7);
  const dayOfWeek = d.getDay();
  const ISOweekStart = d;
  if (dayOfWeek <= 4)
      ISOweekStart.setDate(d.getDate() - d.getDay() + 1);
  else
      ISOweekStart.setDate(d.getDate() + 8 - d.getDay());
  
  const ISOweekEnd = new Date(ISOweekStart);
  ISOweekEnd.setDate(ISOweekStart.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${ISOweekStart.toLocaleDateString(locale, options)} - ${ISOweekEnd.toLocaleDateString(locale, options)}`;
};

export const getStatusColor = (plantWeek: number, harvestWeek: number, harvestYear: number, currentWeek: number, currentYear: number, status: string) => {
  if (status === 'HARVESTED') return 'blue';

  if (currentYear > harvestYear) return 'red';
  if (currentYear < harvestYear) return 'gray';
  
  // Same year logic
  const diff = harvestWeek - currentWeek;
  
  if (diff < 0) return 'red'; // Overdue
  if (diff === 0) return 'green'; // This week
  if (diff <= 2) return 'yellow'; // Coming soon
  return 'gray'; // Planned for future
};

export const generateId = () => Math.random().toString(36).substr(2, 9);