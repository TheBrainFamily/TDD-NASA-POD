/* eslint-env jest */
import React from "react";
import { render } from "react-testing-library";
import waitForExpect from "wait-for-expect";
import { CONTRACT_TEST_DATE } from "./testHelpers/constants";
import Picture from "./Picture";

// We are going lower level here because this test is slow - we want to run it ONLY when Picture component changes,
// which should be much less often than the rest of the application.
// At the same time - to make sure that our application actually work from the User point of view (so that what are manually
// passing to the picture component matches whatever App is passing down - we use the CONTRACT_TEST_DATE const here and in App.test.js
test("Displays a title, description and link for a picture after fetching it from actual API server", async () => {
  const { getByTestId, getByText } = render(
    <Picture date={CONTRACT_TEST_DATE} />
  );

  expect(getByText("Loading...")).toBeTruthy();

  await waitForExpect(() => {
    expect(getByTestId("title").textContent).toEqual(
      "NGC 1316: After Galaxies Collide"
    );
    expect(getByTestId("description").textContent).toMatch(
      /An example of violence on a cosmic scale/
    );
    expect(getByTestId("link").src).toMatch(/1024d/);
  });
});
