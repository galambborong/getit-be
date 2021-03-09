const dbConnection = require('../db/dbConnection')

exports.fetchTopics = () => {
    return dbConnection.select('*').from('topics')
}