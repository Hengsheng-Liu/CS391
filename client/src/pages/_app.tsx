import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";

import theme from "@/theme/themeConfig";
import LayoutComponent from "@/layout/layout";
import { AuthProvider } from "@/contexts/UserContext";
const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <AuthProvider>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </AuthProvider>
  </ConfigProvider>
);

export default App;
