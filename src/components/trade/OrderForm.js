import React from 'react';
import style from '../../styles/OrderForm.scss';
import SubHeaders from '../SubHeaders';
import Balance from '../tradeComponents/Balance';
import LimitMarkrtOrder from "../tradeComponents/LimitMarketOrder";


const OrderForm = () => {
  return (
    <div className={style.orderForm}>
      <SubHeaders title="ORDER FORM"/>
      <Balance/>
      <LimitMarkrtOrder/>
    </div>
  );
};

OrderForm.propTypes = {
};

export default OrderForm;
