const {fetchTopics} = require('../models/topics')

exports.getTopics = (req, res, next) => {
    console.log('In topics cont')
    fetchTopics().then((returnedTopics) => {
        res.status(200).send(returnedTopics)
    })
}