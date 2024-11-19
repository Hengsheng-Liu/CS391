"use client";
import React, { use, useEffect } from "react";
import { Layout } from "antd";
import CustomHeader from "../components/header";
import { useAuth } from "@/contexts/UserContext";
import {useRouter } from "next/router";
const { Content, Footer } = Layout;

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const lastPart = router.pathname.split('/').filter(Boolean).pop();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      {lastPart !== "login" && <CustomHeader />}
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div
          className="site-layout-content"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Spark!Bytes ©{new Date().getFullYear()} Created by Spark!
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;