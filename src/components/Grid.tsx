import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import { IMode } from "../hooks/useCalendar";
import { Calendar } from "./Calendar";

(window as any).dayjs = dayjs

export type IRange = {
  start: Date;
  end: Date;
};

export type IGrid = {
  columns?: number;
  rows?: number;
  mode?: IMode;

  date?: Date;
  dates?: Date[];
  range?: Date[];

  onDateChange?: (v: Date) => void;
  onDatesChange?: (v: Date[]) => void;
  onRangeChange?: (v: Date[]) => void;
};

export const Grid = (props: IGrid) => {
  const {
    columns = 1,
    rows = 1,
    date,
    dates = [],
    range = [],
    onDateChange,
    mode = "date",
  } = props;

  const [startDate, setStartDate] = useState<Date>(date || dates[0] || range[0] || dayjs().date(1).toDate());
  console.log("🚀 ~ file: Grid.tsx ~ line 38 ~ Grid ~ startDate", startDate)
  
  const month = startDate.getMonth();
  const year = startDate.getFullYear();

  const months = Array(columns * rows).fill(1).map((_, index) => {
    return {
      year,
      month: month + index,
    }
  })
  console.log("🚀 ~ file: Grid.tsx ~ line 48 ~ months ~ months", months)

  const handlePrev = () => {
    setStartDate((prev) => dayjs(prev).add(-months.length, "M").toDate()) 
  }

  const handleNext = () => {
    setStartDate((prev) => dayjs(prev).add(+months.length, "M").toDate()) 
  }

  return (
    <Root $columns={columns}>
      <PrevButton onClick={handlePrev}>p</PrevButton>
      {months.map(({ month, year }) => (
          <Calendar
            mode={mode}
            key={year + month}
            showMonth={month}
            showYear={year}
            date={date}
            onDateChange={onDateChange}
            dates={props.dates}
            onDatesChange={props.onDatesChange}
            range={props.range}
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
