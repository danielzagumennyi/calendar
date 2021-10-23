import dayjs from "dayjs";
import React from "react";
import styled, { css } from "styled-components";
import { useCalendar } from "../hooks/useCalendar";

export type ICalendar = {
  date: Date;
  onDateChange?: (v: Date) => void;
  showMonth: number;
};

export const Calendar = ({ showMonth, date, onDateChange }: ICalendar) => {
  const { active, after, before } = useCalendar({
    date,
    showMonth,
  });

  return (
    <Root>
      <Header>
        {dayjs()
          .month(showMonth)
          .toDate()
          .toLocaleString("ru-ru", { month: "long" })}{" "}
        {dayjs()
          .month(showMonth)
          .toDate()
          .toLocaleString("ru-ru", { year: "numeric" })}
      </Header>
      <Wrapper>
        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
          <div key={day}>
            {dayjs()
              .day(day)
              .toDate()
              .toLocaleString("ru-ru", { weekday: "short" })}
          </div>
        ))}
        {before.map((day) => (
          <Day
            key={day.value.valueOf()}
            $weekend={day.isWeekend}
            $currentMonth={day.currentMonth}
            $current={day.isCurrent}
          >
            {day.date}
          </Day>
        ))}
        {active.map((day) => (
          <Day
            key={day.value.valueOf()}
            $weekend={day.isWeekend}
            $currentMonth={day.currentMonth}
            $current={day.isCurrent}
            onClick={() => {
              console.log("click")
              onDateChange?.(day.value)
            }}
          >
            {day.date}
          </Day>
        ))}
        {after.map((day) => (
          <Day
            key={day.value.valueOf()}
            $weekend={day.isWeekend}
            $currentMonth={day.currentMonth}
            $current={day.isCurrent}
          >
            {day.date}
          </Day>
        ))}
      </Wrapper>
    </Root>
  );
};

const Root = styled.div`
  padding: 4px;
  border: 1px solid lightgrey;
`;

const Header = styled.div`
  text-align: center;
  font-weight: bold;
  padding: 8px 0 4px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 48px);
  grid-auto-rows: 48px;
  align-items: center;
  justify-items: center;
  place-content: center;
`;

const Day = styled.div<{
  $weekend: boolean;
  $currentMonth: boolean;
  $current: boolean;
}>`
  font-size: 14px;
  border: 1px solid #dbdbdb;
  color: #333;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(p) =>
    p.$weekend &&
    css`
      color: grey;
    `}

  ${(p) =>
    !p.$currentMonth
      ? css`
          border: none;
          color: grey;
        `
      : css`
          &:hover {
            border-color: grey;
            cursor: pointer;
          }
        `}

  ${(p) =>
    p.$current &&
    css`
      border-color: tomato;
      border-width: 2px;
      color: #000;
      font-weight: bold;
    `}
`;
