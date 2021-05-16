import React, { useState } from "react";
import { PageHeader } from "antd";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ListPokemon from "../pages/ListPokemon";
import DetailPokemon from "../pages/DetailPokemon";

interface IPageHeader {
  setTitle: (title: string) => void;
  setSubTitle: (subtitle: string) => void;
  setOnBack: (goBack: undefined | (() => void)) => void;
}

export const PageHeaderContext = React.createContext<IPageHeader | null>(null);

function App() {
  const [title, setTitle] = useState("Pokédex");
  const [subTitle, setSubTitle] = useState("gotta catch 'em all");
  const [onBack, setOnBack] = useState<undefined | (() => void)>(undefined);

  return (
    <PageHeaderContext.Provider
      value={{
        setTitle,
        setSubTitle,
        setOnBack,
      }}
    >
      <PageHeader title={title} subTitle={subTitle} onBack={onBack} />
      <Router>
        <Switch>
          <Route path="/" exact={true}>
            <ListPokemon />
          </Route>
          <Route path="/:id">
            <DetailPokemon />
          </Route>
        </Switch>
      </Router>
    </PageHeaderContext.Provider>
  );
}

export default App;
