/* eslint-env jest */
import React from "react";
import { render, Simulate } from "react-testing-library";
import MockDate from "mockdate";
import App from "./App";

jest.mock("isomorphic-fetch");
const fetch = require("isomorphic-fetch");

fetch.mockResolvedValue({
  json: () => ({
    title: "",
    explanation: "",
    url: ""
  })
});

test("Has the header", () => {
  const { getByText } = render(<App />);
  expect(getByText("NASA picture of the day")).toBeDefined();
});

describe("Date", () => {
  it("should be printed in NASA-required format", () => {
    MockDate.set("3/24/2018");
    const { getByTestId } = render(<App />);
    expect(getByTestId("date").textContent).toEqual("2018-03-24");
  });
  it("should print a different NASA-required formatted date", () => {
    MockDate.set("2/2/2017");
    const { getByTestId } = render(<App />);
    expect(getByTestId("date").textContent).toEqual("2017-02-02");
  });
});

const { formatDate } = require("./App");

describe("formatDate", () => {
  it("works for single month digits", () => {
    const dateWithSingleDigitMonth = new Date("2/3/2018");
    expect(formatDate(dateWithSingleDigitMonth)).toEqual("2018-02-03");
  });
  it("works for double digits months", () => {
    const dateWithDobuleDigitMonth = new Date("11/3/2018");
    expect(formatDate(dateWithDobuleDigitMonth)).toEqual("2018-11-03");
  });
  it("works for double digits days", () => {
    const dateWithDoubleDigitDays = new Date("11/13/2018");
    expect(formatDate(dateWithDoubleDigitDays)).toEqual("2018-11-13");
  });
});

test("header renders correctly", () => {
  MockDate.set("3/24/2018");
  const { getByTestId } = render(<App />);
  expect(getByTestId("header")).toMatchSnapshot();
});

describe("change date", () => {
  it("should change the date back when clicked on the 'back in time button'", () => {
    MockDate.set("3/24/2018");
    const { getByTestId } = render(<App />);
    const dateDiv = getByTestId("date");

    expect(dateDiv.textContent).toEqual("2018-03-24");

    Simulate.click(getByTestId("move-back"));

    expect(dateDiv.textContent).toEqual("2018-03-23");

    Simulate.click(getByTestId("move-back"));
    expect(dateDiv.textContent).toEqual("2018-03-22");
  });
  it("should move the date back in time when clicked on the 'back in time' button", () => {
    MockDate.set("3/20/2018");
    const { getByTestId } = render(<App />);
    const dateDiv = getByTestId("date");

    expect(dateDiv.textContent).toEqual("2018-03-20");
    Simulate.click(getByTestId("move-forward"));

    expect(dateDiv.textContent).toEqual("2018-03-21");
  });
});
