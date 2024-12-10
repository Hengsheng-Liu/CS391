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
  const lastPart = router.pathname.split('/').filter(Boolean).pop();
  const isPublicRoute = lastPart === "login";

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
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      {/* Render CustomHeader only for non-public routes */}
      {!isPublicRoute && <CustomHeader />}
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