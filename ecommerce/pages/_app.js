import "../styles/globals.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Layout } from "../components";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
