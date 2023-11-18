import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from "axios"
import { setUserInformation } from '../slices/userInformationSlice'
import Loading from "../components/Loading"
import Sidebar from '../components/Sidebar'
import Chatbox from '../components/Chatbox'
import HeadComponent from '../components/HeadComponent'


export default function Chat() {
    const router = useRouter()
    const dispatch = useDispatch()
    const userInformation = useSelector((state) => state.userInformation)
    const [userInfo, setUserInfo] = useState(userInformation)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = token

        if (!token) {
            router.push('/login')
        }

        const fetchUserDetails = async function () {
            try {
                const userDetails = await axios.get("/users/me").then(res => res.data)

                if (userDetails.error) {
                    router.push('/login')
                }
                setUserInfo(userDetails)
                dispatch(setUserInformation(userDetails))
            } catch (e) {
                router.push('/login')
            }
        }

        token && !userInfo?._id && fetchUserDetails()
        setIsLoading(false)
        // eslint-disable-next-line
    }, [])

    return (
        <>
            {isLoading
                ?
                (<Loading />)
                :
                (
                    <>
                        <HeadComponent />
                        <section className='bg-gray-900 overflow-auto min-h-screen'>
                            <div className="flex flex-row items-center justify-center divide-x-4 divide-gray-900 mx-[20px] my-[20px]">
                                <div className='w-1/4 bg-gray-700 min-h-[calc(100vh-40px)]'>
                                    <Sidebar />
                                </div>
                                <div className='float-left w-3/4 bg-gray-800 min-h-[calc(100vh-40px)] z-10'>
                                    <Chatbox />
                                </div>
                            </div>
                        </section>
                    </>)
            }
        </>
    )
}