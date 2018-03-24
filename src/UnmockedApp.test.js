/* eslint-env jest */
import React from "react";
import MockDate from "mockdate";
import { render, Simulate } from "react-testing-library";
import waitForExpect from "wait-for-expect";
import App from "./App";

describe("Display a Picture", () => {
  describe("for 2017-02-02", () => {
    beforeEach(() => {
      MockDate.set("2/2/2017");
    });
    it("Displays a title for a picture", async () => {
      const { getByTestId, getByText } = render(<App />);

      expect(getByText("Loading...")).toBeTruthy();

      await waitForExpect(() => {
        const titleDiv = getByTestId("title");

        expect(titleDiv.textContent).toEqual(
          "NGC 1316: After Galaxies Collide"
        );
      });
    });
    it("Displays a description for a picture", async () => {
      const { getByTestId } = render(<App />);

      await waitForExpect(() => {
        const descriptionDiv = getByTestId("description");

        expect(descriptionDiv.textContent).toMatch(
          /An example of violence on a cosmic scale/
        );
      });
    });
    it("Displays a link for a picture", async () => {
      const { getByTestId } = render(<App />);

      await waitForExpect(() => {
        const linkImg = getByTestId("link");

        expect(linkImg.src).toMatch(/1024d/);
      });
    });
  });

  describe("for 2016/02/02", () => {
    beforeEach(() => {
      MockDate.set("2/2/2016");
    });
    it("Displays a title for a picture", async () => {
      const { getByTestId, getByText } = render(<App />);

      expect(getByText("Loading...")).toBeTruthy();

      await waitForExpect(() => {
        const titleDiv = getByTestId("title");

        expect(titleDiv.textContent).toMatch(/Comet 67P/);
      });
    });
    it("Displays a description for a picture", async () => {
      const { getByTestId } = render(<App />);

      await waitForExpect(() => {
        const descriptionDiv = getByTestId("description");

        expect(descriptionDiv.textContent).toMatch(/Spacecraft Rosetta/);
      });
    });
    it("Displays a link for a picture", async () => {
      const { getByTestId } = render(<App />);

      await waitForExpect(() => {
        const linkImg = getByTestId("link");

        expect(linkImg.src).toMatch(/Comet67P/);
      });
    });
  });

  describe("Changing the time", () => {
    beforeEach(() => {
      MockDate.set("2/2/2017");
    });
    it(
      "displays a new picture after moving back in time",
      async () => {
        const { getByTestId, getByText } = render(<App />);

        expect(getByText("Loading...")).toBeTruthy();

        await waitForExpect(() => {
          const titleDiv = getByTestId("title");

          expect(titleDiv.textContent).toEqual(
            "NGC 1316: After Galaxies Collide"
          );
        });

        Simulate.click(getByTestId("move-back"));

        await waitForExpect(() => {
          const titleDiv = getByTestId("title");

          expect(titleDiv.textContent).toMatch(/Four/);
        });
      },
      10000
    );
  });
});
