import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="shortcut icon" href="/img/brand/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/img/brand/apple-icon.png"
          />
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCLp0BWj-PHv0RtwuxrUxvItuDiVVsa-TY&libraries=places"></script>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

        </Head>
        <body className="text-blueGray-700 antialiased">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
