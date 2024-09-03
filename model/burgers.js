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
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: null,
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        calory: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        image: {
            type: DataTypes.TEXT,
            defaultValue: null,
        },
        brand: {
            type: DataTypes.STRING(128),
            defaultValue: null,
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
            defaultValue: null,
        },
        spicy: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
    },
    {
        timestamps: true,
        tableName: 'burgers',
        indexes: [{
            unique: true,
            fields: ['brand', 'name'],
        }]
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
            primaryKey: true,
            references: {
                model: User,
                key: 'id'
            },
            field: 'userId'
        },
        BurgerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Burger,
                key: 'id'
            },
            field: 'burgerId'
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        }
    },
    {
        timestamps: true,
        updatedAt: false,
        tableName: 'orders',
    }
);

const BurgerAllergies = sequelize.define(
    'burgerAllergies',
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
        timestamps: false,
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
      include: [[sequelize.fn('JSON_ARRAYAGG', sequelize.col('burgerAllergies.allergy')), 'allergies']],
    },
    include: [{
      model: BurgerAllergies,
      attributes: ['allergy'],
    }],
    group: 'id',
};
  
  const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
  };

  
async function getAll() {
    return Burger.findAll({ 
        ...INCLUDE_BURGER_ALLERGIES, 
        ...ORDER_DESC,
    });
}
  
async function getAllByUserRole(role) {

    return Burger.findAll({
        ...INCLUDE_BURGER_ALLERGIES,
        ...ORDER_DESC,
        // include: [{
        //     model: User,
        //     attributes: [],
        //     where: { role },
        // }, 
        // ...INCLUDE_BURGER_ALLERGIES.include,
        // ],
    });
}

async function getById(id) {
    return Burger.findByPk(id,INCLUDE_BURGER_ALLERGIES);
}

async function create(burger, userId) {
    const {allergies, ...burgerData} = burger;

    const [data, created] = await Burger.findOrCreate({
        where: {
            name: burgerData.name,
            brand: burgerData.brand
        },
        defaults: burgerData
    });
    if (created) {
        await BurgerAllergies.bulkCreate(allergies.map((allergy) => ({
            BurgerId: data.id,
            allergy,
        })));
    }
    return [created, data.id];
}

async function update(id, burgerSource) {
    const {allergies, ...burgerData} = burgerSource;
    
    return Burger.findByPk(id, INCLUDE_BURGER_ALLERGIES) //
        .then((burgerTarget) => {
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