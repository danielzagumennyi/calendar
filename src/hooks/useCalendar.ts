import dayjs, { Dayjs } from "dayjs";

const daysInMonth = (month?: number) => {
  var now = new Date();
  return new Date(
    now.getFullYear(),
    (month || now.getMonth()) + 1,
    0
  ).getDate();
};

export type IMode = "date" | "range" | "multiple";

const daysMap = [1, 2, 3, 4, 5, 6, 0];

const getWeekOrder = (day: number) => {
  return daysMap.indexOf(day) + 1;
};

export type IUseCalendarProps = {
  mode?: IMode;
  date?: Date;
  dates?: Date[];
  range?: Date[];
  showMonth?: number;
  showYear?: number;
};

export type IDay = {
  value: Date;
  day: number;
  weekday: number;
  date: number;
  month: number;
  year: number;
  isWeekend: boolean;
  currentMonth: boolean;
  currentYear: boolean;
  isActive: boolean;
  isBetween: boolean;
};

type IGetMonthDays = {
  mode?: IMode;
  date?: Date;
  dates?: Date[];
  range?: Date[];
  year: number;
  month: number;
  weekends: number[];
  startDate?: number;
  endDate?: number;
  showMonth: number;
  showYear: number;
};

const getMonthDays = (props: IGetMonthDays): IDay[] => {
  const {
    year,
    month,
    weekends,
    startDate = 1,
    endDate = daysInMonth(month),
    showMonth,
    showYear,
    mode = "date",
    date,
    dates = [],
    range = [],
  } = props;

  const baseDate = dayjs().year(year).month(month);

  const getActive = (d: Dayjs): boolean => {
    if (mode === "date") {
      return d.isSame(date, "date");
    }

    if (mode === "multiple") {
      return Boolean(dates.find((dd) => dayjs(dd).isSame(d, "date")));
    }

    if (mode === "range") {
      return Boolean(range.find((dd) => dayjs(dd).isSame(d, "date")));
    }

    return false;
  };

  const getBetween = (d: Dayjs): boolean => {
    if (mode === "range") {
      return (
        range.length === 2 &&
        d.isAfter(range[0], "date") &&
        d.isBefore(range[1], "date")
      );
    }

    return false;
  };

  const days: IDay[] = [];
  for (let i = startDate; i <= endDate; i++) {
    const value = dayjs(baseDate).date(i);

    const day: IDay = {
      value: value.toDate(),
      date: i,
      day: value.day(),
      weekday: getWeekOrder(value.day()),
      year: year,
      month: month,
      isWeekend: weekends.includes(value.day()),
      isActive: getActive(value),
      isBetween: getBetween(value),
      currentMonth: showMonth === month,
      currentYear: showYear === year,
    };

    days.push(day);
  }

  return days;
};

export const useCalendar = (props: IUseCalendarProps) => {
  const {
    mode = "date",
    showMonth = dayjs().month(),
    showYear = dayjs().year(),
    date = dayjs().toDate(),
    dates,
    range,
  } = props;

  const daysInCurrentMonth = daysInMonth();

  const monthStartDay = dayjs().year(showYear).month(showMonth).date(0).day();

  const currentDays: IDay[] = getMonthDays({
    date,
    dates,
    range,
    mode,
    month: showMonth,
    year: showYear,
    weekends: [0, 6],
    showMonth,
    showYear,
  });

  const startDate = daysInMonth(showMonth - 1) - monthStartDay + 1;

  const daysBefore: IDay[] = getMonthDays({
    month: showMonth - 1,
    year: showYear,
    weekends: [0, 6],
    startDate,
    showMonth,
    showYear,
  });

  const endDate = 7 - currentDays[currentDays.length - 1].weekday;

  const lastRowEnd = endDate === 0 ? 7 : endDate;

  const daysAfter: IDay[] = getMonthDays({
    month: showMonth + 1,
    year: showYear,
    weekends: [0, 6],
    endDate:
      lastRowEnd +
      (currentDays.length + daysBefore.length + lastRowEnd === 5 * 7 ? 7 : 0),
    showMonth,
    showYear,
  });

  return {
    before: daysBefore,
    active: currentDays,
    after: daysAfter,
  };
};
