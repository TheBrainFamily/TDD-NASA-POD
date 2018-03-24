import { createStore } from "redux";

const SET_DATE = "SET_DATE";

const formatDate = date => {
  const year = date.getFullYear();
  const month =
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${year}-${month}-${day}`;
};

export function setDate(date) {
  return {
    type: SET_DATE,
    date
  };
}

function returnStore() {
  const initialState = {
    date: formatDate(new Date())
  };
  function reducer(state = initialState, action) {
    switch (action.type) {
      case SET_DATE:
        return Object.assign({}, state, { date: formatDate(action.date) });
      default:
        return state;
    }
  }

  return createStore(reducer);
}

export { returnStore };
