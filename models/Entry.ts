'use strict';

const Entry = (sequelize, DataTypes) => {
    return sequelize.define('Entry', {
        uid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER
        }
    }, {
        indexes:[
            {
                unique: true,
                fields:['uid']
            }
        ]
    });
};

const Associations = (models) => {
    models.Entry.belongsToMany(
        models.Entry,
        {
            as: 'Met',
            through: 'connection'
        }
    );

    models.Entry.belongsToMany(
        models.Group,
        {
            as: 'Member',
            through: 'GroupMember'
        }
    );
};

module.exports = { models: [Entry], Associations};
