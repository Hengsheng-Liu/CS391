import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Head, Html, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";

// Custom Document component for Next.js
const MyDocument = () => (
  <Html lang="en">
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

// getInitialProps method for server-side rendering
MyDocument.getInitialProps = async (ctx: DocumentContext) => {

  // Create a cache for storing CSS styles
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;

  // Override renderPage to wrap the app with StyleProvider
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        ),
    });

  // Get the initial props from the original Document component
  const initialProps = await Document.getInitialProps(ctx);

  // Extract the styles from the cache
  const style = extractStyle(cache, true);

  // Return the initial props along with the extracted styles
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
