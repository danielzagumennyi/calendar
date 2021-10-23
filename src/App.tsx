import dayjs from "dayjs";
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Grid } from "./components/Grid";

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
  const [range, setRange] = useState<Date[]>([
    dayjs().year(2024).toDate(),
    dayjs()
      .year(2024)
      .set("d", +10)
      .toDate(),
  ]);

  return (
    <Root>
      <Reset />
      <Grid
        mode={"range"}
        range={range}
        onRangeChange={(r) => setRange(r)}
        rows={2}
        columns={4}
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
