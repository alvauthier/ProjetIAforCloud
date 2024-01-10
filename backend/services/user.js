const { User } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function UserService() {
  return {
    update: async (filters, newData) => {
      if (newData.length !== 2 && newData.email == undefined && newData.website == undefined) 
        return res.status(400).json({ error: "Mauvaise requête" });

      try {
        
        const [nbUpdated, users] = await User.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        return users;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    delete: async (filters) => {
      return User.destroy({ where: filters });
    },
    login: async (email, password) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new ValidationError({
          email: "Invalid credentials",
        });
      }
      const isPasswordValid = await user.isPasswordValid(password);
      if (!isPasswordValid) {
        throw new ValidationError({
          email: "Invalid credentials",
        });
      }

      return user;
    },
  };
};
