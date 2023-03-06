import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import LogData from './_log_data'
import LogTitle from './_log_title'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
      <LogTitle/>
    </>
  )
}
