import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import GlobalStyle from './theme/GlobalStyle';
import { Router, Switch, Route } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { ROUTES } from './utils/routes';
import history from './components/History';
import { withAuthentication } from './components/Session';
import Header from './components/Header';
import Content from './components/Content';

import SignIn from './views/SignIn';
import Account from './views/Account';

toast.configure()

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Router history={history}>
      <Header /> 
      <Content>
        <Switch>
          <Route exact path={ROUTES.home} component={SignIn} />
          
          <Route exact path={ROUTES.user} component={Account} />
        </Switch>
      </Content>
    </Router>
  </ThemeProvider>
);

export default withAuthentication(App);
