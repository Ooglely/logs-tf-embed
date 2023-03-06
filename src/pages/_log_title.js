import cheerio from 'cheerio'
import bent from 'bent';

// This gets called on every request
export const getServerSideProps = async (context) => {
    const id = context.query.id;

    const getStream = bent('https://logs.tf')

    let stream = await getStream(id)
    const html = await stream.text()

    var $ = cheerio.load(html);
    var title = $("title").text();
    console.log(title)

    // Pass data to the page via props
    return { props: { title } }
}

function LogTitle({ title }) {
    console.log(title)

    return <div><p>Log Title: {title}</p></div>
}

export default LogTitle