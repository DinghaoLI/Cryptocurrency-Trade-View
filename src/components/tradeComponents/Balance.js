import React from 'react';
import style from '../../styles/OrderForm.scss';
import PropTypes from "prop-types";
import { Button, Icon } from 'antd';

class Balance extends React.Component {
  render () {
    return (
      <div className={style.border}>
        <div className={style.container}>
          <div className={style.header}>BALANCE</div>
          <div className={style.row}>
            <div>USD</div>
            <div>0.00</div>
          </div>
          <div className={style.row}>
            <div>BTC</div>
            <div>0.000000</div>
          </div>
          <div className={style.row} style={{padding: '20px 0'}}>
            <Button size="small" ><Icon type="download"/>DEPOSIT</Button>
            <Button size="small" ><Icon type="upload"/>WITHDRAW</Button>
          </div>
        </div>
      </div>
    );
  }
}

Balance.propTypes = {
};

Balance.defaultProps = {
};

export default Balance;
