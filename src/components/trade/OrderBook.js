import React from 'react';
import style from '../../styles/OrderBook.scss';

class OrderBook extends React.Component  {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const node = this.refs.orderTable;
    node.scrollTop = node.scrollHeight*0.38;
  }
  componentWillUpdate() {

  }

  render() {
    return (
      <div className={style.orderBook}>

        <table style={{width:"100%", height:"25px"}} >
          <tbody>
          <tr style={{width:"100%"}}>
            <th  className={style.marketSizeView}>

            </th>
            <th  className={style.marketSize}>
              Market size
            </th>
            <th  className={style.price}>
              Price(USD)
            </th>
            <th  className={style.mySizeTitle}>
              My size
            </th>
          </tr>
          </tbody>
        </table>
        <div className={style.orderTable} ref="orderTable">
          <table style={{width:"100%"}} border="0" cellSpacing="0" cellPadding="0">
            <tbody>
              {this.props.asks.reverse().map((item, index) =>
                <tr key={index}>
                  <td  className={style.marketSizeView} >
                    <div style={{
                      backgroundColor: "red",
                      borderLeft: "1px solid red",
                      width: item.size/this.props.asksMaxSize*100 +'%',
                      opacity: "0.7"}}> &nbsp;
                    </div>
                  </td>
                  <td  className={style.marketSize}>
                    {item.size.toFixed(8)}
                  </td>
                  <td  className={style.priceAsks}>
                    {item.price.toFixed(2)}
                  </td>
                  <td  className={style.mySize}>
                  <span style={{marginRight:"20px", TextAlign:"left"}}>-</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className={style.usdSpread}>
                <span style={{marginLeft: "30px"}}>USD SPREAD</span>
          </div>

          <table style={{width:"100%"}} border="0" cellSpacing="0" cellPadding="0" >
            <tbody>
            {this.props.bids.reverse().map((item, index) =>
              <tr key={index}>
                <td  className={style.marketSizeView} >
                  <div style={{
                    backgroundColor: "green",
                    borderLeft: "1px solid green",
                    width: item.size/this.props.bidsMaxSize*100 +'%',
                    opacity: "0.7"}}
                     > &nbsp;
                  </div>
                </td>
                <td  className={style.marketSize}>
                  {item.size.toFixed(8)}
                </td>
                <td  className={style.priceBids}>
                  {item.price.toFixed(2)}
                </td>
                <td  className={style.mySize}>
                  <span style={{marginRight:"20px", TextAlign:"left"}}>-</span>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default OrderBook;

