module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class IngredientRecipe extends Model {}

    IngredientRecipe.init(
        {
            quantity: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            ingredientId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            recipeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "ingredientRecipe",
            sequelize: connection,
        },
    );

    return IngredientRecipe;
}