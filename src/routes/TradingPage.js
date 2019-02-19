import React from 'react';
import { connect } from 'dva';


const TradingPage = ({ dispatch }) => {

  return (
    <div>
    </div>
  );
};

// export default Products;
export default connect(({ trading }) => ({
  trading,
}))(TradingPage);
