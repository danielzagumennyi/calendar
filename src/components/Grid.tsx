import { useState } from "react";
import styled from "styled-components";
import { Calendar } from "./Calendar";

export type IGrid = {
  date?: Date;
  onDateChange?: (v: Date) => void;
  showMonth?: number;
  columns?: number;
  rows?: number;
};

export const Grid = (props: IGrid) => {
  const {
    columns = 1,
    rows = 1,
    showMonth,
    date = new Date(),
    onDateChange,
  } = props;

  const [startDate, setStartDate] = useState(date);

  const month = showMonth || startDate.getMonth();

  return (
    <Root $columns={columns}>
      {Array(columns * rows)
        .fill(1)
        .map((_, index) => (
          <Calendar
            key={month + index}
            showMonth={month + index}
            date={date}
            onDateChange={onDateChange}
          />
        ))}
    </Root>
  );
};

const Root = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$columns}, 1fr);
`;
