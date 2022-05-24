import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { DebeziumNormal, DebeziumException, DebeziumLoad } from "./screen";

class MainRouter extends React.Component {
    render() {
        return (
            <>
                <Route path="/" component={DebeziumNormal} />
                <Route path="/exception" component={DebeziumException} />
                <Route path="/load" component={DebeziumLoad} />
            </>
        );
    }
}
export default MainRouter;