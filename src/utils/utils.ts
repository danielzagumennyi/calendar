import dayjs from "dayjs";

export const parseDate = (d: dayjs.ConfigType) => {
  const day = dayjs(d);

  return {
    value: day.toDate(),
    year: day.year(),
    month: day.month(),
    date: day.date(),
    day: day.day(),
  };
};

export type IBaseMonthData = {
  baseDate: Date;
  numberOfDays: number;
  daysData: IBaseDayData[];
};

export type IBaseDayData = {
  value: Date;
  day: number;
  date: number;
  month: number;
  year: number;
};

const monthDataCache: Record<string, IBaseMonthData> = {};

const getDateKey = (d: dayjs.ConfigType) => dayjs(d).format("YYYY-MM-DD");

const getNumberOfDays = (date: Date) => dayjs(date).endOf('month').date();

export const getMonthBaseData = (baseDate: Date): IBaseMonthData => {
  const key = getDateKey(baseDate);
  if (key in monthDataCache) {
    return monthDataCache[key];
  } else {
    const numberOfDays = getNumberOfDays(baseDate);
    
    const daysData: IBaseDayData[] = [];
    for (let i = 1; i <= numberOfDays; i++) {
      daysData.push(parseDate(dayjs(baseDate).date(i)));
    }

    monthDataCache[key] = {
      baseDate,
      daysData,
      numberOfDays,
    }

    return monthDataCache[key];
  }
};

export const sortDates = (dates: Date[]): Date[] => dates.sort((a, b) => a.getTime() - b.getTime())