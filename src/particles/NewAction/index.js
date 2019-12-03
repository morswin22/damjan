import React from "react";
import { withRouter } from "react-router-dom";
import './NewAction.css';
import warning from './Warning.png';

import ReactResizeDetector from 'react-resize-detector';

import { StoreContext } from "../../organisms/Store";

class NewAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      attackers: [],
      targets: []
    };
  }

  static contextType = StoreContext;
  
  onSubmit = event => {
    // Save this data to the Storage
    const id = this.context.store.addAction(this.state);
    event.preventDefault();
    this.props.history.push(`/akcja/${id}`);
  }

  onBlur = event => {
    const { value } = event.target;
    const r = /(\d+)\|(\d+)/gm;
    let m;
    const result = [];
    event.target.value = '';
    while ((m = r.exec(value)) !== null) {
      if (m.index === r.lastIndex) r.lastIndex++;
      result.push({
        x: m[1],
        y: m[2]
      });
      event.target.value += `${m[1]}|${m[2]}\n`;
    }
    this.setState({
      [event.target.id]: result
    });
  }

  onChange = event => {
    this.setState({
      name: event.target.value
    });
  }
  
  render() {
    const attackers = this.state.attackers.length;
    const targets = this.state.targets.length;
    const unusedAtt = targets > attackers? 0 : attackers - targets;
    const unusedTar = attackers > targets? 0 : targets - attackers;

    return (
      <form id="newAction" onSubmit={this.onSubmit}>
        <div className="name">
          <h1>Nowa akcja</h1>
          <input 
            placeholder="Nazwa akcji..." 
            type="text" 
            onChange={this.onChange}
          />
        </div>
        <div className="data">
          <h1>Dane</h1>
          <ReactResizeDetector handleWidth handleHeight>
            {({ width, height }) => <>
            <textarea 
              placeholder="Atakujący..." 
              onBlur={this.onBlur}
              id="attackers"
              style={{"--h": height-55 + 'px'}}
            ></textarea>
            <textarea 
              placeholder="Cele..." 
              onBlur={this.onBlur}
              id="targets"
              style={{"--h": height-55 + 'px'}}
            ></textarea>
            </>}
          </ReactResizeDetector>
        </div>
        <div className="summary">
          <h1>Podsumowanie</h1>
          <div className="label">
            <span className="info">Liczba wiosek atakujących</span>
            <span className="number">{attackers}</span>
          </div>
          <div className="label">
            <span className="info">Liczba wiosek broniących</span>
            <span className="number">{targets}</span>
          </div>
          <div className="label">
            <span className="info">Nieużytych atakujących</span>
            <span className="number">
              {unusedAtt}
              {(unusedAtt > 0 ? <img src={warning} alt="!" title="Tyle wiosek nie zaatakuje przeciwnika" /> : null)}
            </span>
          </div>
          <div className="label">
            <span className="info">Nieużytych broniących</span>
            <span className="number">
              {unusedTar}
              {(unusedTar > 0 ? <img src={warning} alt="!" title="Tyle wiosek nie będzie zaatakowanych" /> : null)}
            </span>
          </div>
        </div>
        <div className="submit">
          <p>Planer ataków posiada dwa algorytmy, które pozwalają obliczyć skuteczne strategie ataku na przeciwnika</p>
          <input type="submit" value="OBLICZ STRATEGIE"/>
        </div>
      </form>
    );
  }
}

export default withRouter(NewAction);