import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import GlobalStyle from './theme/GlobalStyle';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ROUTES } from './utils/routes';
import Header from './components/Header';
import Content from './components/Content';
import Navbar from './components/Navbar';
import User from './components/User';

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Router>
      <Header /> 
      <Navbar />
      <User />
      <Content>
        <Switch>
          <Route exact path={ROUTES.home}>
            <button onClick={()=>{document.getElementById('root').style.columnGap = '.2rem'}}>Click me!</button>
          </Route>
        </Switch>
      </Content>
    </Router>
  </ThemeProvider>
);

export default App;
