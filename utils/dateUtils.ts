import type { FilterOption } from '../types';

const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const endOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export const getFilterDateRange = (
  filter: FilterOption,
  customStart?: string,
  customEnd?: string
): { startDate: Date; endDate: Date } | null => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (filter) {
    case 'today':
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;

    case 'yesterday':
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      startDate = startOfDay(yesterday);
      endDate = endOfDay(yesterday);
      break;

    case 'this_week':
      const thisWeekStart = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      thisWeekStart.setDate(diff);
      startDate = startOfDay(thisWeekStart);
      endDate = endOfDay(now);
      break;
      
    case 'last_week':
      const lastWeekStart = new Date();
      lastWeekStart.setDate(now.getDate() - now.getDay() - 6);
      startDate = startOfDay(lastWeekStart);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      endDate = endOfDay(lastWeekEnd);
      break;

    case 'this_month':
      startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      endDate = endOfDay(now);
      break;

    case 'last_month':
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      endDate = endOfDay(endOfLastMonth);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = startOfDay(startOfLastMonth);
      break;

    case 'custom':
      if (customStart && customEnd) {
        try {
          const start = new Date(customStart);
          start.setMinutes(start.getMinutes() + start.getTimezoneOffset()); // Adjust for timezone
          const end = new Date(customEnd);
          end.setMinutes(end.getMinutes() + end.getTimezoneOffset()); // Adjust for timezone
          
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            return { startDate: startOfDay(start), endDate: endOfDay(end) };
          }
        } catch (e) {
            return null;
        }
      }
      return null;

    default:
      return null;
  }
  return { startDate, endDate };
};
