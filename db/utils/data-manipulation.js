// extract any functions you are using to manipulate your data, into this file

exports.modifyTimeStamp = (array) => {
    const newArray = array.map(article => {
        const newArt = { ...article};
        const toConvert = article['created_at']
        const dateTime = new Date(toConvert)
        newArt.created_at = dateTime.toISOString()
        return newArt
    });

    return newArray
}

const dateTime = new Date(1542284514171)

