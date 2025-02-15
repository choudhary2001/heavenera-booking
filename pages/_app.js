import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { Provider } from 'react-redux';
import { store } from 'actions/store'; // Adjust if necessary to correct path
import { GoogleOAuthProvider } from '@react-oauth/google'; // Ensure correct path if needed

import PageChange from "components/PageChange/PageChange.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

export default class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`
=========================================================
* Heavenera - v1.1.0 based on Tailwind Starter Kit by Shwastik Tech Solutions Pvt. Ltd.
=========================================================
* Product Page: https://swastik.ai/product/notus-nextjs
* Copyright 2021 Shwastik Tech Solutions Pvt. Ltd. (https://swastik.ai)
* Licensed under MIT (https://github.com/creativetimofficial/notus-nextjs/blob/main/LICENSE.md)
=========================================================
`);
    document.insertBefore(comment, document.documentElement);
  }

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>Heavenera by Shwastik Tech Solutions Pvt. Ltd.</title>
        </Head>

        <Provider store={store}> {/* Wrap your app with Provider */}
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Add your Google OAuth Client ID */}
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GoogleOAuthProvider>
        </Provider>
      </React.Fragment>
    );
  }
}
