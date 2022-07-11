const json1 = require('./sportico_raw/json.json');
const json2 = require('./sportico_raw/json2.json');
const json3 = require('./sportico_raw/json3.json');
const json4 = require('./sportico_raw/json4.json');
const dictionaries = require('./sportico_raw/dictionaries');
const sports = dictionaries.sports;
const nicknames = dictionaries.nicknames;
const conferences = dictionaries.conferences;
const ObjectsToCsv = require('objects-to-csv');

const rows = [];
console.log(json4);

for (const json of [json1, json2, json3, json4]) {
    const list = json[0];

    for(const school of Object.keys(list)) {
        const years = Object.keys(list[school]);
        //console.log(school, years);
        for (const year of years) {
            const row = {
                school, 
                nickname: nicknames[school],
                conference: conferences[school],
                year,
            };
    
            const sportsList = list[school][year]['Revenues'];
            
            for (const sport of sports) {
                row[sport] = sportsList[sport] || null;
            }
            //console.log(row);
            rows.push(row);
        }
    }
}

async function writeToDisk() {
    const csv = new ObjectsToCsv(rows);
    await csv.toDisk('./sportico.csv');
}
writeToDisk();
