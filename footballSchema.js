const mongoose = require('mongoose');

 

const footballTeamSchema = new mongoose.Schema({

    team: {

        type: String,

        required: true

    },

    games_played: {

        type: Number,

        required: true

    },

    win: {

        type: Number,

        required: true

    },

    draw: {

        type: Number,

        required: true

    },

    loss: {

        type: Number,

        required: true

    },

    goals_for: {

        type: Number,

        required: true

    },

    goals_against: {

        type: Number,

        required: true

    },

    points: {

        type: Number,

        required: true

    },

    year: {

        type: Number,

        required: true

    },

})

 

const footballTeam = mongoose.model('footballTeam', footballTeamSchema);

module.exports = footballTeam;

 