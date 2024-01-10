module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class FridgeContent extends Model {}

    FridgeContent.init(
        {
            fridgeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ingredientId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "fridgeContent",
            sequelize: connection,
        },
    );

    return FridgeContent;
}