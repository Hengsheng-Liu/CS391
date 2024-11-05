import { useEffect, useState } from "react";
import { Input, Button, Typography, Alert, Table, Pagination, Layout, Menu, theme, Divider, Card, Col, Row } from "antd";

const {Title} = Typography;

const { Header, Content, Footer } = Layout;

const items = [{key: 0, label: 'Home'}, 
               {key: 1, label: 'Create an Event'},
               {key: 2, label: 'Profile'}];

export default function Home() {
  return (
    <Layout style={{height:"100vh"}}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={2} style={{color:'grey', alignContent: 'center', padding: '0 12px'}}>Spark! Bytes</Title>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Title level={2}>Current Events</Title>
        <Divider />
        <div>
          <Row gutter={16}>
          <Col span={8}>
            <Card title="Event 1" bordered={true}>
              Event content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Event 2" bordered={false}>
              Event content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Event 3" bordered={false}>
              Event content
            </Card>
          </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Spark! Bytes ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}
