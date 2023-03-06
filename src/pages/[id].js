import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import LogData from './_log_data'
import bent from 'bent'
import { load } from 'cheerio'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(context) {
  const id = context.query.id;

  const getStream = bent('https://logs.tf/')

  let stream = await getStream(id)
  const html = await stream.text()

  var $ = load(html);
  var title = $("title").text();
  console.log(title)

  // Pass data to the page via props
  return { props: { log_title: title } }
}

export default function Home({ log_title }) {
  return (
    <>
      <Head>
      <meta content="<put log title here>" property="og:title" />
      <meta content="<put map title here>" property="og:description" />
      <meta content="<put log link here>" property="og:url" />
      <meta content="<put log image here>" property="og:image" />
      <meta content="#444444" data-react-helmet="true" name="theme-color" />
      </Head>
      <LogData/>
      <div><p>Log Title: {log_title}</p></div>
    </>
  )
}
