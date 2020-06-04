const initialState = {
  data: [],
  loading: true,
};

export const Reducer = (state = initialState, action) => {
  if (action.type === "ADD_DATA") {
    return {
      ...state,
      data: action.payload,
    };
  } else if (action.type === "SET_LOADING") {
    return {
      ...state,
      loading: action.payload,
    };
  }
  return state;
};
