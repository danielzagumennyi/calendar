import dayjs from "dayjs";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import { IMode, useCalendar } from "../hooks/useCalendar";

export type ICalendar = {
  mode: IMode;
  showMonth: number;
  showYear: number;

  date?: Date;
  dates?: Date[];
  range?: Date[];

  onDateChange?: (v: Date) => void;
  onDatesChange?: (v: Date[]) => void;
  onRangeChange?: (v: Date[]) => void;
};

export const Calendar = ({
  mode,
  showMonth,
  showYear,
  date,
  dates = [],
  range = [],
  onDateChange,
  onDatesChange,
  onRangeChange,
}: ICalendar) => {
  const { active, after, before } = useCalendar({
    mode,
    date,
    dates,
    range,
    showMonth,
    showYear,
  });

  //ToDo сделать начало месяца от даты, а не в тупую номер года и месяца

  const handleDateClick = (date: Date) => {
    if (mode === "date") {
      onDateChange?.(date);
    }

    if (mode === "multiple") {
      const includes = Boolean(
        dates.find((d) => dayjs(d).isSame(date, "date"))
      );
      onDatesChange?.(
        includes
          ? dates.filter((d) => !dayjs(d).isSame(date, "date"))
          : [...dates, date]
      );
    }

    if (mode === "range") {
      if (range.length === 0 || range.length === 2) {
        onRangeChange?.([date]);
      } else {
        const _dates = [...range, date];
        _dates.sort((a, b) => a.getTime() - b.getTime());

        onRangeChange?.(_dates.slice(0, 2));
      }
    }
  };

  return (
    <Root>
      <Header>
        {dayjs()
          .month(showMonth)
          .year(showYear)
          .toDate()
          .toLocaleString("ru-ru", { month: "long" })}{" "}
        {dayjs()
          .month(showMonth)
          .year(showYear)
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
            $current={day.isActive}
            $between={day.isBetween}
          >
            {day.date}
          </Day>
        ))}
        {active.map((day) => (
          <Day
            key={day.value.valueOf()}
            $weekend={day.isWeekend}
            $currentMonth={day.currentMonth}
            $current={day.isActive}
            $between={day.isBetween}
            onClick={() => {
              handleDateClick(day.value);
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
            $current={day.isActive}
            $between={day.isBetween}
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
  $between: boolean;
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
    p.$between &&
    css`
      background-color: #ff634773;
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
