const axios = require('axios');

module.exports.listTeams = (req, res, next) => {
    getFromAPI(`/api/v1/teams?sportId=1`)
    .then(function (response) {
        response.data.teams.sort((a, b) => a.name.localeCompare(b.name));

        res.render('listTeams', { title: 'MLB Teams', teams: response.data.teams });
    })
    .catch(function (error) {
        res.render('error');
    });
}

module.exports.singleTeam = (req, res, next) => {
    let teamID = parseInt(req.params.id);
    if (!Number.isInteger(teamID))
        throw new Error('Team ID not found')

    axios.all([getFromAPI(`/api/v1/teams/${teamID}`), getFromAPI(`/api/v1/teams/${teamID}/roster`)])
    .then(axios.spread(function (team, roster) {
        let teamData = team.data.teams[0];
        let rosterData = roster.data.roster;

        res.render('singleTeam', { title: teamData.name, team: teamData, roster: rosterData });
    }))
    .catch(function (error) {
        res.render('error');
    });
}

module.exports.singlePlayer = (req, res, next) => {
    let playerID = parseInt(req.params.id);
    if (!Number.isInteger(playerID))
        throw new Error('Player ID not found')

    getFromAPI(`/api/v1/people/${playerID}?hydrate=stats(group=[hitting,pitching,fielding],type=[yearByYear])`)
    .then(function (response) {
        let playerData = response.data.people[0];

        res.render('singlePlayer', { title: playerData.fullName, player: playerData });
    })
    .catch(function (error) {
        res.render('error');
    });
}

function getFromAPI(call) {
    return axios.get(`https://statsapi.mlb.com${call}`);
}