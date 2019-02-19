import React from 'react';
import PropTypes from "prop-types";
import { DepthChart } from '../../components';
import { connect } from 'dva';
import Sockette  from 'sockette';
import style from '../../styles/DpethChartWrapper.scss';
import { Button } from 'antd';

const setOrderBook =(data,min,max, bids, asks)=> {
  return{
    type: 'orderBook/setOrderBook',
    orderBook: data,
    minAsk: min,
    maxBid: max,
    bids: bids,
    asks: asks
  };
};

const mapStateToProps = state =>({
  orderBook: state.orderBook
});

const mapDispatchToProps = dispatch =>({
  setOrderBook: (data, min, max, bids, asks)=> dispatch(setOrderBook(data, min, max, bids, asks)),
});

  class DepthChartWrapper extends React.Component  {

  bids= null;
  asks= null;

  constructor(props) {
    super(props);
    this.state = {
      dataPercentage: 5,
      discrete: 15,
    };
  }

  ws = new Sockette('wss://ws-feed.gdax.com', {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: () => this.ws.send(JSON.stringify({
        "type": "subscribe",
        "product_ids": [
          "BTC-USD",
        ],
        "channels": ["level2"],
      })
    ),
    onmessage: e => this.orderBookData(e),
    onreconnect: e => console.log('Reconnecting...', e),
    onmaximum: e => console.log('Stop Attempting!', e),
    onclose: e => console.log('Closed!', e),
    onerror: e => console.log('Error:', e)
  });

  processData = (list, type, desc, res) =>{
    let i,dp;
    if (desc) {
      for ( i = list.length - 1; i >= 0; i--) {
        if (i < (list.length - 1)) {
          list[i].totalvolume = list[i + 1].totalvolume + list[i].size;
        }
        else {
          list[i].totalvolume = list[i].size;
        }
        dp = {};
        dp["price"] = list[i].price;
        dp[type + "size"] = list[i].size;
        dp[type + "totalvolume"] = list[i].totalvolume;
        res.unshift(dp);
      }
    }
    else {
      for ( i = 0; i < list.length; i++) {
        if (i > 0) {
          list[i].totalvolume = list[i - 1].totalvolume + list[i].size;
        }
        else {
          list[i].totalvolume = list[i].size;
        }
        dp = {};
        dp["price"] = list[i].price;
        dp[type + "size"] = list[i].size;
        dp[type + "totalvolume"] = list[i].totalvolume;
        res.push(dp);
      }
    }
  };

  updateData = () => {
    let updatedData = [];
    this.asks.sort(function (a, b) {
      if (a.price > b.price) {
        return 1;
      }
      else if (a.price < b.price) {
        return -1;
      }
      else {
        return 0;
      }
    });
    this.bids.sort(function (a, b) {
      if (a.price > b.price) {
        return 1;
      }
      else if (a.price < b.price) {
        return -1;
      }
      else {
        return 0;
      }
    });
    this.bids&&this.processData(this.bids, "bids", true, updatedData);
    this.asks&&this.processData(this.asks, "asks", false, updatedData);
    this.props.setOrderBook(updatedData,this.asks[0].price,this.bids[this.bids.length-1].price, this.bids, this.asks);
  };

  orderBookData = (e) => {
    let {processData} = this;
    const data = JSON.parse(e.data);
    let formalisedData=[];
    if(data.type ==="snapshot")
    {
      this.bids =data.bids.map(x => {return {price: Number(x[0]), size: Number(x[1])}}).sort(function (a, b) {
      if (a.price > b.price) {
        return 1;
      }
      else if (a.price < b.price) {
        return -1;
      }
      else {
        return 0;
      }
    });
      this.asks = data.asks.map(x => {return {price: Number(x[0]), size: Number(x[1])}}).sort(function (a, b) {
        if (a.price > b.price) {
          return 1;
        }
        else if (a.price < b.price) {
          return -1;
        }
        else {
          return 0;
        }
      });
      processData(this.bids, "bids", true, formalisedData);
      processData(this.asks, "asks", false, formalisedData);
      this.props.setOrderBook(formalisedData,Number(data.asks[0][0]),Number(data.bids[0][0]), this.bids, this.asks);
    }
    if(this.refs.chart && data.type ==="l2update" )
    {
      let isUpdate = false;
      let i;
      if(data.changes[0][0] === "buy"){
        let formalisedBid = {price: Number(data.changes[0][1]), size: Number(data.changes[0][2])}
        for(i=this.bids.length-1; i>0; i--) {
          if (this.bids[i].price.toFixed(10) === formalisedBid.price.toFixed(10))
          {
            isUpdate = true;
            if(formalisedBid.size === 0)
            {
              this.bids.splice(i,1);
            }
            else {
              this.bids[i].size = formalisedBid.size;
            }
            break;
          }
        }
        if(!isUpdate){
          this.bids.push(formalisedBid);
        }
      }
      if(data.changes[0][0] === "sell"){
        let formalisedAsk = {price: Number(data.changes[0][1]), size: Number(data.changes[0][2])}
        for(i = 0; i<this.asks.length; i++) {
          if (this.asks[i].price.toFixed(10) === formalisedAsk.price.toFixed(10))
          {
            isUpdate = true;
            if(formalisedAsk.size === 0)
            {
             this.asks.splice(i,1);
            }
            else {
              this.asks[i].size = formalisedAsk.size;
            }
            break;
          }
        }
        if(!isUpdate){
          this.asks.push(formalisedAsk)
        }
      }
    }
  };

  addData = () => {
    let percentageSet = [0.5,1,2.5,5,10,25,50,75];
    let discreteSet = [1,5,10,15,20,25,30,35];
    let index = percentageSet.indexOf(this.state.dataPercentage);
    if (index<percentageSet.length-1) {
      this.setState({
        dataPercentage: percentageSet[index+1],
        discrete: discreteSet[index+1],
      })
    }
  };

  reduceData = () => {
    let percentageSet = [0.5,1,2.5,5,10,25,50,75];
    let discreteSet = [1,5,10,15,20,25,30,35];
    let index = percentageSet.indexOf(this.state.dataPercentage);
    if (index>0) {
      this.setState({
        dataPercentage: percentageSet[index-1],
        discrete: discreteSet[index-1],
      })
    }
  };

  componentDidMount() {
    this.timer = setInterval(
      () => { this.bids && this.asks && this.updateData() },
      500
    );
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  render() {
    const { dataPercentage, discrete} = this.state;
    const {orderBook, isDepthChart} =this.props;
    const {addData, reduceData} = this;
    let data=orderBook.orderBook;
    let minAsk = orderBook.minAsk;
    let maxBid = orderBook.maxBid;
    let myData = null;
    let currentPrice=0;
    if(data !== null)
      currentPrice = (maxBid+minAsk)/2
    if (data !== null) {
      myData = data.slice().filter((x, index) => {
        return index % discrete === 0;
      })
    }
    let xExtend = [currentPrice * (1 - dataPercentage * 0.01), currentPrice * (1 + dataPercentage * 0.01)];
    if (isDepthChart &&(myData === null || xExtend[1] ===0)) {
      return <div>Loading...</div>
    }
    else {
      return (
        <div ref="chart" id = "chart">
          {isDepthChart&&<div className={style.zoomBar}>
            {dataPercentage < 75 ? <Button shape="circle" icon="plus" onClick={addData}/> :
              <Button shape="circle" icon="plus" disabled onClick={addData}/>}
            <div className={style.currentPrice}>{currentPrice.toFixed(3)}</div>
            {dataPercentage > 0.5 ? <Button shape="circle" icon="minus" onClick={reduceData}/> :
              <Button shape="circle" icon="minus" disabled onClick={reduceData}/>}
          </div>}
          {isDepthChart&&<DepthChart type="svg" data={myData} xExtend={xExtend}  />}
        </div>
      )
    }
  }

}
DepthChartWrapper.propTypes = {
  isDepthChart: PropTypes.bool.isRequired
};

DepthChartWrapper.defaultProps = {
  isDepthChart: false
};


export default connect(mapStateToProps,mapDispatchToProps) (DepthChartWrapper);
