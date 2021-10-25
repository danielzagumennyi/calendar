import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo } from "react";
import { IWeekDay } from "../components/Calendar";
import { parseDate } from "../utils/utils";

const daysInMonth = (month?: number) => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    (month || now.getMonth()) + 1,
    0
  ).getDate();
};

export type IMode = "date" | "range" | "multiple";

export type IUseCalendarProps = {
  months: Date[];
  mode: IMode;
  date?: Date;
  dates?: Date[];
  range?: Date[];

  week: IWeekDay[];
  weekends?: number[];
  trimWeeks?: boolean;
  disabled?: Array<Date | Date[]>;
  minDate?: Date;
  maxDate?: Date;
};

export type IDay = {
  value: Date;
  day: number;
  weekday: number;
  date: number;
  month: number;
  year: number;
  isWeekend: boolean;
  isActive: boolean;
  isBetween: boolean;
  isExternal: boolean;
  isDisabled: boolean;
};

type IGetMonthDays = {
  baseDate: Date;
  weekends?: number[];
  startDate?: number;
  endDate?: number;
  external?: boolean;
  week:  IWeekDay[];

  getActive: (d: Dayjs) => boolean;
  getBetween: (d: Dayjs) => boolean;
  getDisabled?: (d: Dayjs) => boolean;
};

const isBetween = (d: Dayjs, range: Date[]): boolean => {
  return d.isAfter(range?.[0], "date") && d.isBefore(range?.[1], "date");
};

const getMonthDays = (props: IGetMonthDays): IDay[] => {
  const {
    baseDate,
    weekends,
    startDate = 1,
    endDate = daysInMonth(baseDate.getMonth()),
    external = false,
    week,
    getActive,
    getBetween,
    getDisabled = () => false,
  } = props;

  const days: IDay[] = [];
  for (let i = startDate; i <= endDate; i++) {
    const value = dayjs(baseDate).date(i);

    const parsed = parseDate(value)

    const day: IDay = {
      ...parsed,
      weekday: week.indexOf(parsed.day as IWeekDay) + 1,
      isWeekend: Boolean(weekends?.includes(value.day())),
      isExternal: external,
      isActive: getActive(value),
      isBetween: getBetween(value),
      isDisabled: getDisabled(value),
    };

    days.push(day);
  }

  return days;
};

export const useCalendar = (props: IUseCalendarProps) => {
  const {
    mode,
    date,
    dates,
    range,
    weekends,
    trimWeeks,
    disabled,
    minDate,
    maxDate,
    months,
    week,
  } = props;

  const disabledRanges: Array<[Date, Date]> = useMemo(() => {
    return (disabled?.filter((r) => Array.isArray(r)) || []) as [Date, Date][];
  }, [disabled]);

  const disabledDates = useMemo(() => {
    return (disabled?.filter((d) => typeof d === "object") || []) as Date[];
  }, [disabled]);

  const getActive = useCallback(
    (d: Dayjs) => {
      if (mode === "date") {
        return Boolean(date && d.isSame(date, "date"));
      }

      if (mode === "multiple") {
        return Boolean(dates?.find((dd) => dayjs(dd).isSame(d, "date")));
      }

      if (mode === "range") {
        return Boolean(range?.find((dd) => dayjs(dd).isSame(d, "date")));
      }

      return false;
    },
    [date, dates, mode, range]
  );

  const getBetween = useCallback(
    (d: Dayjs): boolean => {
      return mode === "range" && range?.length === 2 && isBetween(d, range);
    },
    [mode, range]
  );

  const getDisabled = useCallback(
    (d: Dayjs) => {
      return (
        (minDate && Boolean(d.isBefore(minDate, "date"))) ||
        (maxDate && Boolean(d.isAfter(maxDate, "date"))) ||
        Boolean(disabledDates?.find((dd) => dayjs(dd).isSame(d, "date"))) ||
        Boolean(disabledRanges?.find((r) => isBetween(d, r)))
      );
    },
    [disabledDates, disabledRanges, maxDate, minDate]
  );

  return months.map((baseDate) => {
    const currentDays: IDay[] = getMonthDays({
      baseDate,
      weekends,
      getActive,
      getBetween,
      getDisabled,
      week,
    });

    const beforeStartDate = daysInMonth(
      dayjs(baseDate)
        .set("M", baseDate.getMonth() - 1)
        .month()
    ) - currentDays[0].weekday + 2;

    const daysBefore: IDay[] = getMonthDays({
      baseDate: dayjs(baseDate)
        .set("M", baseDate.getMonth() - 1)
        .toDate(),
      weekends,
      startDate: beforeStartDate,
      external: true,
      getActive,
      getBetween,
      week,
    });

    const endWeekDay = 7 - currentDays[currentDays.length - 1].weekday;
    const additionalWeek = !trimWeeks && endWeekDay === 0 ? 7 : endWeekDay;
    const afterEndDate = additionalWeek +
    (currentDays.length + daysBefore.length + additionalWeek === 5 * 7 &&
    !trimWeeks
      ? 7
      : 0)

    const daysAfter: IDay[] = getMonthDays({
      baseDate: dayjs(baseDate)
        .set("M", baseDate.getMonth() + 1)
        .toDate(),
      weekends,
      endDate: afterEndDate,
      external: true,
      getActive,
      getBetween,
      week,
    });

    return {
      before: daysBefore,
      active: currentDays,
      after: daysAfter,
    };
  });
};
