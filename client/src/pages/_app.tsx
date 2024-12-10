import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";

import theme from "@/theme/themeConfig";
import LayoutComponent from "@/layout/layout";
import { AuthProvider } from "@/contexts/UserContext";

// Main App component
const App = ({ Component, pageProps }: AppProps) => (
  // Applies theme to Antd components
  <ConfigProvider theme={theme}>
    {/* Provides auth context */}
    <AuthProvider>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </AuthProvider>
  </ConfigProvider>
);

export default App;
