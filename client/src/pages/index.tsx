import { useEffect, useState } from "react";
import { Input, Button, Typography, Alert, Table, Pagination, Layout, Menu, theme } from "antd";

const { Header, Content, Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

export default function Home() {
  return (
    <Layout style={{height:"100vh"}}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div>
          Content
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Spark! Bytes ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}
