import Image from 'next/image'

const baseURL = process.env.RAILWAY_STATIC_URL || "localhost:3000";

export async function getServerSideProps(context) {
  var id = context.query.id;
  id = id.split('#')[0];

  var img = "/img/" + id + ".png"

  // Pass data to the page via props
  return { 
    props: { 
      img: img
    } 
  }
}

export default function Home({ img }) {
  return <Image src={img} />
}