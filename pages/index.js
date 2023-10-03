import { useRouter } from 'next/router'
import { useEffect } from "react"

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push('/login')
        } else {
            router.push("/chat")
        }
        // eslint-disable-next-line
    }, [])
}