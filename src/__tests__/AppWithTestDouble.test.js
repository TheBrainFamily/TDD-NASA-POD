/* eslint-disable global-require */
/* eslint-env jest */
import React from "react";
import { render, Simulate } from "react-testing-library";
import MockDate from "mockdate";
import waitForExpect from "wait-for-expect";
import td from "../__testHelpers/testDoubleSetup";
import {
  CONTRACT_TEST_DATE,
  DAY_BEFORE_CONTRACT_TEST_DATE
} from "../__testHelpers/constants";
import { dataForFetch } from "../__testHelpers/dataForFetch";

const returnContext = () => {
  const fetch = td.replace("isomorphic-fetch");
  td
    .when(fetch(td.matchers.isA(String)))
    .thenResolve(
      dataForFetch({ title: "title", explanation: "explanation", url: "url" })
    );
  // Crucial Point!
  const App = require("../App").default; // Comment this line out and uncomment the one below,
  // and see the magic happens - all tests pass even though the internals changed significantly!
  // const App = require("./AppWithRedux").default
  return { App, fetch };
};

test("Has the header text", () => {
  const { App } = returnContext();
  const { getByText } = render(<App />);
  expect(getByText("NASA picture of the day")).toBeDefined();
});

describe("Date Displayer", () => {
  function testForDate(date) {
    const { App } = returnContext();
    MockDate.set(date);
    const { getByTestId } = render(<App />);
    expect(getByTestId("date").textContent).toEqual(date);
  }
  describe("should print a NASA-required format", () => {
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

  describe("changes date", () => {
    it("back when clicked on the 'back in time button'", () => {
      const { App } = returnContext();

      MockDate.set("2018-03-24");
      const { getByTestId } = render(<App />);
      const dateDiv = getByTestId("date");

      expect(dateDiv.textContent).toEqual("2018-03-24");

      Simulate.click(getByTestId("move-back"));

      expect(dateDiv.textContent).toEqual("2018-03-23");

      Simulate.click(getByTestId("move-back"));
      expect(dateDiv.textContent).toEqual("2018-03-22");
    });
    it("forward in time when clicked on the 'move forward' button", () => {
      const { App } = returnContext();

      MockDate.set("2018-03-20");
      const { getByTestId } = render(<App />);
      const dateDiv = getByTestId("date");

      expect(dateDiv.textContent).toEqual("2018-03-20");
      Simulate.click(getByTestId("move-forward"));

      expect(dateDiv.textContent).toEqual("2018-03-21");
    });
  });
});

// We don't want to write all those tests that verify the order/relations of html tags,
// but we DO want to be notified when they change. For example - if someone switched the move forward button position
// with move backward.
test("header renders correctly", () => {
  const { App } = returnContext();
  MockDate.set("2018-03-24");
  const { getByTestId } = render(<App />);
  expect(getByTestId("header")).toMatchSnapshot();
});

test("Displays a new picture after moving back in time", async () => {
  const { App, fetch } = returnContext();
  MockDate.set(CONTRACT_TEST_DATE);

  td.when(fetch(td.matchers.contains(CONTRACT_TEST_DATE))).thenResolve(
    dataForFetch({
      title: "First Title",
      explanation: "",
      url: ""
    })
  );
  td
    .when(fetch(td.matchers.contains(DAY_BEFORE_CONTRACT_TEST_DATE)))
    .thenResolve(
      dataForFetch({
        title: "Second Title",
        explanation: "",
        url: ""
      })
    );

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

test("Picture renders correctly", async () => {
  const { App } = returnContext();
  const { getByTestId } = render(<App />);

  // Notice how we can wait for the DOM to be in a shape we want, and THEN take a snapshot
  await waitForExpect(() => {
    expect(getByTestId("title")).toBeTruthy();
  }, 200);
  expect(getByTestId("picture")).toMatchSnapshot();
});
