import dayjs from 'dayjs';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export function changeDateToString(date: Date): string {
  return dayjs(date).format(dateFormat);
}
