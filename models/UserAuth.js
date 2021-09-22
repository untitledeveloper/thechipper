// UserAuth contains information required to verify authentication for a user.
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');

class UserAuth extends Model {
    checkPassword(inputPassword) {
        return bcrypt.compareSync(inputPassword, this.password);
    }
}

UserAuth.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    // Type Code, for now we just have one for password
    auth_type: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate:{
        isIn: {
            args: [['email']],
          }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    hooks: {
      beforeCreate: async (userAuth) => {
        if(userAuth.password){
            userAuth.password = await bcrypt.hash(userAuth.password, 10);
            return userAuth;
        }
      },
      beforeUpdate: async (userAuth) => {
        if(userAuth.password){
            userAuth.password = await bcrypt.hash(userAuth.password, 10);
            return userAuth;
        }
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_auth',
  }
);

module.exports = UserAuth;
