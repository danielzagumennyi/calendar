import dayjs from "dayjs";
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Calendar } from "./components/Calendar";

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
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState([
    new Date(),
    dayjs()
      .set("d", +10)
      .toDate(),
  ]);
  const [range, setRange] = useState<Date[]>([]);

  return (
    <Root>
      <Reset />
      <Calendar
        mode={"range"}
        range={range}
        onRangeChange={(r) => setRange(r)}
        rows={2}
        columns={4}
        disabled={[
          [
            dayjs().toDate(),
            dayjs()
              .set("d", +10)
              .toDate(),
          ],
          dayjs()
            .set("d", +25)
            .toDate(),
          dayjs()
            .set("d", +27)
            .toDate(),
          dayjs()
            .set("d", +132)
            .toDate(),
        ]}
        // hideExternal
        // trimWeeks
      />
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export default App;
