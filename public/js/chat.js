socket = io();

const $messageForm = document.querySelector('#messageForm');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormSubmit = $messageForm.querySelector('#sub');
const $messageTag = document.querySelector('#location'); 
const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
const messageTemplate1 = document.querySelector('#message-template1').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const locationTemplate1 = document.querySelector('#location-template1').innerHTML;
const messageTemplate2 = document.querySelector('#message-template2').innerHTML;

$messageFormInput.focus();


socket.on('countUpdated',(count)=>{
    document.getElementById('number-of-users').innerHTML=count;
});


socket.on('message',(x)=>{
    document.getElementById('naam').innerText = x;
    const html = Mustache.render(messageTemplate2,{
        message: x,

    });
    $messageTag.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

socket.on('message1',(x)=>{
    const html = Mustache.render(messageTemplate2,{
        message: x
    });
    $messageTag.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

// socket.on('message1',(x)=>{
//     document.getElementById('message').innerHTML = `<a href = ${x} > Click here to get location </a>`;
// })

const autoScroll = ()=>{
    const NewMessage = $messageTag.lastElementChild;

    const newMessageStyles = getComputedStyle(NewMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = NewMessage.offsetHeight +newMessageMargin;
    
    const visibleHeight = $messageTag.offsetHeight;    
    const containerHeight = $messageTag.scrollHeight;
    const scrollOffset = $messageTag.scrollTop + visibleHeight;
    
    if(containerHeight -newMessageHeight - 200 <= scrollOffset){
        $messageTag.scrollTop = $messageTag.scrollHeight;
    }


}

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const newMessage = $messageFormInput.value;
    $messageFormSubmit.setAttribute('disabled','disabled');
    
    socket.emit('sendMessage',newMessage,(response)=>{
        $messageFormInput.value ="";
        $messageFormInput.focus();
        $messageFormSubmit.removeAttribute('disabled');
        console.log(response);
    });
});

socket.on('messageResponse',(messagess)=>{
    const html = Mustache.render(messageTemplate,{
        messagess: messagess.text,
        createdAt: moment(messagess.crearedAt).format('h:mm'),
        username: messagess.username,
        room: messagess.room
    });
    $messageTag.insertAdjacentHTML('beforeend',html);
    autoScroll();
})
socket.on('messageToMe',(messagess)=>{
    const html = Mustache.render(messageTemplate1,{
        messagess: messagess.text,
        createdAt: moment(messagess.crearedAt).format('h:mm'),
        username: messagess.username,
        room: messagess.room
    });
    $messageTag.insertAdjacentHTML('beforeend',html);
    autoScroll();
})


socket.on('locationResponse',(messagess)=>{
    const html = Mustache.render(locationTemplate,{
        messagess: messagess.text,
        createdAt: moment(messagess.crearedAt).format('h:mm'),
        username: messagess.username,
        room: messagess.room
    });
    $messageTag.insertAdjacentHTML('beforeend',html);
    autoScroll();
})
socket.on('locationToMe',(messagess)=>{
    const html = Mustache.render(locationTemplate1,{
        messagess: messagess.text,
        createdAt: moment(messagess.crearedAt).format('h:mm'),
        username: messagess.username,
        room: messagess.room
    });
    $messageTag.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

document.querySelector('#send').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('GeoLocation is not supported in this browser!');
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
    })
})

socket.on('usersData',({room,users})=>{
    console.log(room,users);
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML=html;
})


document.getElementById('room').addEventListener('click',()=>{
    document.getElementById('chat').style.display="none";
    document.getElementById('chat').style.transition="2s";
    document.getElementById('side').style.display="flex";
    document.getElementById('side').style.transition="2s";
})
document.getElementById('cross').addEventListener('click',()=>{
    document.getElementById('chat').style.display="flex";
    document.getElementById('side').style.display="none";
})

// rooms

const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix: true });

socket.emit('join',{ username , room },(error)=>{
    if(error){
        location.href = '/';
        alert(error);
    }
});
