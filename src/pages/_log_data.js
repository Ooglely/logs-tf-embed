import { useRouter } from 'next/router'

const LogData = () => {
    const router = useRouter();
    const id = router.query.id;

    var log_url = 'https://logs.tf/' + id;

    return <div><p>Post: {id}</p></div>
}

export default LogData