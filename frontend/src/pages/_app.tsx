import type { AppProps } from "next/app";

import React from "react";
import "../styles/globals.css"; // Import the globals.css file

// Your application code...
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
