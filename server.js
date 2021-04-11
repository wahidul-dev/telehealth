const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('page');
})
app.get('/about', (req, res) => {
  res.render('about');
})
app.get('/contact', (req, res) => {
  res.render('contact');
})
app.get('/medicine', (req, res) => {
  res.render('medicine');
})
app.get('/find', (req, res) => {
  res.render('find');
})
app.get('/signup', (req, res) => {
  res.render('signup');
})
app.get('/signin', (req, res) => {
  res.render('signin');
})
app.get('/cart', (req, res) => {
  res.render('cart');
})
app.get('/room', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', message => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3030)
