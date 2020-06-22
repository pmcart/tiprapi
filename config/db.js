const Sequelize = require('sequelize')
const UserModel = require('../models/user')
const sequelize = new Sequelize(
    'tiprdbdev1',
    'admin',
    'tiprtipr', {
        dialect: 'mysql',
        host: 'tiprdbdev1.cwqnlgrblqmv.us-east-1.rds.amazonaws.com',
        port: 3306
    }
)
const User = UserModel(sequelize, Sequelize)
const Models = { User }
const connection = {}
module.exports = async() => {
    if (connection.isConnected) {
        console.log('=> Using existing connection.')
        return Models
    }
    await sequelize.sync()
    await sequelize.authenticate()
    connection.isConnected = true
    console.log('=> Created a new connection.')
    return Models
}