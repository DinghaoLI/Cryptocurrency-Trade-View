import React from 'react';
import style from '../../styles/OrderForm.scss';
import PropTypes from "prop-types";
import { connect } from 'dva';
import { Button, Icon, Tabs, Radio, Input } from 'antd';


const mapStateToProps = state =>({
  orderBook: state.orderBook
});

const mapDispatchToProps = dispatch =>({
});

class LimitMarketOrder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isMarketBuy: true,
      isLimitBuy: true,
      marketRadioValue: 'buy',
      limitRadioValue: 'buy',
      marketAmount: 0,
      limitPrice: 0,
      limitAmount: 0,
    }
  }

  buyOrSell = () =>{
    if(this.state.isMarketBuy) {
      this.setState({
        isMarketBuy: false,
        marketRadioValue: 'sell'
      })
    }
    else {
      this.setState({
        isMarketBuy: true,
        marketRadioValue: 'buy'
      })
    }
  };

  limitBuyOrSell = () =>{
    if(this.state.isLimitBuy) {
      this.setState({
        isLimitBuy: false,
        limitRadioValue: 'sell'
      })
    }
    else {
      this.setState({
        isLimitBuy: true,
        limitRadioValue: 'buy'
      })
    }
  };

  marketAmountChange=(e)=>{
    this.setState({
      marketAmount: Number(e.target.value)
    })
  };
  limitAmountChange=(e)=>{
    this.setState({
      limitAmount: Number(e.target.value)
    })
  }
  limitPriceChange=(e)=>{
    this.setState({
      limitPrice: Number(e.target.value)
    })
  }

  render () {
    const TabPane = Tabs.TabPane;
    const { buyOrSell, marketAmountChange, limitAmountChange, limitPriceChange, limitBuyOrSell} = this;
    const { isMarketBuy,marketRadioValue, marketAmount, limitRadioValue, isLimitBuy,limitPrice, limitAmount } = this.state;
    const { orderBook } = this.props;
    let price=(orderBook.minAsk+orderBook.maxBid)/2;
    return (
      <div className={style.border}>
        <div className={style.container}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="MARKET" key="1">
              <Radio.Group  style={{ marginBottom: 0, width: '100%'}} onChange={buyOrSell} value={marketRadioValue}>
                <Radio.Button value="buy" style={{ width: '50%', textAlign: 'center'}} >BUY</Radio.Button>
                <Radio.Button value="sell" style={{  width: '50%',textAlign: 'center'}}>SELL</Radio.Button>
              </Radio.Group>

              <div style={{padding: "20px 0", borderBottom: "1px solid #c7c5c5"}}>
                <div style={{paddingBottom:'5px'}}>Amount</div>
                <Input addonAfter={isMarketBuy?"USD":"BTC"} placeholder="0.00" type="number" onChange={marketAmountChange} />
              </div>

              <div className={style.row}>
                <div>Fee(USD) ≈</div>
                {isMarketBuy? <div>${(marketAmount*0.003).toFixed(2)}</div> : <div>${(marketAmount*price*0.003).toFixed(2)}</div>}
              </div>
              <div className={style.row}>
                <div>Total({isMarketBuy ? 'BTC' : 'USD' }) ≈</div>
                {isMarketBuy? <div>Ƀ{price===0? '0.000000' : (marketAmount/price).toFixed(6)}</div> :  <div>${price===0? '0.00' : (marketAmount*price).toFixed(2)}</div>}
              </div>
              <Button type="primary" style={{width: '100%', margin: '20px 0'}}>{isMarketBuy ? 'PLACE BUY ORDER' : 'PLACE SELL ORDER'}</Button>
            </TabPane>

            <TabPane tab="LIMIT" key="2">
              <Radio.Group  style={{ marginBottom: 0, width: '100%'}} onChange={limitBuyOrSell} value={limitRadioValue}>
                <Radio.Button value="buy" style={{ width: '50%', textAlign: 'center'}} >BUY</Radio.Button>
                <Radio.Button value="sell" style={{  width: '50%',textAlign: 'center'}}>SELL</Radio.Button>
              </Radio.Group>

              <div style={{paddingTop: "20px"}}>
                <div style={{paddingBottom:'5px'}}>Amount</div>
                <Input addonAfter="BTC" placeholder="0.00" type="number" onChange={limitAmountChange} />
              </div>
              <div style={{padding: "20px 0", borderBottom: "1px solid #c7c5c5"}}>
                <div style={{paddingBottom:'5px'}}>Limit Price</div>
                <Input addonAfter="USD" placeholder="0.00" type="number" onChange={limitPriceChange} />
              </div>

              <div className={style.row}>
                <div>Fee(USD) ≈</div>
                <div>${(limitPrice*limitAmount*0.003).toFixed(2)}</div>
              </div>
              <div className={style.row}>
                <div>Total(USD) ≈</div>
                <div>${(limitPrice*limitAmount).toFixed(2)}</div>
              </div>
              <Button type="primary" style={{width: '100%', margin: '20px 0'}}>{isLimitBuy ? 'PLACE BUY ORDER' : 'PLACE SELL ORDER'}</Button>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

LimitMarketOrder.propTypes = {
};

LimitMarketOrder.defaultProps = {
};

export default connect(mapStateToProps,mapDispatchToProps) (LimitMarketOrder);
