module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Restriction extends Model {}

    Restriction.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "restriction",
            sequelize: connection,
        },
    );

    return Restriction;
}