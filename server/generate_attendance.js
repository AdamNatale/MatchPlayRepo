const fetch = require("node-fetch");
const fs = require('fs');
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

async function generateAttendance() {
    const tournamentIds = [
        {
            tournamentId: "198053",
            date: "2025-06-20"
        },
        {
            tournamentId: "198180",
            date: "2025-06-21"
        },
        {
            tournamentId: "199076",
            date: "2025-06-27"
        },
        {
            tournamentId: "199271",
            date: "2025-06-28"
        }
    ];

    const playerData = [
        /* {
            playerName: "some-name",
            playerId: "some-id"
            attendance: [
                tournamentIds
            ]
        }
        */
    ];

    for (const tournament of tournamentIds) {
        const playersUrl = new URL(
            `https://app.matchplay.events/api/tournaments/${tournament.tournamentId}?includePlayers=1`
        );
        
        let playersResp = await doRequest(playersUrl);

        await playersResp.data.players.forEach((player) => {
            let obj = playerData.find(o => o.playerId === player.playerId);
            if (!obj) {
                playerData.push({
                    playerName: player.name,
                    playerId: player.playerId,
                    attendance: [tournament.tournamentId]
                });
                return;
            }
            objIndex = playerData.findIndex(newObj => newObj.playerId == obj.playerId);
            playerData[objIndex].attendance.push(tournament.tournamentId);
            return;
        });
    }
    console.log(playerData);
    let csvFileContent = "Name,";
    tournamentIds.forEach((tournament => {
        csvFileContent += `${tournament.date},`
    }));
    csvFileContent += "total\n";

    playerData.sort((a, b) => a.playerName.localeCompare(b.playerName));

    playerData.forEach((player) => {
        csvFileContent += `${player.playerName},`
        tournamentIds.forEach((tournament => {
            if (player.attendance.includes(tournament.tournamentId)) {
                csvFileContent += `Yes,`;
            } else {
                csvFileContent += `No,`;
            }
        }));
        csvFileContent += `${player.attendance.length}\n`
    });
    console.log(csvFileContent);

    fs.writeFile('attendance.csv', csvFileContent, err => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('File written successfully!');
        }
    });

}

generateAttendance();