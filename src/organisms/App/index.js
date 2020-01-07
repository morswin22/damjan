import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

import Menu from '../../atoms/Menu';
import {AsideMenu, AsideActionsMenu} from "../../atoms/AsideMenu";

// pages
import Home from '../../particles/Home';
import NewAction from "../../particles/NewAction";
import EditAction from "../../particles/EditAction";
import Action from "../../particles/Action";
import Actions from "../../particles/Actions";
import Map from '../../particles/Map';
import WillBeAdded from '../../particles/WillBeAdded'

import message from './Message.png';
import plan from './Plan.png';
import plus from './Plus.png';
import Data from "../../particles/Data";

function App() {
  return (
    <Router>
      <header>
        <div className="title">
          Plemiona: Planer ataków
        </div>
        <Menu />
      </header>

      <aside>
        <div className="item">
          <div className="title">
            <img 
              src={plan} 
              width="32" 
              height="42" 
              alt=""
            />
            <span>
              Akcje
            </span>
            <Link to="/nowa-akcja">
              <img 
                src={plus} 
                width="22" 
                height="22" 
                alt="+"
                // TODO: active using withRouter
              />
            </Link>
          </div>
          <AsideActionsMenu />
        </div>
        <div className="item">
          <div className="title">
          <img 
              src={message} 
              width="40" 
              height="28" 
              alt=""
            />
            <span>
              Wiadomości
            </span>
            <Link to="/nowe-wiadomosci">
              <img 
                src={plus} 
                width="22" 
                height="22" 
                alt="+"
              />
            </Link>
          </div>
          <AsideMenu emptyText="wiadomości" />
        </div>
      </aside>
      
      <main>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/akcje">
            <Actions />
          </Route>
          <Route path="/wiadomosci">
            <WillBeAdded version="3" />
          </Route>
          <Route path="/dane">
            <Data />
          </Route>

          <Route path="/nowa-akcja">
            <NewAction />
          </Route>
          <Route path="/akcja/:id/:algorithm/mapa">
            <Map />
          </Route>
          <Route path="/akcja/:id/edytuj">
            <EditAction />
          </Route>
          <Route path="/akcja/:id">
            <Action />
          </Route>
          
          <Route path="/nowe-wiadomosci">
            <WillBeAdded version="3" />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
