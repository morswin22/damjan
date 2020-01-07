import React from 'react';
import ReactTooltip from 'react-tooltip'

import "./Data.css";
import copy from "./Copy.png";

import copyTextToClipboard from '../../atoms/CopyTextToClipboard';
import { confirmAlert } from 'react-confirm-alert';
import './RemoveAlert.css';

import { StoreContext } from "../../organisms/Store";

function getRange(str, max) {
  const regex = /((\d+)-(\d+))|(\d+)-|-(\d+)|(\d+)/gm;
  let m;

  const result = {};

  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    if (m[2] && m[3]) { // range
      for (let i = parseInt(m[2]); i <= parseInt(m[3]); i++) result[i] = true;
    } else if (m[4]) { // from
      for (let i = parseInt(m[4]); i <= max; i++) result[i] = true;
    } else if (m[5]) { // to
      for (let i = 1; i <= parseInt(m[5]); i++) result[i] = true;
    } else if (m[6]) { // single
      result[parseInt(m[6])] = true;
    }
  }

  return result;
}

class Data extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      c0Copied: false,
      c1Copied: false,
      c2Copied: false,
      c3Copied: false,
      c4Copied: false,
      c5Copied: false,
    }

  }

  static contextType = StoreContext;

  componentDidUpdate(prevProps, prevState) {
    for (let i = 0; i < 6; i++) {
      if (prevState[`c${i}Copied`] !== this.state[`c${i}Copied`] && this.state[`c${i}Copied`] === true) {
        ReactTooltip.hide();
        this[`c${i}Copy`].showTooltip({currentTarget: this[`c${i}CopyImg`]});
      }
    }
  }

  removeActions = event => {
    event.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='remove-ui'>
            <h1>Jesteś pewny?</h1>
            <p>Czy chcesz usunąć wszystkie akcje?</p>
            <button
              onClick={() => {
                for (let id = this.context.actions.length-1; id >= 0; id--) this.context.store.removeAction(id);
                onClose();
              }}
            >
              Tak, usuń
            </button>
            <button onClick={onClose}>Nie</button>
          </div>
        );
      }
    });
  }

  static contextType = StoreContext;
  
  render() {
    return (
      <div id="data">
        <div className="container">
          <h1>Eksportuj akcje</h1>
          <div className="copy-label">
            <img 
              src={copy} alt="copy" 
              target="c0"
              onClick={()=>{copyTextToClipboard(JSON.stringify(this.context.actions), this, 'c0Copied')}}
              data-tip
              data-for="c0Tip"
              ref={(node) => this.c0CopyImg = node}
              onMouseLeave={()=>{
                this.setState({c0Copied: false});
              }}
            />
            <ReactTooltip 
              id='c0Tip' 
              ref={(node) => this.c0Copy = node}
              type={this.state.c0Copied ? 'success' : 'dark'} 
              effect='solid' 
              getContent={() => this.state.c0Copied ? <span>Skopiowano</span> : <span>Skopiuj do schowka</span>} 
            />
            <span>Wszystkie</span>
          </div>
          <div className="copy-label">
            <img 
              src={copy} alt="copy" 
              target="c1"
              onClick={()=>{
                const actions = [];
                for (let i in getRange(this.c1Range.value, this.context.actions.length)) {
                  if (this.context.actions[i-1]) actions.push(this.context.actions[i-1]);
                }
                copyTextToClipboard(JSON.stringify(actions), this, 'c1Copied');
              }}
              data-tip
              data-for="c1Tip"
              ref={(node) => this.c1CopyImg = node}
              onMouseLeave={()=>{
                this.setState({c1Copied: false});
              }}
            />
            <ReactTooltip 
              id='c1Tip' 
              ref={(node) => this.c1Copy = node}
              type={this.state.c1Copied ? 'success' : 'dark'} 
              effect='solid' 
              getContent={() => this.state.c1Copied ? <span>Skopiowano</span> : <span>Skopiuj do schowka</span>} 
            />
            <span>Z zakresu</span>
            <input 
              placeholder="np. 1-4, 6"
              ref={(node) => this.c1Range = node}
            />
          </div>
          <div className="copy-label">
            <img 
              src={copy} alt="copy" 
              target="c2"
              onClick={()=>{
                const actions = [];
                for (let action of this.context.actions) {
                  if (action.name === this.c2Name.value) actions.push(action);
                }
                copyTextToClipboard(JSON.stringify(actions), this, 'c2Copied')
              }}
              data-tip
              data-for="c2Tip"
              ref={(node) => this.c2CopyImg = node}
              onMouseLeave={()=>{
                this.setState({c2Copied: false});
              }}
            />
            <ReactTooltip 
              id='c2Tip' 
              ref={(node) => this.c2Copy = node}
              type={this.state.c2Copied ? 'success' : 'dark'} 
              effect='solid' 
              getContent={() => this.state.c2Copied ? <span>Skopiowano</span> : <span>Skopiuj do schowka</span>} 
            />
            <span>Z nazwy</span>
            <input 
              placeholder="np. Plan B"
              ref={(node) => this.c2Name = node}
            />
          </div>

          <h1>Importuj akcje</h1>
          <textarea ref={(node) => this.actionsImport = node} ></textarea>
          <button 
            className="add"
            onClick={()=>{
              try {
                const json = JSON.parse(this.actionsImport.value);
                if (json) {
                  for (let action of json) this.context.store.addAction(action);
                }
              } catch {}
              this.actionsImport.value = '';
            }}
          >
            Dodaj
          </button>

          <h1>Usuń akcje</h1>
          <button 
            className="remove"
            onClick={this.removeActions}
          >Usuń wszystkie</button>
        </div>

        <div className="container">
          <h1>Eksportuj wiadomości</h1>
          <div className="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Wszystkie</span>
          </div>
          <div className="copy-label">
            <img 
              src={copy} alt="copy" 
              title="Skopiuj do schowka" 
              onClick={()=>{}}
            />
            <span>Z zakresu</span>
            <input placeholder="np. 1-4, 6" />
          </div>
          <div className="copy-label">
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
          <button className="add">Dodaj</button>

          <h1>Usuń wiadomości</h1>
          <button className="remove">Usuń wszystkie</button>
        </div>
      </div>
    );
  }
}

export default Data;