module.exports.getDate = function(){
    const today = new Date();
    const options = {
        weekday :"long",
        day : "numeric",
        month : "long"
    };
    return today.toLocaleDateString("en-us",options);
}

module.exports.getDay = function(){
    const today = new Date();
    const options = {
        day : "numeric",
    };
    return today.toLocaleDateString("en-us",options);
}