// const fetch = require('node-fetch');
// var ChessWebAPI = require('chess-web-api');
// const fs = require('fs');

// var chessAPI = new ChessWebAPI();

// async function getClubMembers(clubId) {
//     const response = await chessAPI.getClubMembers(clubId);
//     const members = response.body.all_time.map(member => member.username);
//     return members;
// }


// async function getPlayerTournaments(username) {
//   const response = await fetch(
//     `https://api.chess.com/pub/player/${username}/tournaments`
//   );

//   if (response.status === 200) {
//     const tournaments = await response.json();
//     return tournaments;
//   } else {
//     throw new Error(response.statusText);
//   }
// }

// const getAllPlayersTournaments = async (players) => {
//     const tournamentsByPlayer = {};
  
//     for (const player of players) {
//       const response = await fetch(
//         `https://api.chess.com/pub/player/${player}/tournaments`
//       );
  
//       if (response.status === 200) {
//         const tournaments = await response.json();
//         tournamentsByPlayer[player] = tournaments;
//       } else {
//         throw new Error(response.statusText);
//       }
//     }
  
//     return tournamentsByPlayer;
//   };


// async function main() {
//     const members = await getClubMembers("clube-de-xadrez-erbo-stenzel");
//     //const tournaments = await getPlayerTournaments("hikaru");
//     //const tournamentsByPlayer = await getAllPlayersTournaments(members);

//     const tournaments = await getPlayerTournaments("RafaLops");

//     //console.log(tournamentsByPlayer);
//     console.log(members);
//     console.log(tournaments);
// }

// main(); 


var ChessWebAPI = require('chess-web-api');
var cliProgress = require('cli-progress');
var colors = require('ansi-colors');
const fs = require('fs');

var chessAPI = new ChessWebAPI();

const getResultByUser = async (memberList, filter) => {
  const bonusPoints = [10, 8, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  // Configure progress bar.
  const progressBar = new cliProgress.SingleBar({
    format:
      "Calculating member's score |" +
      colors.green("{bar}") +
      "| {percentage}% || {value}/{total} Members",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: false,
  });

  // // Start from 0.
   progressBar.start(memberList.length, 0);


  // Iterate over members calculating
  // their absolute score over the year.
  const membersResult = Array();
  for (const username of memberList) {
    let score = 0;
    let tournamentCount = 0;

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
    // Get user data.
    const body  = await getPlayerTournaments(username);

    // Filter tournaments by name,
    // must include the string passed
    // through the variable "filter".
    const tournaments = body.finished.filter((t) => t.url.includes(filter));

    // Do nothing if the player has not
    // participated in any tournament.
    if (tournaments.length === 0) {
      progressBar.increment();
      continue;
    }

    for (const t of tournaments) {
      tournamentCount++;
      // Points gained.
      score += t.wins + 0.5 * t.draws;
      // Bonus points if exits, 0 otherwise.
      score += bonusPoints[t.placement - 1] ?? 0;
    }

    // Add to the Array of members.
    membersResult.push({ username, score, tournamentCount });
    progressBar.increment();
  }

  // Finished.
  progressBar.stop();

  // Sort it descending.
  membersResult.sort((m1, m2) => (m1.score < m2.score ? 1 : -1));
  return membersResult;
};

(async () => {

  async function getClubMembers(clubId) {
    const response = await chessAPI.getClubMembers(clubId);
    return response;
  } 

  // Request list of players.
  const { body } = await getClubMembers(
    "clube-de-xadrez-erbo-stenzel"
  );

   // Concatenate all.
   const { weekly, monthly, all_time } = body;

  // // Get all of them.
   const members = [...weekly, ...monthly, ...all_time].map(
     (member) => member.username
   );

   // Get array with members score.
   const membersResult = await getResultByUser(members, "cxes-online-2023---iv");

  // Save to file.
  const filename = "./result.json";
  try {
    fs.writeFileSync(filename, JSON.stringify(membersResult, null, 2), "utf8");
    console.log(`Results generated successfully, saved on file ${filename}`);
  } catch (err) {
    console.log("Error trying to save results\n", err);
  }
})();

