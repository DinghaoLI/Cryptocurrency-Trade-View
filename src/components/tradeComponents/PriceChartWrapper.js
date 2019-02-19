import React, { Component } from 'react';
import style from '../../styles/PriceChart.scss'
import PriceChart from './PriceChart'
import { Menu, Dropdown, Icon, Button, Spin } from 'antd';

function getGdaxCandles(granularity) {
  let date = new Date();
  date.setMinutes(date.getMinutes());
  const end = date.toISOString();
  date.setMinutes(date.getMinutes()-(granularity*1.5));
  const start = date.toISOString();
  const url = "//api.gdax.com/products/BTC-USD/candles?start="+start+"&end="+end+"&granularity="+granularity;
  const promiseCandle = fetch(url)
    .then(response => response.json());
  return promiseCandle;
}

function mappingGdax(x) {
  return {
    date: new Date(x[0]*1000),
    low:  x[1],
    high: x[2],
    open: x[3],
    close:x[4],
    volume:x[5],
    split: "",
    dividend: "",
    absoluteChange: undefined,
    percentChange: undefined

  }
}

function compareDate(a,b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}


class PriceChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: null,
      candlesOrder: null,
      timeRange: '1m',
      timeRangeDropdownVisible: false,
      granularity: 60,
      timer: null,
      ema12Visible: true,
      ema26Visible: true,
      emaDropdownVisible: false,
    };
  }

  getData = () => {
    getGdaxCandles(this.state.granularity).then(data =>{
      const candles = data.map(mappingGdax);
      const candlesOrder  = candles.sort(compareDate);
      const loaded = true;
      this.setState({
        candlesOrder: candlesOrder,
        loaded: loaded
      });
    })
  }


//{1m->60, 5m->300, 15m->900, 1h->3600, 6h->21600, 1d->86400}
  setTimeRange = (e) => {
    //message.info(`Click on item ${e.key}`);
    let granularity;
    switch(e.key) {
      case "1m":
        granularity = 60;
        break;
      case "5m":
        granularity = 300;
        break;
      case "15m":
        granularity = 900;
        break;
      case "1h":
        granularity = 3600;
        break;
      case "6h":
        granularity = 21600;
        break;
      case "1d":
        granularity = 86400;
        break;
      default:
    }
    this.setState({
      timeRange: e.key,
      granularity: granularity,
      loaded: null
    });
    getGdaxCandles(granularity).then(data =>{
      const candles = data.map(mappingGdax);
      const candlesOrder  = candles.sort(compareDate);
      const loaded = true;
      this.setState({
        candlesOrder: candlesOrder,
        loaded: loaded
      });
    })
  };

  setOverlay = (e) => {
    if(e.key === "ema12")
      this.setState({
        ema12Visible: !this.state.ema12Visible
      });
    else
      this.setState({
        ema26Visible: !this.state.ema26Visible
      });
  }
  dropDownTimeRange = () => (
    <Menu onClick={this.setTimeRange}>
      <Menu.Item key="1m">1m</Menu.Item>
      <Menu.Item key="5m">5m</Menu.Item>
      <Menu.Item key="15m">15m</Menu.Item>
      <Menu.Item key="1h">1h</Menu.Item>
      <Menu.Item key="6h">6h</Menu.Item>
      <Menu.Item key="1d">1d</Menu.Item>
    </Menu>
  );

  dropDownOverlay = () => (
    <Menu onClick={this.setOverlay}>
      <Menu.Item key="ema12">EMA12</Menu.Item>
      <Menu.Item key="ema26">EMA26</Menu.Item>
    </Menu>
  );

  emaVisibleChange = (flag) => {
    this.setState({ emaDropdownVisible: flag });
  }

  timeRangeVisibleChange = (flag) => {
    this.setState({ timeRangeDropdownVisible: flag });
  }

  componentDidMount() {
    this.getData();
    const timer = setInterval(this.getData, 30*1000);
    this.setState({
      timer: timer,
    });
  }

  componentDidUpdate() {
    // console.log(this.state.ema12Visible);
    // console.log(this.state.ema26Visible);

  }

  render() {
    if (this.state.loaded == null) {
      return (
        <div>
          <Dropdown overlay={this.dropDownTimeRange()} visible={this.state.timeRangeDropdownVisible} onVisibleChange={this.timeRangeVisibleChange}>
            {/*<a className="ant-dropdown-link" href="#">*/}
            {/*{this.state.timeRange} <Icon type="down" />*/}
            {/*</a>*/}
            <Button>
              {this.state.timeRange} <Icon type="down" />
            </Button>
          </Dropdown>
          <Dropdown overlay={this.dropDownOverlay()} visible={this.state.emaDropdownVisible} onVisibleChange={this.emaVisibleChange}>
            <Button>
              Overlay <Icon type="down" />
            </Button>
          </Dropdown>
          <div className={style.loadingChart}>
            <Spin size="large" />
          </div>
      </div>
      )
    }
    return (
      <div>
        <Dropdown overlay={this.dropDownTimeRange()} visible={this.state.timeRangeDropdownVisible} onVisibleChange={this.timeRangeVisibleChange}>
          {/*<a className="ant-dropdown-link" href="#">*/}
            {/*{this.state.timeRange} <Icon type="down" />*/}
          {/*</a>*/}
          <Button>
            {this.state.timeRange} <Icon type="down" />
          </Button>
        </Dropdown>
        <Dropdown overlay={this.dropDownOverlay()} visible={this.state.emaDropdownVisible} onVisibleChange={this.emaVisibleChange}>
          <Button>
            Overlay <Icon type="down" />
          </Button>
        </Dropdown>
        <PriceChart
          type="hybrid"
          data={this.state.candlesOrder}
          timeRange={this.state.timeRange}
          ema12Visible={this.state.ema12Visible}
          ema26Visible={this.state.ema26Visible}
        />
      </div>
    )
  }
}

export default PriceChartWrapper
