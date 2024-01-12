module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Favorites extends Model {}

    Favorites.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            recipeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "favorites",
            sequelize: connection,
        },
    );

    return Favorites;
}