/* eslint-env jest */
const { formatDate } = require("./formatDate");

// Those are redundant at the moment.. It felt right to unit test this function directly to start with.
// They are ~5-10 times faster than using react. At the same time, it DOESN'T really test the "business value" of the app.
// If, for example, JS introduces .format function to date, we could just do  .format("YYYY-MM-DD") in
// mapStateToProps in case of a redux version - and remove the formatDate altogether, and all tests should still be passing
// since we didn't change the functionality of the app, but only refactored and reduced the code.
// Same if we decide to introduce momentjs or any other date formatting tool.
test("works for single month digits", () => {
  const dateWithSingleDigitMonth = new Date("2018-02-03");
  expect(formatDate(dateWithSingleDigitMonth)).toEqual("2018-02-03");
});
test("works for double digits months", () => {
  const dateWithDoubleDigitsMonth = new Date("2018-10-03");
  expect(formatDate(dateWithDoubleDigitsMonth)).toEqual("2018-10-03");
});
test("works for double digits days", () => {
  const dateWithDoubleDigitDays = new Date("2018-02-25");
  expect(formatDate(dateWithDoubleDigitDays)).toEqual("2018-02-25");
});
