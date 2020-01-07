import React from "react";
// TODO: Check out useParams (https://reacttraining.com/react-router/web/example/url-params)
import { Link, withRouter } from "react-router-dom";
import './AsideMenu.css';

import { StoreContext } from "../../organisms/Store";

class AsideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emptyText: props.emptyText || ''
    };
  }

  static contextType = StoreContext;

  isEmpty = () => true;

  getItems = () => null;

  render() {
    const { emptyText } = this.state;
    return this.isEmpty() ? (
      <div className="empty">
        Brak dostępnych<br />{ emptyText }
      </div>
    ) : (
      <ul>
        {this.getItems()}
      </ul>
    );
  }
}

class AsideActionsMenuClass extends AsideMenu {
  constructor(props) {
    super(props);

    this.state = {
      emptyText: 'akcji'
    };
  }

  isEmpty = () => this.context.store.getActions().length === 0;

  getItems = () => {
    const actions = this.context.store.getActions();
    const items = [];
    const itemsMax = 8;
    for (let i in actions) {
      if (i >= itemsMax) break;
      const name = actions[i].name || '(Brak nazwy)';
      const urlParam = this.props.location.pathname.match(/\/akcja\/(\d+)/);
      const active = (urlParam && i === urlParam[1]) ? 'active' : null;
      items.push(
        <Link key={i} to={{pathname: `/akcja/${i}`}}>
          <li className={active}>
            {name}
          </li>
        </Link>
      );
    }
    return items;
  }

}

const AsideActionsMenu = withRouter(AsideActionsMenuClass);

// export withRouter...
export {AsideMenu, AsideActionsMenu};