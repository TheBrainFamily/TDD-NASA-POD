import PropTypes from "prop-types";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "isomorphic-fetch";

const API = "https://api.nasa.gov/planetary/apod";

const API_KEYS = [
  "VHsm4BrjzecDjMTCLnY4KSbeXGm15JbUITRz7z0f",
  "A1mAH643w6y68fJDEqPFPNLRABrj3AydEOFdtr8z",
  "u2OngTGrCCQH7BtTI8t6hWnVfry0ZD1ZT2kVyxYy",
  "hq04RXdje3qms035X4fwHLMp255HrBtHjH9kqXjE"
];

const apiKey = () => API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
const fetchNasaPicture = date =>
  fetch(`${API}?date=${date}&api_key=${apiKey()}`)
    .then(response => response.json())
    .then(data => data);

export default class Picture extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired
  };
  state = {
    loading: true
  };
  async setPicture() {
    const data = await fetchNasaPicture(this.props.date);
    this.setState({ ...data, loading: false });
  }
  async componentDidMount() {
    await this.setPicture();
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      await this.setPicture();
    }
  }
  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    return (
      <div data-testid="picture">
        <div data-testid="title">{this.state.title}</div>
        <div data-testid="description">{this.state.explanation}</div>
        <img data-testid="link" src={this.state.url} />
      </div>
    );
  }
}
