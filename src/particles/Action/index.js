import React from "react";
import { Link, withRouter } from "react-router-dom";
import ReactTooltip from 'react-tooltip'

import { StoreContext } from "../../organisms/Store";

import "./Action.css";
import map from './Map.png';
import copy from './Copy.png';
import cross from './Cross.png';

import Algorithms from '../../atoms/ActionAlgorithms';
import { Scrollbars } from 'react-custom-scrollbars';
import copyTextToClipboard from '../../atoms/CopyTextToClipboard';
import { Bar } from 'react-chartjs-2';

class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cfCopied: false,
      ffCopied: false,
    }

    this.algorithms = new Algorithms();
  }
  
  static contextType = StoreContext;
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.cfCopied !== this.state.cfCopied && this.state.cfCopied === true) {
      ReactTooltip.hide();
      this.cfCopy.showTooltip({currentTarget: this.cfCopyImg});
    }
    if (prevState.ffCopied !== this.state.ffCopied && this.state.ffCopied === true) {
      ReactTooltip.hide();
      this.ffCopy.showTooltip({currentTarget: this.ffCopyImg});
    }
  }

  render() {
    const { match } = this.props;
    const { store } = this.context;
    const found = store.getAction(match.params.id);

    if (!found) {this.props.history.push('/akcje');return null;}

    const { 
      cf, 
      cfExtra, 
      cfChart,
      ff, 
      ffExtra,
      ffChart,
      max
    } = this.algorithms.calculate(found.attackers, found.targets);

    const cfChartData = {
      labels: cfChart.labels,
      datasets: [
        {
          label: 'Dystans',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: cfChart.data
        }
      ]
    };

    const ffChartData = {
      labels: ffChart.labels,
      datasets: [
        {
          label: 'Dystans',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: ffChart.data
        }
      ]
    };

    const chartOptions = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true,
            min: 0,
            max    
          }
        }]
      }
    }

    return (
      <div id="action">
        <div className="container">
          <div className="header">Algorytm CF</div>
          <div className="output">
            <Scrollbars className="scrollbar" style={{width: 540, height: 200}}>
              <div className="text">
                {cf}
              </div>
            </Scrollbars>
            <img 
              src={copy} alt="copy"
              target="cf"
              onClick={()=>{copyTextToClipboard(cf, this, 'cfCopied')}}
              data-tip
              data-for="cfTip"
              ref={(node) => this.cfCopyImg = node}
              onMouseLeave={()=>{
                this.setState({cfCopied: false});
              }}
              />
            <ReactTooltip 
              id='cfTip' 
              ref={(node) => this.cfCopy = node}
              type={this.state.cfCopied ? 'success' : 'dark'} 
              effect='solid' 
              getContent={() => this.state.cfCopied ? <span>Skopiowano</span> : <span>Skopiuj do schowka</span>} 
            />
          </div>
          <div className="summary">
            <div className="statistics">
              <h1>Podsumowanie</h1>
              <div className="label">
                <span className="info">Najmniejszy dystans</span>
                <span className="number">{cfExtra[0]}</span>
              </div>
              <div className="label">
                <span className="info">Średni dystans</span>
                <span className="number">{cfExtra[1]}</span>
              </div>
              <div className="label">
                <span className="info">Największy dystans</span>
                <span className="number">{cfExtra[2]}</span>
              </div>
            </div>
            <figure className="map">
              <img src={map} alt="Mapa" />
              <figcaption>
                <Link to={{pathname: `/akcja/${match.params.id}/cf/mapa`}}>
                  Otwórz mapę
                </Link>
              </figcaption>
            </figure>
          </div>
          <div className="chart">
            <Bar
              data={cfChartData}
              options={chartOptions}
            />
          </div>
        </div>
        <div className="container">
          <div className="header">Algorytm FF</div>
          <div className="output">
            <Scrollbars className="scrollbar" style={{width: 540, height: 200}}>
              <div className="text">
                {ff}
              </div>
            </Scrollbars>
            <img 
              src={copy} alt="copy"
              target="ff"
              onClick={()=>{copyTextToClipboard(ff, this, 'ffCopied')}}
              data-tip
              data-for="ffTip"
              ref={(node) => this.ffCopyImg = node}
              onMouseLeave={()=>{
                this.setState({ffCopied: false});
              }}
              />
            <ReactTooltip 
              id='ffTip' 
              ref={(node) => this.ffCopy = node}
              type={this.state.ffCopied ? 'success' : 'dark'} 
              effect='solid' 
              getContent={() => this.state.ffCopied ? <span>Skopiowano</span> : <span>Skopiuj do schowka</span>} 
            />
          </div>
          <div className="summary">
            <div className="statistics">
              <h1>Podsumowanie</h1>
              <div className="label">
                <span className="info">Najmniejszy dystans</span>
                <span className="number">{ffExtra[0]}</span>
              </div>
              <div className="label">
                <span className="info">Średni dystans</span>
                <span className="number">{ffExtra[1]}</span>
              </div>
              <div className="label">
                <span className="info">Największy dystans</span>
                <span className="number">{ffExtra[2]}</span>
              </div>
            </div>
            <figure className="map">
              <img src={map} alt="Mapa" />
              <figcaption>
                <Link to={{pathname: `/akcja/${match.params.id}/ff/mapa`}}>
                  Otwórz mapę
                </Link>
              </figcaption>
            </figure>
          </div>
          <div className="chart">
            <Bar
              data={ffChartData}
              options={chartOptions}
            />
          </div>
        </div>
        <div className="navbar">
          <Link to={{pathname: `/akcja/${match.params.id}/edytuj`}}>
            Edytuj
          </Link>
          <Link to="/akcje">
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

export default withRouter(Action);