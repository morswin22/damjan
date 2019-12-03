import React from 'react';
import { Link } from "react-router-dom";

import "./Data.css";
import copy from "./Copy.png";

import { StoreContext } from "../../organisms/Store";

class Data extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  static contextType = StoreContext;
  
  render() {
    return (
      <div id="data">
        <div class="container">
          <h1>Eksportuj akcje</h1>
          <div class="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Wszystkie</span>
          </div>
          <div class="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Z zakresu</span>
            <input placeholder="np. 1-4, 6" />
          </div>
          <div class="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Z nazwy</span>
            <input placeholder="np. Plan B" />
          </div>

          <h1>Importuj akcje</h1>
          <textarea></textarea>
          <button class="add">Dodaj</button>

          <h1>Usuń akcje</h1>
          <button class="remove">Usuń wszystkie</button>
        </div>

        <div class="container">
          <h1>Eksportuj wiadomości</h1>
          <div class="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Wszystkie</span>
          </div>
          <div class="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Z zakresu</span>
            <input placeholder="np. 1-4, 6" />
          </div>
          <div class="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Z nazwy</span>
            <input placeholder="np. Plan B" />
          </div>

          <h1>Importuj wiadomości</h1>
          <textarea></textarea>
          <button class="add">Dodaj</button>

          <h1>Usuń wiadomości</h1>
          <button class="remove">Usuń wszystkie</button>
        </div>
        {/* <StoreConsumer>
          {ctx => 
            <>
              <button onClick={ctx.store.clearActions}>Wyczyść Akcje</button>
              <button onClick={ctx.store.clearMessages}>Wyczyść Wiadomości</button>
              <button onClick={ctx.store.clearAll}>Wyczyść cały Store</button>
              <br /><code>{JSON.stringify(ctx.store.getActions())}</code>
            </>
          }
        </StoreConsumer> */}
      </div>
    );
  }
}

export default Data;