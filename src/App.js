import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { css } from "glamor";
import Select from "react-select";
import { uniq } from "lodash";

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      markets: [],
      submarkets: [],
      symbols: []
    };
  }

  componentWillMount() {
    var ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    this.open(ws, this);
    this.data(ws, this);
  }

  open = ws => {
    ws.onopen = function(evt) {
      ws.send(
        JSON.stringify({
          active_symbols: "brief",
          product_type: "basic"
        })
      );
    };
  };

  data = (ws, that) => {
    ws.onmessage = function(msg) {
      var data = JSON.parse(msg.data);
      that.setState(
        {
          markets: uniq(
            that.state.markets.concat(data.active_symbols.map(s => s.market))
          )
        },
        () => {
          that.setState({ data: data.active_symbols }, () => {
            that.changeMarket(that.state.markets[0]);
          });
        }
      );
    };
  };
  changeMarket = marketName => {
    console.log("changeMarket");
    const filteredData = this.state.data.filter(s => s.market == marketName);
    this.setState({
      submarkets: uniq(filteredData.map(d => d.submarket)),
      symbols: uniq(filteredData.map(d => d.symbol))
    });
  };

  changeSubMarket = subMarketName => {
    console.log("changeSubMarket");

    const filteredData = this.state.data.filter(
      s => s.submarket == subMarketName
    );
    this.setState({ symbols: uniq(filteredData.map(d => d.symbol)) });
  };

  render() {
    return (
      <div className="App">
        <div className="col-md-4 f2">
          <select
            className="f3"
            {...css({
              width: "350px",
              height: "36px",
              borderRadius: "25px",
              backgroundColor: "white"
            })}
            onChange={() => this.changeMarket}
            value={this.state.markets[0]}
            required
          >
            <option value={null}>Select Market</option>
            {this.state.markets.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 f2">
          <select
            className="f3"
            {...css({
              width: "350px",
              height: "36px",
              borderRadius: "25px",
              backgroundColor: "white"
            })}
            onChange={() => this.changeSubMarket}
            value={this.state.submarkets[0]}
            required
          >
            <option value={null}>Select Sub Market</option>
            {this.state.submarkets.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 f2">
          <select
            className="f3"
            {...css({
              width: "350px",
              height: "36px",
              borderRadius: "25px",
              backgroundColor: "white"
            })}
            onChange={() => console.log("done")}
            value={this.state.symbols[0]}
            required
          >
            <option value={null}>Select Symbol</option>
            {this.state.symbols.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default App;
