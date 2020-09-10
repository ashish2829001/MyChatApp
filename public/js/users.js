const users = [];

const addUser = ({id,username,room})=>{
    username= username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return{
            error : 'Username and Room is required!'
        }
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username;
    })

    if(existingUser){
        return{
            error: 'Username already in use!'
        }
    }

    const user = {id,username,room};
    users.push(user);

    return { user };

}

// addUser({
//     id: 2,
//     username: "Ashish",
//     room: "newRoom"
// })
// console.log(users);
// addUser({
//     id: 3,
//     username: "Ashish Pratap",
//     room: "newRoom"
// })

// console.log(users);

// const res=addUser({
//     id: 1,
//     username: "Ashis",
//     room: "newRoom"
// })
// console.log(res);

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id;
    })

    if(index != -1){
        const userss = users.splice(index,1)[0];
        return userss;
    }
}
// const iden=1;
// const r = removeUser(iden);

// console.log(r);
// console.log(users);

const getUser = (id)=>{
    return users.find((user)=> user.id === id);
}

// console.log(getUser(2));

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
    return users.filter((user)=>user.room === room)
}

// console.log(getUsersInRoom('newROom'));

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}