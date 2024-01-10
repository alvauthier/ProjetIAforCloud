const { connection } = require("./db");
const fixtures = require("sequelize-fixtures");
const path = require("path");

const mode = process.argv[2] ?? "alter";

connection
  .sync({ force: true })
  .then(() => {
    console.log("Database synchronized");

    const fixtureFiles = ['users.json', 'ingredients.json', 'recipes.json', 'ingredientsRecipes.json', 'restrictions.json'];
    const fixturePaths = fixtureFiles.map((file) => path.join(__dirname, "fixtures", file));
    return fixtures.loadFiles(fixturePaths, connection.models);
  }).then(() => {
    console.log("Fixtures loaded");
    return connection.close();
  })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unable to synchronize the database:", error);
    process.exit(1);
  });
