const axios = require('axios');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

async function scrapePage() {
  const html = await axios.get('https://sports.usatoday.com/ncaa/finances/');
  const $ = await cheerio.load(html.data);
  let test = "test";
  const tds = $('td[data-passid]');
  let ids = $(tds).map((index, node) => {
    return $(node).attr('data-passid');
  }).get();
  ids = [...new Set(ids)];
  console.log(ids);

  const rows = [];

  for(const id of ids) {
    const {data} = await axios.get(`https://sports.usatoday.com/ajaxservice/ncaa/finances__school__${id}`);
    for (let i = 0; i < data.expenses_rows.length; i++) {
      const row = {
        name: data.profile.school_name,
        conference: data.profile.conference,
        logo: data.profile.logo,
        id: data.position,
      }
      for (const key in data.expenses_rows[i]) {
        if (key === 'other') {
          row[`${key}_expenses`] = data.expenses_rows[i][key].value;
        } else {
          row[key] = data.expenses_rows[i][key].value;
        }
      }

      for (const key in data.revenues_rows[i]) {
        if (key === 'other') {
          row[`${key}_revenues`] = data.revenues_rows[i][key].value;
        } else {
          row[key] = data.revenues_rows[i][key].value;
        }
      }

      row.json = JSON.stringify(data);
      rows.push(row);
    }
  }

  const csv = new ObjectsToCsv(rows);
  await csv.toDisk('./college_finance.csv');
}

scrapePage();