const DB = require('../utils/db');
const ScoreModel = require('../models/score.js');
const ScoreRouter = require('express').Router();


//Update
ScoreRouter.post('/increase', async (req, res) => {
    try {
        let { name, score } = req.body;
        let player = await new DB().FindByNickName("SimonGame", name);
        if (player === null) {
            player = new ScoreModel(name, [score])
           player=await new DB().Insert("SimonGame", player)
            return res.status(201).json(player);
        }
        player.score.push(score)

        await new DB().UpdateDocById("SimonGame", player._id, player);

        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ error });
    }
});


//Read one
ScoreRouter.get('/player/:name', async (req, res) => {
    try {
        let { name } = req.params; //get the id param.
        let player = await new DB().FindByNickName("SimonGame", name);
        console.log(player);
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error });
    }
});



module.exports = ScoreRouter;