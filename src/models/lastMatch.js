export default {
  namespace: 'lastMatch',
  state: {
    lastMatch: 0,
  },
  reducers: {
    'setLastMatch'(state, action) {
      let newData = Object.assign({}, state);
      newData.lastMatch = action.lastMatch;
      return newData;
    },
  },
};
