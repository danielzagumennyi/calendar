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

  return (
    <Root>
      <Reset />
      <Grid date={date} onDateChange={(v) => setDate(v)} rows={2} columns={3} />
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export default App;
