import "./index.less";

import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";

import App from "./App";

render(
  <LocaleProvider locale={zh_CN}>
    <Router>
      <App />
    </Router>
  </LocaleProvider>,
  document.querySelector("#app")
);
