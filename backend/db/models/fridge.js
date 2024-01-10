module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Fridge extends Model {}

    Fridge.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "fridge",
            sequelize: connection,
        },
    );

    return Fridge;
}