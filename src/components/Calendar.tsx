import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { IDay, IMode, useCalendar } from "../hooks/useCalendar";
import { Panel } from "./Panel";

(window as any).dayjs = dayjs;

const defaultWeekends = [0, 6];

export type IRange = [] | [Date] | [Date, Date];

export type ICalendarProps = {
  columns?: number;
  rows?: number;
  mode?: IMode;
  locale?: string;

  date?: Date;
  dates?: Date[];
  range?: IRange;

  onDateChange?: (v: Date) => void;
  onDatesChange?: (v: Date[]) => void;
  onRangeChange?: (v: IRange) => void;

  weekends?: number[];
  trimWeeks?: boolean;
  hideExternal?: boolean;
  disabled?: Array<Date | [Date, Date]>;
  minDate?: Date;
  maxDate?: Date;
};

export const Calendar = (props: ICalendarProps) => {
  const {
    columns = 1,
    rows = 1,
    date,
    dates = [],
    range = [],
    mode = "date",
    weekends = defaultWeekends,
    locale = "en-en",
    hideExternal,
    trimWeeks,
    disabled,
    minDate,
    maxDate,
    onDateChange,
    onDatesChange,
    onRangeChange,
  } = props;

  const [startShowDate, setStartShowDate] = useState<Date>(
    date || dates[0] || range[0] || dayjs().date(1).toDate()
  );

  const months = useMemo(() => {
    const month = startShowDate.getMonth();
    const year = startShowDate.getFullYear();

    return Array(columns * rows)
      .fill(true)
      .map((_, index) => new Date(year, month + index, 1));
  }, [columns, rows, startShowDate]);

  const monthsData = useCalendar({
    months,

    mode,
    date,
    dates,
    range,

    weekends,
    trimWeeks,
    disabled,
    minDate,
    maxDate,
  });

  const handlePrev = useCallback(() => {
    setStartShowDate((prev) => dayjs(prev).add(-months.length, "M").toDate());
  }, [months]);

  const handleNext = useCallback(() => {
    setStartShowDate((prev) =>
      dayjs(prev)
        .add(+months.length, "M")
        .toDate()
    );
  }, [months.length]);

  const handleDateChange = useCallback(
    (date: IDay) => onDateChange?.(date.value),
    [onDateChange]
  );

  const handleDatesChange = useCallback(
    (date: IDay) => {
      const includes = Boolean(
        dates.find((d) => dayjs(d).isSame(date.value, "date"))
      );
      onDatesChange?.(
        includes
          ? dates.filter((d) => !dayjs(d).isSame(date.value, "date"))
          : [...dates, date.value]
      );
    },
    [dates, onDatesChange]
  );

  const handleRangeChange = useCallback(
    (date: IDay) => {
      if (range.length === 0 || range.length === 2) {
        onRangeChange?.([date.value]);
      } else {
        const _dates = [...range, date.value];
        _dates.sort((a, b) => a.getTime() - b.getTime());

        onRangeChange?.(_dates.slice(0, 2) as IRange);
      }
    },
    [onRangeChange, range]
  );

  const handleDateClick = useCallback(
    (date: IDay) => {
      if (date.isDisabled) return

      const map = {
        "date": handleDateChange,
        "multiple": handleDatesChange,
        "range": handleRangeChange,
      }

      map[mode]?.(date);
    },
    [handleDateChange, handleDatesChange, handleRangeChange, mode]
  );

  return (
    <Root $columns={columns}>
      <PrevButton onClick={handlePrev}>{"<"}</PrevButton>
      {monthsData.map((props) => (
        <Panel
          onClick={handleDateClick}
          trimWeeks={trimWeeks}
          hideExternal={hideExternal}
          locale={locale}
          weekends={weekends}
          key={props.active[0].value.toLocaleDateString()}
          {...props}
        />
      ))}
      <NextButton onClick={handleNext}>{">"}</NextButton>
    </Root>
  );
};

const Root = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$columns}, 1fr);
  position: relative;
  border: 1px solid lightgrey;
  border-radius: 4px;
`;

const Button = styled.div`
  position: absolute;
  top: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
  width: 36px;
  height: 36px;
  user-select: none;
  cursor: pointer;
`;

const PrevButton = styled(Button)`
  left: 4px;
`;

const NextButton = styled(Button)`
  right: 4px;
`;
