module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Ingredient extends Model {}

    Ingredient.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            unit: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "ingredient",
            sequelize: connection,
        },
    );

    return Ingredient;
}