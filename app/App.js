import React from "react";
import { AragonApp, Text, observe, TextInput } from "@aragon/ui";
// import Aragon, { providers } from "@aragon/client";
import styled from "styled-components";

import FormData from "./FormData"
import NewNodeForm from "./NewNodeForm"

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {
  render() {
    return (
      <AppContainer>
        <div>fuck that</div>
        <NewNodeForm />
      </AppContainer>
    );
  }
}

const ObservedCount = observe(state$ => state$, { count: 0 })(({ count }) => (
  <Text.Block style={{ textAlign: "center" }} size="xxlarge">
    {count}
  </Text.Block>
));
