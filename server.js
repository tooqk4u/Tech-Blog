const sequelize = require("./config/connection");
const express = require("express");
const routes = require("./controllers");
const helpers = require("./utils/helpers.js")
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ helpers });
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
    secret: "aywtd?inshfy?283",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    // stores the new session to the database exported in config/connection
    store: new SequelizeStore({
      db: sequelize,
    }),
  };

const app = express();



const PORT = process.env.PORT || 3001;


app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// use session
app.use(session(sess));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}!`));
}); 