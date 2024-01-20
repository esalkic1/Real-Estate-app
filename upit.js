const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Upit = sequelize.define("Upit", {
        tekst_upita: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Upit'
    });

    return Upit;
};