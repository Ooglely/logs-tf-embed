import { useRouter } from 'next/router'

const LogData = () => {
    const router = useRouter();
    const id = router.query.id;

    var log_url = 'https://logs.tf/' + id;
    var log_title;

    return <div><p>Post: {id}</p><p>Log Title: {log_title}</p></div>
}

export default LogData