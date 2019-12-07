import React from "react";
import { withRouter } from "react-router-dom";
import './EditAction.css';
import warning from './Warning.png';

import ReactResizeDetector from 'react-resize-detector';
import { confirmAlert } from 'react-confirm-alert';
import './RemoveAlert.css';

import { StoreContext } from "../../organisms/Store";

class EditAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      attackers: [],
      attackersValue: '',
      targets: [],
      targetsValue: ''
    };
  }

  static contextType = StoreContext;
  
  componentDidMount() {
    const id = this.props.match.params.id;
    const data = this.context.store.getAction(id);
    let attackersValue = '';
    for (let attacker of data.attackers) attackersValue += `${attacker.x}|${attacker.y}\n`;
    let targetsValue = '';
    for (let target of data.targets) targetsValue += `${target.x}|${target.y}\n`;
    this.setState({
      ...data,
      attackersValue,
      targetsValue,
      id,
    });
  }

  onSubmit = event => {
    // Save this data to the Storage
    // const id = this.context.store.addAction(this.state);
    this.context.store.editAction(this.state.id, {
      name: this.state.name,
      attackers: this.state.attackers,
      targets: this.state.targets,
    });
    event.preventDefault();
    this.props.history.push(`/akcja/${this.state.id}`);
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

  remove = event => {
    event.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='remove-ui'>
            <h1>Jesteś pewny?</h1>
            <p>Czy chcesz usunąć tę akcję?</p>
            <button
              onClick={() => {
                this.context.store.removeAction(this.state.id);
                onClose();
                this.props.history.push(`/akcje`);
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
  
  render() {
    const { name, attackersValue, targetsValue } = this.state;

    const attackers = this.state.attackers.length;
    const targets = this.state.targets.length;
    const unusedAtt = targets > attackers? 0 : attackers - targets;
    const unusedTar = attackers > targets? 0 : targets - attackers;

    return (
      <form id="editAction" onSubmit={this.onSubmit}>
        <div className="name">
          <h1>Edytuj akcję</h1>
          <input 
            placeholder="Nazwa akcji..." 
            type="text" 
            onChange={this.onChange}
            defaultValue={name}
          />
        </div>
        <div className="remove">
          <button onClick={this.remove}>USUŃ AKCJĘ</button>
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
              defaultValue={attackersValue}
            ></textarea>
            <textarea 
              placeholder="Cele..." 
              onBlur={this.onBlur}
              id="targets"
              style={{"--h": height-55 + 'px'}}
              defaultValue={targetsValue}
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

export default withRouter(EditAction);