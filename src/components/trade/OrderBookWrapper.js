import React from 'react';
import OrderBook from './OrderBook';
import { connect } from 'dva';
import style from '../../styles/OrderBook.scss';
import { Button } from 'antd';
import SubHeaders from '../SubHeaders';



const mapStateToProps = state =>({
  orderBook: state.orderBook
});


const aggregationList = [0.01, 0.05, 0.10, 0.50, 1.00, 2.50, 5.00, 10.00];

class OrderBookWrapper extends React.Component  {



  constructor(props) {
    super(props);
    this.state = {
      aggregation: 0.01
    }
  };

  aggregationPlus = () => {
    let index = aggregationList.indexOf(this.state.aggregation);
    if (index < aggregationList.length - 1) {
      this.setState({
        aggregation: aggregationList[index+1],
      });
    }
  };

  aggregationMinus = () => {
    let index = aggregationList.indexOf(this.state.aggregation);
    if (index > 0) {
      this.setState({
        aggregation: aggregationList[index-1],
      });
    }
  };

  render() {

      let asks = [];
      let bids = [];
      let MaxAsks = 0;
      let MaxBids = 0;

      if(this.props.orderBook.asks !== null && this.props.orderBook.bids !== null){
        //console.log(this.props.orderBook.bids);
        const aggregation = this.state.aggregation;

        if(aggregation === 0.01){
          asks = this.props.orderBook.asks.slice(0, 50);
          bids = this.props.orderBook.bids.slice(-50);
        }else{
          const originAsks = this.props.orderBook.asks;
          const originBids = this.props.orderBook.bids;
          asks = [];
          bids = [];
          let divide = 0;
          let modulo = 0;
          let count = originBids.length - 1;
          let price = 0;
          let aggregationCount = 0;

          while((bids.length < 50)&&(count > 0)){

            if(aggregationCount > 0 && (Math.abs(originBids[count].price - bids[aggregationCount-1].price) < aggregation)){
              bids[aggregationCount-1].size += originBids[count].size;
              count--;
            }else{
              divide = Math.floor(originBids[count].price / aggregation);
              modulo = (divide * aggregation) === originBids[count].price ? true : false;

              // console.log(divide);
              // console.log(modulo);
              if(modulo === true)
                price = originBids[count].price;
              else
                price = divide * aggregation;

              //console.log(price);
              let obj = {
                price: price,
                size: originBids[count].size,
              }
              count--;
              aggregationCount++;
              bids.push(obj);
            }
          }
          bids = bids.reverse();

          divide = 0;
          modulo = 0;
          count = 0;
          price = 0;
          aggregationCount = 0;

          while((asks.length < 50)&&(count < originAsks.length)){

            if(aggregationCount > 0 && (Math.abs(originAsks[count].price - asks[aggregationCount-1].price) < aggregation)){
              asks[aggregationCount-1].size += originAsks[count].size;
              count++;
            }else{
              // console.log(asks[aggregationCount].price);
              divide = Math.floor(originAsks[count].price / aggregation);
              modulo = (divide * aggregation) === originAsks[count].price ? true : false;

              console.log(divide);
              console.log(modulo);
              if(modulo === true)
                price = originAsks[count].price;
              else
                price = (divide + 1) * aggregation;

              console.log(price);
              let obj = {
                price: price,
                size: originAsks[count].size,
              }
              count++;
              aggregationCount++;
              asks.push(obj);
            }
          }

        }

        // console.log(bids);
        MaxAsks = asks.reduce(function(prev, current) {
          return (prev.size > current.size) ? prev : current
        })


        MaxBids = bids.reduce(function(prev, current) {
          return (prev.size > current.size) ? prev : current
        })
      }


    if(this.props.orderBook.asks !== null && this.props.orderBook.bids !== null)
    return (
      <div className={style.orderBookWrapper}>
        <SubHeaders title="ORDER BOOK"/>
        {this.props.orderBook.asks !== null && this.props.orderBook.bids !== null &&
          <OrderBook asks={asks} bids={bids} asksMaxSize={MaxAsks.size} bidsMaxSize={MaxBids.size} />
        }
        <div style={{height: "25px"}}>
          <span style={{marginRight:"10px"}}>AGGREGATION</span>
          <Button  shape="circle" icon="plus" size="small" onClick={this.aggregationPlus} />
          <span style={{margin:"0px 10px 0px 10px"}} >{this.state.aggregation}</span>
          <Button  shape="circle" icon="minus" size="small" onClick={this.aggregationMinus} />
        </div>
      </div>
    )
    else return(
      <div className={style.orderBookWrapper}>
        <SubHeaders title="ORDER BOOK"/>
      </div>
    )
  }
}

export default connect(mapStateToProps) (OrderBookWrapper);
