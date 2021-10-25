import dayjs from "dayjs";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { IMode } from "../hooks/useCalendar";
import { Panel } from "./Panel";

(window as any).dayjs = dayjs;

export type IRange = {
  start: Date;
  end: Date;
};

const defaultWeekends = [0, 6];

export type ICalendarProps = {
  columns?: number;
  rows?: number;
  mode?: IMode;
  locale?: string;

  date?: Date;
  dates?: Date[];
  range?: Date[];

  onDateChange?: (v: Date) => void;
  onDatesChange?: (v: Date[]) => void;
  onRangeChange?: (v: Date[]) => void;

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
  } = props;

  const [startDate, setStartDate] = useState<Date>(
    date || dates[0] || range[0] || dayjs().date(1).toDate()
  );

  const months = useMemo(() => {
    const month = startDate.getMonth();
    const year = startDate.getFullYear();

    return Array(columns * rows)
      .fill(true)
      .map((_, index) => new Date(year, month + index, 1));
  }, [columns, rows, startDate]);

  const handlePrev = () => {
    setStartDate((prev) => dayjs(prev).add(-months.length, "M").toDate());
  };

  const handleNext = () => {
    setStartDate((prev) =>
      dayjs(prev)
        .add(+months.length, "M")
        .toDate()
    );
  };

  return (
    <Root $columns={columns}>
      <PrevButton onClick={handlePrev}>p</PrevButton>
      {months.map((baseDate) => (
        <Panel
          disabled={disabled}
          trimWeeks={trimWeeks}
          hideExternal={hideExternal}
          locale={locale}
          weekends={weekends}
          mode={mode}
          key={baseDate.toLocaleDateString()}
          baseDate={baseDate}
          date={date}
          onDateChange={props.onDateChange}
          dates={dates}
          onDatesChange={props.onDatesChange}
          range={range}
          onRangeChange={props.onRangeChange}
        />
      ))}
      <NextButton onClick={handleNext}>N</NextButton>
    </Root>
  );
};

const Root = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$columns}, 1fr);
  position: relative;
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
`;

const PrevButton = styled(Button)`
  left: 4px;
`;

const NextButton = styled(Button)`
  right: 4px;
`;
