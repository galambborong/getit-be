// extract any functions you are using to manipulate your data, into this file

exports.modifyTimeStamp = (array) => {
  const newArray = array.map((article) => {
    const newArt = { ...article };
    const toConvert = article['created_at'];
    const dateTime = new Date(toConvert);
    newArt.created_at = dateTime.toISOString();
    return newArt;
  });

  return newArray;
};

exports.creatRefObj = (array, key, value) => {
  const newObj = {};
  array.map((item) => {
    const newKey = item[key];
    const newValue = item[value];
    newObj[newKey] = newValue;
  });

  return newObj;
};

exports.formatItems = (array) => {
  const formattedItem = array.map((item) => {
    const copyItem = { ...item };
    const value = copyItem.created_by;
    copyItem.author = value;
    delete copyItem.belongs_to;
    return copyItem;
  });
  console.log(formattedItem);
  return formattedItem;
};
