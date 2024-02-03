const fetch = require("node-fetch");

const variables = require("./config");

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

async function doRequest(url) {
    const headers = {
        "Authorization": "Bearer " + variables.variables.matchPlayToken,
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    let resp = await fetch(url, {
        method: "GET",
        headers,
    }).then((response) => {
        return response.json();
    }).catch({
            // pass
    });

    return resp;
}

app.get("/api", async (req, res) => {
    const playersUrl = new URL(
        `https://app.matchplay.events/api/tournaments/${variables.variables.tournamentId}?includePlayers=1`
    );

    let playersResp = await doRequest(playersUrl);
    
    const url = new URL(
        `https://app.matchplay.events/api/tournaments/${variables.variables.tournamentId}/standings`
    );

    let resp = await doRequest(url);

    let standings = [];

    await playersResp.data.players.forEach((player) => {
        let obj = resp.find(o => o.playerId === player.playerId);
        standings.push({
            name: player.name,
            points: obj.points,
            gamesPlayed: obj.gamesPlayed
        });
    });

    res.json(standings);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
