const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database.js');

const User = sequelize.define(
  'User', // 모델 이름
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    nickname: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    sex: {
        type: DataTypes.STRING(8),
        allowNull: false,
        isIn: [['M', 'F']]
    },
    spicy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          max: 2,
          min: 0
        }
    },
    role: {
      type: DataTypes.STRING(128),
      defaultValue: 'user',
    },
    capacity: {
        type: DataTypes.STRING(128),
        defaultValue: 'medium',
        isIn: [['medium', 'small', 'large']]
    },
  },
  { 
    timestamps: true, 
    updatedAt: false,
    tableName: 'users', // 테이블 이름
    indexes: [{
      unique: true,
      fields: ['email'],
    }]
  }
);

const UserAllergies = sequelize.define(
  'UserAllergy', // 모델 이름
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users', // 테이블 이름
        key: 'id',
      }
    },
    allergy: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
  },
  { 
    timestamps: false, 
    tableName: 'userAllergies',
  }
);

User.hasMany(UserAllergies, {
  foreignKey: 'userId',
  as: 'userAllergies',
});
UserAllergies.belongsTo(User, {
  foreignKey: 'userId',
});

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function findById(id) {
  return User.findByPk(id);
}

async function createUser(userData, allergies) {
    const user = await User.create(
        userData,
        {
            include: [{ model: UserAllergies, as: "userAllergies"}]
        },
    );

    const userAllergies = allergies.map((allergy) => ({
        userId: user.id,
        allergy,
    }));
    await UserAllergies.bulkCreate(userAllergies);
    return user.id;
}

module.exports = {
    User,
    UserAllergies,
    findByEmail,
    findById,
    createUser,
};
