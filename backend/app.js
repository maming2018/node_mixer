const Mixer = require('@mixer/client-node');
const ws = require('ws');
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const chalk = require('chalk');

const sequelize = require('./Config/Database');
const MixerChat = require('./Models/MixerChat');
const Channels = require('./Models/Channels');

const MIXER_API_ENDPOINT = "https://mixer.com/api/v1";

sequelize.sync({ force: false });

const port = 3001;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log('HOME RUN');
  res.send({ response: "I am alive" }).status(200);
});

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socketCustom => {

  mixerSocketData(socketCustom)

});

const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

const mixerSocketData = async socketCustom => {

  let userInfo;

  client.use(new Mixer.OAuthProvider(client, {
    tokens: {
      access: 'dp4ptPbLelvKGirFDCqMS6LQyxh4uxs5FXEnrl6xARowZ06yII4HafoNA7luuDfH',
      expires: Date.now() + (10 * 365 * 24 * 60 * 60 * 1000)
    },
  }));

  client.request('GET', 'users/current')
    .then(response => {

      // Store the logged in user's details for later reference
      userInfo = response.body;

      // Returns a promise that resolves with our chat connection details.
      return new Mixer.ChatService(client).join(response.body.channel.id);
    })
    .then(response => {
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
    console.log(chalk.red('We got a ChatMessage packet!'));
    // console.log(data);

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

    socketCustom.emit("ChatMessage", data); // Emitting a new message. It will be consumed by the client


  });

  // Listen for socket errors. You will need to handle these here.
  socket.on('error', error => {
    console.error('Socket error');
    console.error(error);
  });

  app.post('/send-new-message', (req, res) => {
    console.log('/send-new-message')

    const { new_message } = req.body

    socket.call('msg', [new_message]);

    res.send("sent").status(200);
  });
}

app.get('/history', (req, res) => {

  // const channel_id = 102802767;
  // console.log(req.query);
  const channel_id = req.query.channel_id

  let searchOutput = [];
  let saveToDb = [];

  axios.get(`${MIXER_API_ENDPOINT}/chats/${channel_id}/history`).then(function (response) {
    response.data.forEach(raw => {
      // console.log(raw)
      let text_message = '-';
      let image_url = '-';
      if (raw.message.message[0].type === 'text') {
        text_message = raw.message.message[0].text;
      } else if (raw.message.message[0].type === 'image') {
        text_message = raw.message.message[0].text;
        image_url = raw.message.message[0].url;
      } else {
        text_message = raw.message.message[0].type;
      }

      let newItem = {
        channel: raw.channel,
        user_name: raw.user_name,
        text_message: text_message,
        image_url: image_url,
      }
      searchOutput.push(newItem);

      let dbItem = {
        chatId: raw.id,
        channelId: raw.channel,
        userId: raw.user_id,
        messageType: raw.message.message[0].type,
        message: text_message,
        imageUrl: image_url,
      }

      saveToDb.push(dbItem);
    })

    MixerChat.destroy({
      where: {
        channelId: channel_id
      }
    }).then(r => {
      MixerChat.bulkCreate(saveToDb)
    })

    res.send({ 'history': searchOutput }).status(200);
  }).catch(function (error) {
    console.log(error);
  })

})

app.post('/token-verify', (req, res) => {

  let userInfo;

  const { access_token } = req.body;
  // console.log("access_token:", access_token);

  axios.get(`${MIXER_API_ENDPOINT}/users/current`, {
    headers: { Authorization: `Bearer ${access_token}` }
  }).then(() => {
    console.log('You are now authenticated!');
    res.send('AUTHENTICATED').status(200);
  }).catch(error => {
    console.log("Error 1: ", error.data)
    console.error('Oh no! An error occurred.');
    res.send('AUTH-REQUIRED').status(200);
  });
})

// get all channels
app.get('/channels', (req, res) => {

  Channels.findAll({ order: [['channelName', 'ASC']] }).then(data => {
    // console.log('All data:', JSON.stringify(data, null, 4));
    return res.send(data)
  }).catch(err => {
    console.log(err);
    return res.send(err)
  });
})

// Create an item
app.post('/channels', (req, res) => {

  const { channelName } = req.body

  axios.get(`${MIXER_API_ENDPOINT}/channels/${channelName}?fields=id`).then(response => {
    if (response.data.error) {
      return res.send(response.data.error)
    } else {
      let channelId = response.data.id;
      Channels.create({ channelName: channelName, channelId: channelId }).then(channels => {
        return res.send(channels)
      }).catch(err => {
        return res.send(err)
      });
    }
  }).catch(error => {
    if (error.response.data.error && error.response.data.error === 'Not Found') {
      return res.send("notfound")
    }
    return res.send(error)
  })
})

// Create an item
app.post('/save-chat', (req, res) => {

  const data = req.body

  MixerChat.create({ chatId: data.id, channelId: data.channel, userId: data.user_id, messageType: data.message.message[0].type, message: data.text_message, imageUrl: data.image_url }).then(chat => {
    console.log(`Auto-generated ID:`, chat.id);
  }).catch(err => {
    console.log("Sequlize save error: ", err);
  });

})

server.listen(port, () => {
  console.log(chalk.blue(`MIXER  - Server runnig on port : ${port}`))
  console.log(chalk.blue('URL: http://localhost:3001'))
})
