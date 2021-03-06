import dayjs from "dayjs";
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Calendar, IRange } from "./components/Calendar";

const Reset = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body  {
    font-family: sans-serif;
    font-size: 16px;
  }
`;

function App() {
  // const [date, setDate] = useState(new Date());
  // const [dates, setDates] = useState([
  //   new Date(),
  //   dayjs()
  //     .set("d", +10)
  //     .toDate(),
  // ]);
  const [range, setRange] = useState<IRange>([]);

  return (
    <Root>
      <Reset />
      <Calendar
        mode={"range"}
        range={range}
        onRangeChange={(r) => setRange(r)}
        rows={2}
        columns={4}
        interactiveRange
        weekStartDay={1}
        // hideExternal
        // trimWeeks
        disabled={[
          [
            dayjs().toDate(),
            dayjs().date(29).hour(0).toDate(),
          ],
          dayjs()
            .toDate(),
          // dayjs()
          //   .set("d", +27)
          //   .toDate(),
          // dayjs()
          //   .set("d", +132)
          //   .toDate(),
        ]}
        // maxDate={new Date()}
        // minDate={new Date()}
      />
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 50px;
`;

export default App;
