import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from "axios"
import { setUserInformation } from '../slices/userInformationSlice'
import { setDeviceScreenWidth } from '../slices/deviceScreenWidthSlice'
import Loading from "../components/Loading"
import Sidebar from '../components/Sidebar'
import Chatbox from '../components/Chatbox'
import HeadComponent from '../components/HeadComponent'


export default function Chat() {
    const router = useRouter()
    const dispatch = useDispatch()
    const userInformation = useSelector((state) => state.userInformation)
    const selectedItem = useSelector((state) => state.selectedItem)
    const [userInfo, setUserInfo] = useState(userInformation)
    const [isLoading, setIsLoading] = useState(true)
    const [screenWidth, setScreenWidth] = useState(0)

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
        setScreenWidth(window.innerWidth)
        dispatch(setDeviceScreenWidth({ width: window.innerWidth }))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth)
            dispatch(setDeviceScreenWidth({ width: window.innerWidth }))
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    function HomePage() {
        if (isLoading) {
            return (
                <Loading />
            )
        } else {
            if (screenWidth >= process.env.NEXT_PUBLIC_MOBILE_SCREEN_WIDTH) {
                return (
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
                    </>
                )
            } else {
                if (selectedItem?._id) {
                    return (
                        <>
                            <HeadComponent />
                            <div className='min-w-screen bg-gray-800 min-h-screen'>
                                <Chatbox />
                            </div>
                        </>
                    )
                } else {
                    return (
                        <>
                            <HeadComponent />
                            <div className='bg-gray-900 overflow-clip'>
                                <div className='min-w-screen bg-gray-700 min-h-screen'>
                                    <Sidebar />
                                </div>
                            </div>
                        </>
                    )
                }
            }
        }
    }

    return (
        <HomePage />
    )
}