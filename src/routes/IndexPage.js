import React from 'react';
import { Layout } from  'antd';
import { connect } from 'dva';
import {Charts, OrderBookWrapper, OrderForm, OrderFills, Header, TradeHistory} from '../components';

function IndexPage() {
  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Header style={{padding: 0, backgroundColor: 'white' }}><Header /></Layout.Header>
      <Layout>
        <Layout.Sider  width='270'><OrderForm /></Layout.Sider>
        <Layout>
          <Layout.Sider width= '330' ><OrderBookWrapper/></Layout.Sider>
          <Layout.Content><Charts/><OrderFills/></Layout.Content>
          <Layout.Sider width='330'><TradeHistory /></Layout.Sider>
        </Layout>
      </Layout>
    </Layout>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
