import React from 'react';
import moment from 'moment'
import style from '../../styles/TradeHistory.scss';
import Sockette  from 'sockette';
import { Icon } from 'antd';
import {SubHeaders} from '../../components';
import { connect } from 'dva';

const setLastMatch =(price)=> {
  return{
    type: 'lastMatch/setLastMatch',
    lastMatch: price
  };
};

const mapStateToProps = state =>({
  lastMatch: state.lastMatch,
});

const mapDispatchToProps = dispatch =>({
  setLastMatch: (price)=> dispatch(setLastMatch(price))
});

class TradeHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      historyTrades: null,
      fullVolume:0
    };
  }

  toUptate=0;
  toCHangeColor=0;
  historyTrades=null;
  ws = new Sockette('wss://ws-feed.gdax.com', {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: () => this.ws.send(JSON.stringify({
        "type": "subscribe",
        "product_ids": [
          "BTC-USD",
        ],
        "channels": ["matches"],
      })
    ),
    onmessage: e => this.newMatch(e),
    onreconnect: e => console.log('Reconnecting...', e),
    onmaximum: e => console.log('Stop Attempting!', e),
    onclose: e => console.log('Closed!', e),
    onerror: e => console.log('Error:', e)
  });

  getHistoryTrades=()=> {
    const url = "//api.gdax.com/products/BTC-USD/trades";
    return fetch(url)
      .then(response => {
        response.json().then(data => {
          this.props.setLastMatch(Number(data[0].price));
            let i;
            data[99].color="green";  //1=green
            for(i=data.length-2;i>=0;i--)
            {
              if(Number(data[i].price) > Number(data[i+1].price))
                data[i].color = "green";
              if(Number(data[i].price) === Number(data[i+1].price))
                data[i].color = data[i+1].color;
              if(Number(data[i].price) < Number(data[i+1].price))
                data[i].color = "red";
            }
            this.historyTrades=data;
            let sum=0;
            for(i=0;i<100;i++)
            {
             sum+=Number(data[i].size)
            }
            this.setState({
              historyTrades: data,
              fullVolume: sum/100
            });
          }
        )
      }).catch(e => console.log("error"));
  };


  newMatch = (e) => {
    const data =  JSON.parse(e.data)
    if(data.type === "match") {
      this.props.setLastMatch(Number(data.price));
      this.toUptate++;
      let lastPrice = Number(this.historyTrades[0].price).toFixed(2);
      let lastColor = this.historyTrades[0].color;
      if (Number(data.price).toFixed(2) > lastPrice) {
        data.color = "green";
      }
      if (Number(data.price).toFixed(2) < lastPrice) {
        data.color = "red";
      }
      if (Number(data.price).toFixed(2) === lastPrice) {
        data.color = lastColor;
      }
      data.isNew = true;
      this.historyTrades.unshift(data);
    }
  };

  update=()=>{
    if(this.toUptate>0)
    {
      this.toCHangeColor=this.toUptate;
      this.historyTrades=this.historyTrades.slice(0, 100);
      let i, sum=0;
      for(i=0;i<100;i++)
      {
        sum+=Number(this.historyTrades[i].size)
      }
      this.setState({
        historyTrades: this.historyTrades,
        fullVolume: sum/100
      });
      this.toUptate=0
    }
  };

  animateTrade = (index,color)=> {
    if(index<this.toCHangeColor)
    {
      if(this.refs.tradeRow){
        if(color==="green")
          document.getElementById("tradeRow"+index).style.backgroundColor="rgba(0,255,0,0.2)";
        else
          document.getElementById("tradeRow"+index).style.backgroundColor="rgba(255,0,0,0.2)";
        setTimeout(()=>{document.getElementById("tradeRow"+index).style.backgroundColor="white"},300)
      }
    }
  };

  componentDidMount(){
    this.getHistoryTrades();
    this.timer = setInterval(
      () => { this.update() },
      1000
    );
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }



  render() {
    const { historyTrades,fullVolume } = this.state;
    const { animateTrade } = this;
    return (
      <div className={style.tradeHistory}>
        <SubHeaders title="TRADE HISTORY"/>
        <div  className={style.tradeRow} style={{borderBottom: '1px solid #ececec', fontWeight: 700}}>
          <div className={style.tradeVolume}>&nbsp;</div>
          <div className={style.tradeSize}> Trade size </div>
          <div className={style.tradePrice}> Price(USD) </div>
          <div className={style.tradeTime}> Time </div>
        </div>
        <div className={style.historyTable}>
        {historyTrades &&historyTrades.map((trade, index)=>{
          // animateTrade(index,trade.color);
          let date = new Date(trade.time);
          return <div key={index} ref={"tradeRow"} id={"tradeRow"+index} className={style.tradeRow}>
            <div className={style.tradeVolume}>
              <div style={{backgroundColor: trade.color,
                borderLeft: '1px solid '+trade.color,
                opacity: '0.7',
                width: Number(trade.size)/fullVolume> 100 ? 100+'%' : Number(trade.size)/fullVolume+'%'}}>&nbsp;</div>
            </div>
            <div className={style.tradeSize}> {trade.size} </div>
            <div className={style.tradePrice} style={{color: trade.color}}> {Number(trade.price).toFixed(2)}
              {trade.color==="green"?<Icon type="arrow-up"/>:<Icon type="arrow-down"/>} </div>
            <div className={style.tradeTime} style={{color: 'darkgray'}}> {moment(date).format('HH:mm:ss')}</div>
          </div>})
        }
        </div>
      </div>
    );
  };
}

TradeHistory.propTypes = {
};

export default connect(mapStateToProps,mapDispatchToProps) (TradeHistory);
