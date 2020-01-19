import React from 'react';
import { withFirebase } from 'components/Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { ROUTES } from 'utils/routes';

const AuthUserContext = React.createContext(null);

export const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
      };
    }
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (authUser) {
            const ref = this.props.firebase.user(authUser.uid);
            ref.on('value', snapshot => {
              const dbUser = snapshot.val();

              if (dbUser !== null) {
                // Merge user from auth and db
                authUser = {
                  uid: authUser.uid,
                  email: authUser.email,
                  ...dbUser,
                };

                this.setState({ authUser });
              } else {
                // First Login (setup account on database)
                ref.set({
                  name: authUser.email.split('@')[0],
                  timestamp: Date.now(),
                  // actions: {},
                  // surverys: {},
                  // templates: {}
                });
              }
            });
          } else {
            this.setState({ authUser: null });
          }
        },
      );
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.home);
          }
        },
      );
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <Component {...this.props} />
      );
    }
  }
  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default AuthUserContext;