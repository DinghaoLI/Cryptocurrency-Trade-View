import React from 'react';
import style from '../styles/Header.scss';
import Logo from "../assets/logo.png";
import { Menu, Dropdown, Icon } from 'antd';
import { connect } from 'dva';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);


const mapStateToProps = state =>({
  lastMatch: state.lastMatch
});

const mapDispatchToProps = dispatch =>({
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: 0,
      volume: 0,
    };
  }

  getHistoryTrades=()=> {
    const url = "//api.gdax.com/products/BTC-USD/stats";
    return fetch(url)
      .then(response => {
        response.json().then(data => {
          this.setState({
            open: Number(data.open),
            volume: Math.floor(Number(data.volume))
          })
        })
      }).catch(e => console.log("error"));
  };


  componentDidMount (){
    this.getHistoryTrades()
  }
  render() {
    const { lastMatch } =this.props;
    const { open, volume } = this.state;
    return (
      <div className={style.header}>
        <img className={style.headerItem} src={Logo} style={{height: '40px', paddingLeft: '10px'}}/>
        <div className={style.headerItem} style={{fontWeight: 800, fontSize: '32px', marginBottom: '-5px'}}>inance</div>
        <div className={style.selectProduct}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div style={{fontSize: '18px', lineHeight: 3}}>BTC/USD <Icon type="down"/>
            </div>
          </Dropdown>
        </div>
        <div className={style.price} style={{fontWeight: 400, fontSize: '18px'}}>{lastMatch.lastMatch.toFixed(2)} USD</div>
        {lastMatch.lastMatch!==0 && open!==0 && lastMatch.lastMatch > open &&<div className={style.price} style={{ color: 'green'}}>+{((lastMatch.lastMatch-open)/open).toFixed(2)}%</div>}
        {lastMatch.lastMatch!==0 && open!==0 && lastMatch.lastMatch < open &&<div className={style.price} style={{ color: 'red'}}>-{((lastMatch.lastMatch-open)/open).toFixed(2)}%</div>}
        {lastMatch.lastMatch!==0 && open!==0 && lastMatch.lastMatch === open &&<div className={style.price} >-</div>}
        <div className={style.price} >{volume} BTC</div>
      </div>
    );
  };
}

Header.propTypes = {
};

export default connect(mapStateToProps,mapDispatchToProps) (Header);
