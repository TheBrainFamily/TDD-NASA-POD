/* eslint-disable class-methods-use-this */
import React, { Component } from "react";
import Picture from "./Picture";
import { formatDate } from "./helper/formatDate";

const DIRECTION = {
  BACK: -1,
  FORWARD: 1
};

class App extends Component {
  state = {
    date: new Date()
  };
  onDecreaseWithDirection = direction => {
    const millisecondsInSecond = 1000;
    const secondsInMinute = 60;
    const minutesInHour = 60;
    const hourInDay = 24;

    const newDate = new Date(
      new Date(this.state.date).getTime() +
        hourInDay *
          minutesInHour *
          secondsInMinute *
          millisecondsInSecond *
          direction
    );
    this.setState({ date: newDate });
  };
  onDecreaseDate = () => {
    this.onDecreaseWithDirection(DIRECTION.BACK);
  };
  onIncreaseDate = () => {
    this.onDecreaseWithDirection(DIRECTION.FORWARD);
  };
  render() {
    return (
      <React.Fragment>
        <div data-testid="header">
          <h1>NASA picture of the day</h1>
          <button data-testid="move-back" onClick={this.onDecreaseDate}>
            move back
          </button>
          <div data-testid="date">{formatDate(this.state.date)}</div>
          <button data-testid="move-forward" onClick={this.onIncreaseDate}>
            move forward
          </button>
        </div>
        <Picture date={formatDate(this.state.date)} />
      </React.Fragment>
    );
  }
}
export default App;
