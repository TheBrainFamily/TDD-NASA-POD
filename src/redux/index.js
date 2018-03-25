// Disclaimer: This is NOT a great example of setting up redux.
import { createStore } from "redux";

const SET_DATE = "SET_DATE";

export function setDate(date) {
  return {
    type: SET_DATE,
    date
  };
}

function returnStore() {
  const initialState = {
    date: new Date()
  };
  function reducer(state = initialState, action) {
    switch (action.type) {
      case SET_DATE:
        return { ...state, ...{ date: action.date } };
      default:
        return state;
    }
  }

  return createStore(reducer);
}

export { returnStore };
