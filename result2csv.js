
const fs = require('fs');
const json2csv = require('json2csv');


// CSV headers.
const position = "Colocação";
const username = "Usuário";
const score = "Pontuação";
const tournamentCount = "Rodadas jogadas";

// Read from file.
const result = JSON.parse(fs.readFileSync("./result.json"));

// Format data to proper form.
const resultWithPosition = result.map((item, i) => ({
  [position]: i + 1,
  [username]: item.username,
  [score]: item.score,
  [tournamentCount]: item.tournamentCount,
}));

// Define headers order.
const fields = [position, username, score, tournamentCount];
const opts = { fields, quote: "" };

// Save to file.
const filename = "./result.csv";
try {
  // Convert to CSV.
  const csv = json2csv.parse(resultWithPosition, opts);
  fs.writeFileSync(filename, csv, "utf8");
  console.log(`CSV generated successfully, saved on file ${filename}`);
} catch (err) {
  console.log("Error trying to convert results to CSV\n", err);
}
