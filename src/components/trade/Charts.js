import React from 'react';
import DepthChartWrapper from '../tradeComponents/DepthChartWrapper';
import PriceChartWrapper from '../tradeComponents/PriceChartWrapper';
import style from '../../styles/SubHeaders.scss';
import { Tabs } from 'antd';


const TabPane = Tabs.TabPane;

class Charts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chart: "PRICE CHART"
    }
  }


  changeChart=()=>{
    if(this.state.chart==="PRICE CHART")
    {
      this.setState({
        chart: "DEPTH CHART"
      })
    } else {
      this.setState({
        chart: "PRICE CHART"
      })
    }
  };

  render() {
    const {changeChart} = this;
    const { chart } = this.state
    return (
      <div style={{height: '50%'}}>
        <div className={style.subHeaders2}>
          <div className={style.title}>{chart}</div>
          <Tabs defaultActiveKey="1" style={{marginBottom: '-14px', paddingRight: '20px'}} onChange={changeChart}>
            <TabPane tab="Price chart" key="1" />
            <TabPane tab="Depth chart" key="2" />
          </Tabs>
        </div>
        <DepthChartWrapper isDepthChart={chart === "DEPTH CHART"}/>
        {chart === "PRICE CHART" &&<PriceChartWrapper/>}
      </div>
    )
  }
}

export default Charts;
