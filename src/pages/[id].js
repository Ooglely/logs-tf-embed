import Head from 'next/head'
import bent from 'bent'
import { load } from 'cheerio'
import { chromium } from 'playwright';
import fs from 'fs';

const baseURL = process.env.RAILWAY_STATIC_URL || "localhost:3000";
const volumePATH = process.env.RAILWAY_VOLUME_MOUNT_PATH || "vol/";

let browserInstance = null;

async function getBrowserInstance() {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--memory-pressure-off'
      ]
    });

    // Handle cleanup on process exit
    process.on('exit', async () => {
      if (browserInstance) {
        await browserInstance.close();
      }
    });

    process.on('SIGTERM', async () => {
      if (browserInstance) {
        await browserInstance.close();
      }
      process.exit(0);
    });
  }
  return browserInstance;
}

async function takeScreenshot(url, outputPath, id) {
  
  const browser = await getBrowserInstance();
  let page = null;
  
  try {

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    page = await context.newPage();
    
    await page.goto(url, { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    // Wait for the specific element
    await page.waitForSelector('#log-section-players', { timeout: 10000 });
    
    // Hide unwanted elements
    const elementsToHide = [
      '#log-section-teams',
      '#log-section-rounds', 
      '#log-section-healspread',
      '#log-section-cvc',
      '#log-section-footer',
      'body > div.container.main > footer'
    ];
    
    for (const selector of elementsToHide) {
      try {
        await page.locator(selector).evaluate(el => el.style.display = 'none');
      } catch (e) {
        // Element might not exist, continue
      }
    }
    
    // Add custom CSS
    await page.addStyleTag({
      path: 'logs.css'
    })
    
    // Take screenshot of the leaderboard
    const element = page.locator('#log-section-players');
    await element.screenshot({ 
      path: outputPath,
      type: 'png'
    });
    
    console.log(`Screenshot saved: ${id}.png`);
    await context.close();
    
  } catch (error) {
    console.error(`Screenshot error for ${id}:`, error);
    throw error;
  }
}

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
  var log_image = "https://" + baseURL + '/img/' + id + '.png';
  
  // Make sure img dir is created
  if (!fs.existsSync(volumePATH + "img/")) {
    await fs.promises.mkdir(volumePATH + "img/");
  }

  if (!fs.existsSync(volumePATH + "img/" + id + ".png")) {
    try {
      await takeScreenshot(log_link, volumePATH + 'img/' + id + '.png', id);
    } catch (error) {
      console.error(`Failed to create screenshot for ${id}:`, error);

      try {
        await fs.promises.unlink(volumePATH + 'img/' + id + '.png');
      } catch (unlinkError) {
        // Ignore if file doesn't exist
      }
      // Continue without screenshot rather than failing completely
    }
  }
  
  var log_data = {
    title: log_title,
    description: log_description,
    link: log_link,
    image: log_image
  }

  var log_json = JSON.stringify(log_data);
  console.log(log_json);
  await fs.promises.writeFile(volumePATH + 'logs/' + id + '.json', log_json);
}

export async function getServerSideProps(context) {

  var id = context.query.id;
  id = id.split('#')[0];

  // If user agent is detected to be a crawler, let the req go through
  // else, redirect to logs page
  const userAgent = context.req.headers['user-agent'] || '';
  // This bot regex is taken from the FixTweet repo, thanks to them
  const isBot = userAgent.match("/bot|facebook|embed|got|firefox\/92|firefox\/38|curl|wget|go-http|yahoo|generator|whatsapp|preview|link|proxy|vkshare|images|analyzer|index|crawl|spider|python|cfnetwork|node/gi|Discordbot") !== null;

  if (!isBot) {
    return {
      redirect: {
        destination: 'https://logs.tf/' + id,
        permanent: true,
      },
    }
  }

  // Make sure logs dir is created
  if (!fs.existsSync(volumePATH + "logs/")) {
    await fs.promises.mkdir(volumePATH + "logs/")
  }

  // If the log data is not already generated, make it!
  // Also if the image doesn't exist it should be regenerated
  if (!fs.existsSync(volumePATH + "logs/" + id + ".json") || !fs.existsSync(volumePATH + "img/" + id + ".png")) {
    await writeLogData(id);
  }

  var log_data = JSON.parse(fs.readFileSync(volumePATH + "logs/" + id + ".json"));

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
      <meta property="og:type" content="website" />
      <meta name="theme-color" content="#444444" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image} />
      </Head>
    </>
  )
}
