import React from 'react';
import { Row, Col } from 'antd';
import style from '../../styles/SubHeaders.scss';
import styleForm from '../../styles/OrdersFills.scss';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class OrderFills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: "Orders"
    }
  }


  changeForm = () => {
    if (this.state.form === "Orders") {
      this.setState({
        form: "Fills"
      })
    } else {
      this.setState({
        form: "Orders"
      })
    }
  };

  render() {
    const { changeForm } = this;
    const { form } = this.state;
    return (
      <div className={styleForm.orderFills}>
        <div className={style.subHeaders2}>
          <div className={style.title}>{form === "Orders" ? "OPEN ORDERS" : "FILLS"}</div>
          <Tabs defaultActiveKey="1" style={{marginBottom: '-14px', paddingRight: '20px'}} onChange={changeForm}>
            <TabPane tab="Orders" key="1"/>
            <TabPane tab="Fills" key="2"/>
          </Tabs>
        </div>
        {form==='Orders' &&
        <div style={{height: '100%'}}>
          <Row style={{borderBottom: "1px grey solid"}}>
            <Col span={4} style={{textAlign: 'center'}}>Size</Col>
            <Col span={4} style={{textAlign: 'center'}}>Filled(BTC)</Col>
            <Col span={4} style={{textAlign: 'center'}}>Price(USD)</Col>
            <Col span={4} style={{textAlign: 'center'}}>Fee(USD)</Col>
            <Col span={4} style={{textAlign: 'center'}}>Time</Col>
            <Col span={4} style={{textAlign: 'center'}}>Status</Col>
          </Row>
          <div className={styleForm.form}>
            <div className={styleForm.formItem}>You have no BTC/USD orders</div>
          </div>
        </div>
        }
        {form!=='Orders' &&
        <div style={{height: '100%'}}>
          <Row style={{borderBottom: "1px grey solid"}}>
            <Col span={2} style={{textAlign: 'center'}}/>
            <Col span={4} style={{textAlign: 'center'}}>Size(BTC)</Col>
            <Col span={4} style={{textAlign: 'center'}}>Price(USD)</Col>
            <Col span={4} style={{textAlign: 'center'}}>Fee(USD)</Col>
            <Col span={4} style={{textAlign: 'center'}}>Time</Col>
            <Col span={4} style={{textAlign: 'center'}}>Product</Col>
            <Col span={2} style={{textAlign: 'center'}}/>
          </Row>
          <div className={styleForm.form}>
            <div className={styleForm.formItem}>You have no BTC/USD fills</div>
          </div>
        </div>}
      </div>
    );
  }
}

OrderFills.propTypes = {
};

export default OrderFills;
