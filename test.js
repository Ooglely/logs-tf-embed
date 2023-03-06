
//import fetch from 'node-fetch';
//import cheerio from 'cheerio';
const cheerio = require('cheerio');

const log_url = 'https://logs.tf/3349524#76561198171178258';

const bent = require('bent')


async function getLog() {
    const getStream = bent('https://logs.tf')

    let stream = await getStream('/3349524#76561198171178258')
    const html = await stream.text()

    var $ = cheerio.load(html);
    var title = $("title").text();
    console.log(title)
}

getLog();
