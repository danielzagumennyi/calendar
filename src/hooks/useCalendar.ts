import dayjs from "dayjs";

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
  range?: {
    start: Date;
    end: Date;
  };
  dates?: Date[];
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
  isCurrent: boolean;
};

type IGetMonthDays = {
  date?: Date;
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
    date
  } = props;

  const baseDate = dayjs().year(year).month(month);

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
      isCurrent: date ? value.isSame(date, "date") : false,
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
    date = dayjs().toDate(),
    showYear = dayjs().year(),
  } = props;

  const daysInCurrentMonth = daysInMonth();

  const monthStartDay = dayjs().year(showYear).month(showMonth).date(0).day();

  const currentDays: IDay[] = getMonthDays({
    date,
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
