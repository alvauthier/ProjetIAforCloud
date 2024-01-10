module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Recipe extends Model {}

    Recipe.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            instructions: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: "recipe",
            sequelize: connection,
        },
    );

    return Recipe;
}