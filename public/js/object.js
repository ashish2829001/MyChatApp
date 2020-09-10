const obj = (object)=>{
    return {
        text: object.text,
        username : object.username,
        room: object.room,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    obj
}