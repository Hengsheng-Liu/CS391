"use client";
import React, { useEffect } from "react";
import { Layout, Spin } from "antd";
import CustomHeader from "../components/header";
import { useAuth } from "@/contexts/UserContext";
import { useRouter } from "next/router";
const { Content, Footer } = Layout;

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  // Access user data and logout function from auth context
  const { user, loading } = useAuth();
  const router = useRouter();
  const isPublicRoute = router.pathname === "/login";

  // Force unauthenticated users to login page
  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, loading, isPublicRoute]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!loading && !user && !isPublicRoute) {
    return null;
  }

  // Layout structure
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CustomHeader />
      <Content style={{ padding: "24px", background: "#fff" }}>
        <div style={{ padding: 24, minHeight: 380 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        Spark!Bytes ©{new Date().getFullYear()} Created by Spark!
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;