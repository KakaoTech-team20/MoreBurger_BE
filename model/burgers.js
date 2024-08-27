const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database.js');
const { User } = require('./auth.js');
const Burger = sequelize.define(
    'Burger',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            // primaryKey: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        calory: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
        },
        brand: {
            type: DataTypes.STRING(128),
            // primaryKey: true,
            allowNull: false,
        },
        managerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            }
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: 'burgers',
    }
);

const Order = sequelize.define(
    'Order',
    {
        orderNo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            field: 'userId'
        },
        BurgerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Burger,
                key: 'id'
            },
            field: 'burgerId'
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: true,
        updatedAt: false,
        tableName: 'orders'
    }
);

const BurgerAllergies = sequelize.define(
    'BurgerAllergy',
    {
        BurgerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Burger,
                key: 'id',
            },
            field: 'burgerId'
        },
        allergy: {
            type: DataTypes.STRING(128),
            primaryKey: true,
        }
    },
    {
        tableName: 'burgerAllergies',
    }
);


Burger.hasMany(BurgerAllergies, { foreignKey: 'BurgerId'});
BurgerAllergies.belongsTo(Burger, {foreignKey: 'BurgerId'});

User.hasMany(Burger, { foreignKey: 'managerId' });
Burger.belongsTo(User, { foreignKey: 'managerId' });

Burger.belongsToMany(User, { through: Order});
User.belongsToMany(Burger, { through: Order});

const INCLUDE_BURGER_ALLERGIES = {
    attributes: {
      include: [[sequelize.fn('JSON_ARRAYAGG', sequelize.col('BurgerAllergies.allergy')), 'allergies']],
    },
    include: [{
      model: BurgerAllergies,
      attributes: [],
    }],
};
  
  const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
  };

  
async function getAll() {
    return Burger.findAll({ ...INCLUDE_BURGER_ALLERGIES, ...ORDER_DESC });
}
  
async function getAllByUserRole(role) {
    return Burger.findAll({
        ...INCLUDE_BURGER_ALLERGIES,
        ...ORDER_DESC,
        include: {
            ...INCLUDE_BURGER_ALLERGIES.include,
        },
        where: { '$User.role$': role },
        include: [{
            model: User,
            attributes: [],
        }],
    });
}

async function getById(id) {
    return Burger.findByPk(id,INCLUDE_BURGER_ALLERGIES);
}
  
async function create(burger, userId) {
    const {allergies, ...burgerData} = burger;
    const data = await Burger.create({ ...burgerData, managerId: userId,
        burgerAllergies: allergies.map(allergy => { BurgerId: burgerData.burgerId ,allergy}),
    },
    {
        include: [BurgerAllergies]
    });
    await BurgerAllergies.bulkCreate(allergies.map((allergy) => ({
        BurgerId: data.id,
        allergy,
    })));
    return data.id;
}

async function update(id, burgerSource) {
    const {allergies, ...burgerData} = burgerSource;
    return Burger.findByPk(id, INCLUDE_BURGER_ALLERGIES) //
        .then((burgerTarget) => {
        // Object.assign(burgerTarget, burgerData);
        burgerTarget.set(burgerData);
        return burgerTarget.save();
        }).catch((err) => {console.log(err);});
}

async function remove(id) {
return Burger.findByPk(id, INCLUDE_BURGER_ALLERGIES) //
    .then((burger) => {
    burger.destroy();
    });
}

module.exports = {
    Burger,
    BurgerAllergies,
    getAll,
    getAllByUserRole,
    getById,
    create,
    update,
    remove,
}