const sequelize = require("./config/connection");
const express = require('express');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});


const app = express();



const PORT = process.env.PORT || 3001


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// use session
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// static

app.use(routes);


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
}); 