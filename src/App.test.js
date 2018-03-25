/* eslint-env jest */
import React from "react";
import { render, Simulate } from "react-testing-library";
import MockDate from "mockdate";
import waitForExpect from "wait-for-expect";
import {
  CONTRACT_TEST_DATE,
  DAY_BEFORE_CONTRACT_TEST_DATE
} from "./testHelpers/constants";
// Crucial Point!
import App from "./App"; // Comment this line out and uncomment the one below,
// and see the magic happens - all tests pass even though the internals changed significantly!
// import App from "./AppWithRedux";

jest.mock("isomorphic-fetch");
const fetch = require("isomorphic-fetch");

beforeEach(() => {
  fetch.mockResolvedValue({
    json: () => ({
      title: "title",
      explanation: "explanation",
      url: "url"
    })
  });
});

test("Has the header", () => {
  const { getByText } = render(<App />);
  expect(getByText("NASA picture of the day")).toBeDefined();
});

describe("Date", () => {
  function testForDate(date) {
    MockDate.set(date);
    const { getByTestId } = render(<App />);
    expect(getByTestId("date").textContent).toEqual(date);
  }
  describe("it should print a NASA-required format", () => {
    it("with single digits for day and month", () => {
      testForDate("2017-02-02");
    });
    it("with double digits for a day", () => {
      testForDate("2018-03-10");
    });
    it("with double digits for a month", () => {
      testForDate("2017-10-02");
    });
  });
});

// We don't want to write all those tests that verify the order/relations of html tags,
// but we DO want to be notified when they change. For example - if someone switched the move forward button position
// with move backward.
test("header renders correctly", () => {
  MockDate.set("2018-03-24");
  const { getByTestId } = render(<App />);
  expect(getByTestId("header")).toMatchSnapshot();
});

describe("change header date", () => {
  it("should change the date back when clicked on the 'back in time button'", () => {
    MockDate.set("2018-03-24");
    const { getByTestId } = render(<App />);
    const dateDiv = getByTestId("date");

    expect(dateDiv.textContent).toEqual("2018-03-24");

    Simulate.click(getByTestId("move-back"));

    expect(dateDiv.textContent).toEqual("2018-03-23");

    Simulate.click(getByTestId("move-back"));
    expect(dateDiv.textContent).toEqual("2018-03-22");
  });
  it("should move the date back in time when clicked on the 'back in time' button", () => {
    MockDate.set("2018-03-20");
    const { getByTestId } = render(<App />);
    const dateDiv = getByTestId("date");

    expect(dateDiv.textContent).toEqual("2018-03-20");
    Simulate.click(getByTestId("move-forward"));

    expect(dateDiv.textContent).toEqual("2018-03-21");
  });
});

describe("Changing the time", () => {
  beforeEach(() => {
    MockDate.set(CONTRACT_TEST_DATE);
  });
  it("displays a new picture after moving back in time", async () => {
    fetch.mockImplementation(query => {
      if (query.match(CONTRACT_TEST_DATE)) {
        return Promise.resolve({
          json: () => ({
            title: "First Title",
            explanation: "",
            url: ""
          })
        });
      }
      if (query.match(DAY_BEFORE_CONTRACT_TEST_DATE)) {
        return Promise.resolve({
          json: () => ({
            title: "Second Title",
            explanation: "",
            url: ""
          })
        });
      }
      return Promise.reject(new Error("Unmatched Date"));
    });

    const { getByTestId, getByText } = render(<App />);

    expect(getByText("Loading...")).toBeTruthy();

    await waitForExpect(() => {
      const titleDiv = getByTestId("title");

      expect(titleDiv.textContent).toEqual("First Title");
    });

    Simulate.click(getByTestId("move-back"));

    await waitForExpect(() => {
      const titleDiv = getByTestId("title");

      expect(titleDiv.textContent).toMatch("Second Title");
    });
  });
});

test("Picture renders correctly", async () => {
  const { getByTestId } = render(<App />);

  // Notice how we can wait for the DOM to be in a shape we want, and THEN take a snapshot
  await waitForExpect(() => {
    expect(getByTestId("title")).toBeTruthy();
  }, 200);
  expect(getByTestId("picture")).toMatchSnapshot();
});
