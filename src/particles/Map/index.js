import React from 'react';
import { Link, withRouter } from "react-router-dom";

import "./Map.css";

import { StoreContext } from "../../organisms/Store";

import ReactResizeDetector from 'react-resize-detector';
import P5Wrapper from 'react-p5-wrapper';
import MapSketch from './map.js';
import Algorithms from '../../atoms/ActionAlgorithms';

import cross from './Cross.png';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.algorithms = new Algorithms();
  }

  static contextType = StoreContext;
  
  render() {
    const { match } = this.props;
    const { store } = this.context;
    const found = store.getAction(match.params.id);
    const alg = match.params.algorithm;

    if (!found || (alg !== 'cf' && alg !== 'ff')) {this.props.history.push('/akcje');return null;}

    this.algorithms.calculate(found.attackers, found.targets);

    const linked = this.algorithms.results[`alg${alg === 'cf' ? 1 : 2}Raw`];
    const a = this.algorithms.results[`alg${alg === 'cf' ? 1 : 2}NotUsedA`];
    const b = this.algorithms.results[`alg${alg === 'cf' ? 1 : 2}NotUsedB`];

    return (
      <div id="map">
        <ReactResizeDetector handleWidth handleHeight>
          {({ width, height }) => <P5Wrapper size={{width, height}} data={{linked, a, b}} sketch={MapSketch} />}
        </ReactResizeDetector>
        <div className="navbar">
          <Link to={{pathname: `/akcja/${match.params.id}`}}>
            <img
              src={cross}
              alt="X"
            />
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Map);