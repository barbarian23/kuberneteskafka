import '@babel/polyfill';
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, Switch } from "react-router-dom";
import MainRouter from "../client/routerClient";
import path from "path";

export default class Render {
    static getInstance(){
        if(!this.instance){
            this.instance = new Render();
        }
        return this.instance;
    }

    async render(req, res) {
        const title = "Debezium test case";
        console.log("senddddddddd");
        const context = {};
      
        const component = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={context}>
              <Switch>
                <MainRouter />
              </Switch>
            </StaticRouter>
        );
      
        //render ra file
        //trên productionpath.resolve(__dirname, "dist/public")
        try {
          res.sendFile(path.resolve(__dirname, "public/index.html"), { title: title, component: component, preloadedState: "" });
        } catch (err) {
          console.error(err);
        }
        
      }

}