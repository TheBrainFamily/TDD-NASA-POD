/* eslint-env jest */
global.td = require("testdouble");

require("testdouble-jest")(global.td, jest);

beforeEach(() => {
  global.td.reset();
});
export default global.td;
