const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.env.local', override: true });

const userRoutes = require('./routes/user');
const searchRoutes = require('./routes/search');
const ingredientsRoutes = require('./routes/ingredients');
const restrictionsRoutes = require('./routes/restrictions');
const recipesRoutes = require('./routes/recipes');
const uniqueRecipesRoutes = require('./routes/uniqueRecipe');
const errorsHandler = require("./middleware/errorsHandler");
const reviewsRoutes = require('./routes/reviews');



const app = express();
const sequelize = require('sequelize');
const review = require('./db/models/review');

// Use to allow cross-origin requests
app.use(cors({
    origin: [`${process.env.URL}:${process.env.PORT_FRONT}`],
    credentials : true,
}));

//cookies
app.use(cookieParser());
// Use to parse JSON body
app.use(express.json());
app.use(express.text());

app.use("/", userRoutes)
app.use("/search", searchRoutes)
app.use("/ingredients", ingredientsRoutes)
app.use("/restrictions", restrictionsRoutes)
app.use("/recipes", recipesRoutes)
app.use("/uniqueRecipe", uniqueRecipesRoutes)
app.use("/reviews", reviewsRoutes)

app.use(errorsHandler);

const port = process.env.PORT_BACK;
const hostname = process.env.DOMAIN_NAME;

app.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}/`);
});

module.exports = app;