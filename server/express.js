import express from 'express';
import logger from "morgan";
import flow from 'dotenv-flow';
import fs from "fs";
import path from 'path';
import cors from 'cors';
const __dirname = path.resolve();

flow.config({node_env: process.env.NODE_ENV,default_node_env: 'development'});

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/uploads'));

// Dynamically load routes
const Routes = fs.readdirSync('apis/routes').filter(file => file.endsWith('.js'));

for (const route of Routes) {
    let RoutePath = route.replace(/\.[^/.]+$/, "");
    const { default:defaultPath } = await import(`../apis/routes/${route}`);
    app.use(`/${RoutePath=="root" ? "":RoutePath}`,defaultPath);
}

app.listen(process.env.EXPRESS_PORT,  ()=>console.log(`Express server started at port ${process.env.EXPRESS_PORT}`));

export default app;
