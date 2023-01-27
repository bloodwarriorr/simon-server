require('dotenv').config();
const io = require('socket.io')(5000, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

//libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const DB = require('./utils/db');
const ScoreModel = require('./models/score.js');

//port
const PORT = process.env.PORT || 5008;

//create server
const server = express();
server.use(express.json()); //enable json support
server.use(cors()); //enable global access
server.use(helmet()); //more defense
server.use('/api', require('./controllers/score_controller'))
io.on('connection', socket => {
    console.log("hi");
    socket.on('new-score', async (obj) => {
        console.log(obj);
        try {
            let player = await new DB().FindByNickName("SimonGame", obj.name);
            if (player === null) {
                player = new ScoreModel(obj.name, [obj.score])
                player = await new DB().Insert("SimonGame", player)
                socket.emit("player-score", { player })
                return;
            }
            player.score.push(obj.score)
            let newPlayer = await new DB().UpdateDocById("SimonGame", player._id, player);
            socket.emit("player-score", { newPlayer })
        } catch (error) {
            return new Error("Bad information sent")
        }
    })
    socket.on('get-score', async (name) => {
        try {
            let player = await new DB().FindByNickName("SimonGame", name);
            console.log(player);
            socket.emit("send-score", player)
        } catch (error) {
            return new Error("Bad information sent")
        }
    })
})


server.listen(PORT, () => console.log(`http://localhost:${PORT}`));