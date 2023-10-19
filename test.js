var ChessWebAPI = require('chess-web-api');
var cliProgress = require('cli-progress');
var colors = require('ansi-colors');
const fs = require('fs');

var chessAPI = new ChessWebAPI();

username = "sergiomeira"

async function getPlayerTournaments(username) {
    const response = await fetch(
      `https://api.chess.com/pub/player/${username}/tournaments`
    );
  
    if (response.status === 200) {
      const tournaments = await response.json();
      return tournaments;
    } else {
      throw new Error(response.statusText);
    }
}



async function main() {
    tournaments = await getPlayerTournaments(username)
    tournaments = tournaments.finished.filter((t) => t.url.includes("cxes-online-2023---iv"));
    console.log(tournaments.wins)


    score = 0
    for (const t of tournaments) {
        console.log(t.url)
        const bonusPoints = [10, 8, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        // Points gained.
        score += t.wins + 0.5 * t.draws;
        // Bonus points if exits, 0 otherwise.
        score += bonusPoints[t.placement - 1] ?? 0;
    }
    console.log(score)

}

main(); 


