const sequelize = require("./config/connection");
const express = require('express');
// const routes = require('./controllers');
const e = require("express");


const app = express();

const PORT = process.env.PORT || 3001
// handlebars engine
// handlebars set 

// use session
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// static


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
}); 