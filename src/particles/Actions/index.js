import React from 'react';
import { Link, withRouter } from "react-router-dom";

import { StoreContext } from "../../organisms/Store";

import "./Actions.css";

class Actions extends React.Component {
  
  static contextType = StoreContext;

  render() {
    const { store } = this.context;
    const actions = store.getActions();

    return (
      <div id="actions">
        <strong>Lista akcji</strong>
        {actions.map((item, i) => <Link to={`/akcja/${i}`}>{item.name === '' ? '(Brak nazwy)' : item.name}</Link>)}
      </div>
    );
  }
}

export default withRouter(Actions);