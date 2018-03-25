/* eslint-disable class-methods-use-this */
import React, { Component } from "react";
import { connect, Provider } from "react-redux";
import "./App.css";
import Picture from "./Picture";
import { returnStore, setDate } from "./redux";
import { formatDate } from "./helper/formatDate";

const DIRECTION = {
  BACK: -1,
  FORWARD: 1
};

class App extends Component {
  onDecreaseWithDirection = direction => {
    const millisecondsInSecond = 1000;
    const secondsInMinute = 60;
    const minutesInHour = 60;
    const hourInDay = 24;

    const newDate = new Date(
      new Date(this.props.date).getTime() +
        hourInDay *
          minutesInHour *
          secondsInMinute *
          millisecondsInSecond *
          direction
    );
    this.props.onDateChange(newDate);
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
          <div data-testid="date">{this.props.date}</div>
          <button data-testid="move-forward" onClick={this.onIncreaseDate}>
            move forward
          </button>
        </div>
        <Picture date={this.props.date} />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  date: formatDate(state.date)
});

const mapDispatchToProps = dispatch => ({
  onDateChange: date => {
    dispatch(setDate(date));
  }
});
const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);

const AppWithRedux = () => (
  <Provider store={returnStore()}>
    <AppConnected />
  </Provider>
);

export default AppWithRedux;
