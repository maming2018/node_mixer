const Mixer = require('@mixer/client-node');
const ws = require('ws');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const chalk = require('chalk');

const port = 3001;
const index = require("./routes/index");


const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

// let interval;

io.on("connection", socketCustom => {

  // console.log("CALLED mixerSocketData");
  mixerSocketData(socketCustom)

  // console.log("New client connected");
  // if (interval) {
  //   clearInterval(interval);
  // }
  // // interval = setInterval(() => getApiAndEmit(socketCustom), 10000);
  // interval = setInterval(() => {
  //   getApiAndEmit(socketCustom);
  //   mixerSocketData(socketCustom);
  // }, 10000);
  // socketCustom.on("disconnect", () => {
  //   console.log("Client disconnected");
  // });
});

const getApiAndEmit = async socketCustom => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/API_KEY_HERE/43.7695,11.2558"
    ); // Getting the data from DarkSky
    socketCustom.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

const mixerSocketData = async socketCustom => {

  let userInfo;

  // With OAuth we don't need to log in. The OAuth Provider will attach
  // the required information to all of our requests after this call.
  client.use(new Mixer.OAuthProvider(client, {
    tokens: {
      access: 'dp4ptPbLelvKGirFDCqMS6LQyxh4uxs5FXEnrl6xARowZ06yII4HafoNA7luuDfH',
      expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
  }));

  // Gets the user that the Access Token we provided above belongs to.
  client.request('GET', 'users/current')
    .then(response => {
      // console.log("users/current THEN ONE")
      // console.log(response.body);

      // Store the logged in user's details for later reference
      userInfo = response.body;

      // Returns a promise that resolves with our chat connection details.
      return new Mixer.ChatService(client).join(response.body.channel.id);
    })
    .then(response => {
      // console.log("users/current THEN TWO")
      const body = response.body;
      // console.log(body);
      return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey, socketCustom);
    })
    .catch(error => {
      console.error('Something went wrong.');
      console.error(error);
    });
}

/**
  * Creates a Mixer chat socket and sets up listeners to various chat events.
  * @param {number} userId The user to authenticate as
  * @param {number} channelId The channel id to join
  * @param {string[]} endpoints An array of endpoints to connect to
  * @param {string} authkey An authentication key to connect with
  * @returns {Promise.<>}
  */
function createChatSocket(userId, channelId, endpoints, authkey, socketCustom) {
  const socket = new Mixer.Socket(ws, endpoints).boot();

  // You don't need to wait for the socket to connect before calling
  // methods. We spool them and run them when connected automatically.
  socket.auth(channelId, userId, authkey)
    .then(() => {
      console.log('You are now authenticated!');
      // Send a chat message
      // return socket.call('msg', ['Hello world!']);
    })
    .catch(error => {
      console.error('Oh no! An error occurred.');
      console.error(error);
    });

  // Listen for chat messages. Note you will also receive your own!
  socket.on('ChatMessage', data => {
    console.log('We got a ChatMessage packet!');
    console.log(data.message);

    let text_message = '-';
    let image_url = '-';
    if (data.message.message[0].type === 'text') {
      text_message = data.message.message[0].text;
    } else if (data.message.message[0].type === 'image') {
      text_message = data.message.message[0].text;
      image_url = data.message.message[0].url;
    } else {
      text_message = data.message.message[0].type;
    }
    data.text_message = text_message;
    data.image_url = image_url;
    // searchOutput.push(raw)

    // console.log(data.message); // Let's take a closer look
    // socketCustom.emit("ChatMessage", "Hey boy"); // Emitting a new message. It will be consumed by the client
    socketCustom.emit("ChatMessage", data); // Emitting a new message. It will be consumed by the client
  });

  // Listen for socket errors. You will need to handle these here.
  socket.on('error', error => {
    console.error('Socket error');
    console.error(error);
  });

  socket.emit('sendMessageEmit', data => {
    console.error('sendMessageEmit');
    console.error(data);
  });
}


// Create an item
app.post('/send-new-message', (req, res) => {
  console.log('/send-new-message')
  console.log(req.body)

  const { category, description, tags, isTagSearchOnly, status } = req.body

})

server.listen(port, () => {
  console.log(chalk.blue(`MIXER  - Server runnig on port : ${port}`))
  console.log(chalk.blue('URL: http://localhost:3001'))
})
