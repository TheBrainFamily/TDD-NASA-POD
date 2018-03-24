import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "isomorphic-fetch";

const API_KEY = "VHsm4BrjzecDjMTCLnY4KSbeXGm15JbUITRz7z0f";
const API = "https://api.nasa.gov/planetary/apod";

const fetchNasaPicture = (date = "2017-02-02") => {
  const query = `${API}?date=${date}&api_key=${API_KEY}`;
  return fetch(query)
    .then(response => response.json())
    .then(data => data);
};

export default class Picture extends React.Component {
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
      <React.Fragment>
        <div data-testid="title">{this.state.title}</div>
        <div data-testid="description">{this.state.explanation}</div>
        <img data-testid="link" src={this.state.url} />
      </React.Fragment>
    );
  }
}
