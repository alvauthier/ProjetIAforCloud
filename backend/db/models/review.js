module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Review extends Model {}

    Review.init(
        {
            review: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            note: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
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
            tableName: "review",
            sequelize: connection,
        },
    );

    return Review;
}