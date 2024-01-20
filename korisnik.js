const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Korisnik = sequelize.define("Korisnik", {
        ime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prezime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Korisnik' // postavlja ispravno ime tabele
    });

    return Korisnik;
};