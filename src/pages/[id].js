import Head from 'next/head'
import bent from 'bent'
import { load } from 'cheerio'
import captureWebsite from 'capture-website';
import fs from 'fs';

async function writeLogData(id) {
  const getStream = bent('https://logs.tf/')

    let stream = await getStream(id)
    const html = await stream.text()

    var $ = load(html);
    var title = $("title").text();
    var map = $("#log-map").text();
    var length = $("#log-length").text();
    
    var log_title = title.split(" – logs.tf")[0];
    var log_description = map + " - " + length;
    var log_link = "https://logs.tf/" + id;
    var log_image = 'localhost:3000/logs/img/' + id + '.png';

    await captureWebsite.file(log_link, 'logs/img/' + id + '.png', {
      element: "body > div.container.main",
      removeElements: ["#log-section-teams", "#log-section-rounds", "#log-section-healspread", "#log-section-cvc", "#log-section-footer", "body > div.container.main > footer"],
      inset: {
        top: 150,
        left: 65,
        right: 65,
        bottom: 230
      }
    });

    var log_data = {
      title: log_title,
      description: log_description,
      link: log_link,
      image: log_image
    }

    var log_json = JSON.stringify(log_data);
    console.log(log_json);
    await fs.promises.writeFile('logs/data/' + id + '.json', log_json);
}

export async function getServerSideProps(context) {
  const id = context.query.id;

  if (!fs.existsSync("logs/data/" + id + ".json")) {
    await writeLogData(id);
  }

  var log_data = JSON.parse(fs.readFileSync("logs/data/" + id + ".json"));

  // Pass data to the page via props
  return { 
    props: { 
      title: log_data.title,
      description: log_data.description,
      link: log_data.link,
      image: log_data.image
    } 
  }
}

export default function Home({ title, description, link, image }) {
  return (
    <>
      <Head>
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={link} property="og:url" />
      <meta content={image} property="og:image" />
      <meta content="#444444" data-react-helmet="true" name="theme-color" />
      </Head>
      <div><p>Log Title: {title}</p></div>
      <div><p>Description: {description}</p></div>
      <div><p>Log Link: {link}</p></div>
      <div><p>Log Image: {image}</p></div>
    </>
  )
}
