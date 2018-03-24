const assert = require("assert");

const expect = value => ({
  toEqual: expectation => {
    try {
      assert.equal(value, expectation);
    } catch (e) {
      console.error(`Error: ${value} not equal ${expectation}`);
    }
  },
  toThrow: expectedError => {
    let exceptionThrown = false;
    try {
      value();
    } catch (e) {
      exceptionThrown = true;
      if (e.message !== expectedError) {
        console.error(`Error: expected ${expectedError} but got ${e}`);
      }
    }
    if (!exceptionThrown) {
      console.error("Error: exception not thrown");
    }
  },
  toExist: value => !!value
});

const add = (a, b) => {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error("Can't add strings");
  }
  return a + b;
};

// expect(add(3, 4)).toEqual(7);

expect().toExist;
// expect(add("3", 4)).toThrow("Can't add strings");
