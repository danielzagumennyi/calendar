import dayjs from "dayjs";
import React from "react";
import styled, { css } from "styled-components";
import { IDay } from "../hooks/useCalendar";
import { IWeekDay } from "./Calendar";

export type IPanelProps = {
  locale?: string;
  
  onClick?: (d: IDay) => void;
  onHover?: (d: IDay) => void;

  hideExternal?: boolean;
  weekends?: number[];
  trimWeeks?: boolean;
  active: IDay[]
  before: IDay[]
  after: IDay[]
  week: IWeekDay[]
};

export const Panel = ({
  onClick,
  onHover,
  locale,
  active,
  before,
  after,
  hideExternal,
  week,
}: IPanelProps) => {

  return (
    <Root>
      <Header>
        {active[0].value.toLocaleString(locale, { month: "long" })}{" "}
        {active[0].value.toLocaleString(locale, { year: "numeric" })}
      </Header>
      <Wrapper>
        {week.map((day) => (
          <div key={day}>
            {dayjs(active[0].value)
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
            onClick={() => onClick?.(day)}
            onMouseEnter={() => onHover?.(day)}
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
      color: tomato;
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
