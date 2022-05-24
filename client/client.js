import React from "react";
import ReactDOM from "react-dom";
import MainRouter from "./routerclient";
import { BrowserRouter, Switch } from "react-router-dom";
import './asset/css/client.css';

class Client extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <MainRouter />
                </Switch>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(
        <Client />,
    document.getElementById("root"));