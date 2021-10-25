import dayjs from "dayjs";
import React from "react";
import styled, { css } from "styled-components";
import { IMode, useCalendar } from "../hooks/useCalendar";

export type IPanelProps = {
  mode: IMode;
  baseDate: Date;
  locale?: string;

  date?: Date;
  dates?: Date[];
  range?: Date[];

  onDateChange?: (v: Date) => void;
  onDatesChange?: (v: Date[]) => void;
  onRangeChange?: (v: Date[]) => void;

  hideExternal?: boolean;
  weekends?: number[];
  trimWeeks?: boolean;
  disabled?: Array<Date | [Date, Date]>;
  minDate?: Date;
  maxDate?: Date;
};

export const Panel = ({
  mode = "date",
  baseDate = new Date(),
  date = new Date(),
  dates = [],
  range = [],
  onDateChange,
  onDatesChange,
  onRangeChange,
  weekends = [],
  locale,
  hideExternal,
  trimWeeks,
  disabled = [],
  minDate,
  maxDate
}: IPanelProps) => {
  const { active, after, before } = useCalendar({
    baseDate,

    mode,
    date,
    dates,
    range,

    weekends,
    trimWeeks,
    disabled,
    minDate,
    maxDate
  });

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
        {baseDate.toLocaleString(locale, { month: "long" })}{" "}
        {baseDate.toLocaleString(locale, { year: "numeric" })}
      </Header>
      <Wrapper>
        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
          <div key={day}>
            {dayjs(baseDate)
              .day(day)
              .toDate()
              .toLocaleString(locale, { weekday: "short" })}
          </div>
        ))}
        {before.map((day) => (
          <Day
            key={day.value.valueOf()}
            $weekend={day.isWeekend}
            $external={day.isExternal}
            $current={day.isActive}
            $between={day.isBetween}
            $disabled={day.isDisabled}
          >
            {!hideExternal ? day.date : null}
          </Day>
        ))}
        {active.map((day) => (
          <Day
            key={day.value.valueOf()}
            $weekend={day.isWeekend}
            $external={day.isExternal}
            $current={day.isActive}
            $between={day.isBetween}
            $disabled={day.isDisabled}
            onClick={() => {
              !day.isDisabled && handleDateClick(day.value);
            }}
          >
            {day.date}
          </Day>
        ))}
        {after.map((day) => (
          <Day
            key={day.value.valueOf()}
            $weekend={day.isWeekend}
            $external={day.isExternal}
            $current={day.isActive}
            $between={day.isBetween}
            $disabled={day.isDisabled}
          >
            {!hideExternal ? day.date : null}
          </Day>
        ))}
      </Wrapper>
    </Root>
  );
};

const Root = styled.div`
  padding: 4px;
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
  $external: boolean;
  $current: boolean;
  $between: boolean;
  $disabled: boolean;
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
    !p.$external &&
    css`
      background-color: #ff634773;
    `}

  ${(p) =>
    !p.$external
      ? css`
          &:hover {
            border-color: grey;
            cursor: pointer;
          }
        `
      : css`
          border: none;
          color: grey;
        `}

  ${(p) =>
    p.$current &&
    css`
      border-color: tomato;
      border-width: 2px;
      color: #000;
      font-weight: bold;
    `}

    ${(p) =>
    p.$disabled &&
    css`
      background-color: lightgray;
      &:hover {
        border-color: transparent;
        user-select: none;
      }
    `}
`;
