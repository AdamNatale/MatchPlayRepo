const fetch = require("node-fetch");

const variables = require("./config");

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

async function buildTeams() {
    const eventsUrl = new URL(
        `https://app.matchplay.events/api/activity-logs?tournament=${variables.variables.tournamentId}&page=1&action=players_add`
    );
    
    let eventsResp = await doRequest(eventsUrl);
    
    const playersUrl = new URL(
        `https://app.matchplay.events/api/tournaments/${variables.variables.tournamentId}?includePlayers=1`
    );
    
    let playersResp = await doRequest(playersUrl);
    
    let team1 = [];
    let team2 = [];

    console.log(eventsResp);
    
    await eventsResp.data.forEach((event) => {
        console.log(event);
        for (let i = 0; i < event.data.playerIds.length; i++) {
            let obj = playersResp.data.players.find(o => o.playerId === event.data.playerIds[i]);
            console.log(obj);
            if (team1.length === team2.length) {
                team1.push(obj.name);
            } else {
                team2.push(obj.name);
            }
        }
    });
    
    console.log(team1);
    console.log(team2);
}

buildTeams();