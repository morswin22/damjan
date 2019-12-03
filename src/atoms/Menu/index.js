import React from "react";
import { withRouter, Link } from 'react-router-dom';

class Menu extends React.Component {  
  render() {
    const path = this.props.location.pathname;
    return (
      <ul>
        <li>
          <Link to="/" className={'/'===path?'active':null}>
            Główna
          </Link>
        </li>
        <li>
          <Link to="/akcje" className={'/akcje'===path?'active':null}>
            Akcje
          </Link>
        </li>
        <li>
          <Link to="/wiadomosci" className={'/wiadomosci'===path?'active':null}>
            Wiadomości
          </Link>
        </li>
        <li>
          <Link to="/dane" className={'/dane'===path?'active':null}>
            Dane
          </Link>
        </li>
      </ul>
    )
  }
}

export default withRouter(Menu);