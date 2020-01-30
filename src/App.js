import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from 'theme/theme';
import GlobalStyle from 'theme/GlobalStyle';
import { Router, Switch, Route } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { ROUTES } from 'utils/routes';
import history from 'components/History';
import { withAuthentication } from 'components/Session';
import Header from 'components/Header';
import Content from 'components/Content';

import SignIn from 'views/SignIn';
import Account from 'views/Account';
import Actions from 'views/Actions';
import NewAction from 'views/NewAction';
import Action from 'views/Action';
import NewSurvey from 'views/NewSurvey';
import SurveyForm from 'views/SurveyForm';
import SurveyFormSuccess from 'views/SurveyFormSuccess';
import Strategies from './views/Strategies';

toast.configure()

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Router history={history}>
      <Header /> 
      <Content>
        <Switch>
          <Route exact path={ROUTES.home} component={SignIn} />
          <Route exact path={ROUTES.actions} component={Actions} />
          <Route exact path={ROUTES.newAction} component={NewAction} />
          <Route exact path={ROUTES.action} component={Action} />
          <Route exact path={ROUTES.strategies} component={Strategies} />
          <Route exact path={ROUTES.newSurvey} component={NewSurvey} />
          <Route exact path={ROUTES.publicSurvey} component={SurveyForm} />
          <Route exact path={ROUTES.publicSurveySuccess} component={SurveyFormSuccess} />
          <Route exact path={ROUTES.user} component={Account} />
        </Switch>
      </Content>
    </Router>
  </ThemeProvider>
);

export default withAuthentication(App);
