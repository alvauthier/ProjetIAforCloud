module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class RecipeReview extends Model {}

    RecipeReview.init(
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
            isFavorite: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
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
            tableName: "recipeReview",
            sequelize: connection,
        },
    );

    return RecipeReview;
}