export default {
  namespace: 'orderBook',
  state: {
    orderBook: null,
    minAsk: 0,
    maxBid: 0,
    bids: null,
    asks: null,
  },
  reducers: {
    'setOrderBook'(state, action) {
      let newData = Object.assign({}, state);
      newData.orderBook = action.orderBook;
      newData.minAsk = action.minAsk;
      newData.maxBid = action.maxBid;
      newData.bids = action.bids;
      newData.asks = action.asks;
      return newData;
    },
  },
};
