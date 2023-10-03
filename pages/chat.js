import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux'
import { setUserInformation } from '../slices/userInformationSlice'
import io from 'socket.io-client'
import Loading from "../components/Loading"
import Sidebar from '../components/Sidebar'
import Chatbox from '../components/Chatbox'
import HeadComponent from '../components/HeadComponent'


export default function Chat() {
    const router = useRouter()
    const dispatch = useDispatch()
    // const socket = io.connect(process.env.PORT || ':3001')
    // socket.on('message', (data) => {
    //     console.log('Received message from server:', data);
    // })
    // socket.emit('message')
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
                                <div className='float-left w-3/4 bg-gray-800 min-h-[calc(100vh-40px)]'>
                                    <Chatbox />
                                </div>
                            </div>
                        </section>
                    </>)
            }
        </>
    )
}


// export default function Chat() {
//     return (
//         <>
//             <Head>
//                 <title>Chat App</title>
//                 <Link rel="icon" href="/img/favicon.png" />
//                 <Link rel="stylesheet" href="/css/styles.min.css" />
//             </Head>

//             <div class="chat">
//                 <div id="sidebar" class="chat__sidebar">
//                 </div>
//                 <div class="chat__main">
//                     <div id="messages" class="chat__messages"> </div>
//                     <div class="compose">
//                         <form id="message-form">
//                             <input name="message" placeholder="Message" required autocomplete="off" />
//                             <button>Send</button>
//                         </form>
//                         <button id="send-location">
//                             Share Location
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <script id="message-template" type="text/html">
//                 <div class="message">
//                     <p>
//                         <span class="message__name">{{ username }}</span>
//                         <span class="message__meta">{{ createdAt }}</span>
//                     </p>
//                     <p>{{ message }}</p>
//                 </div>
//             </script>

//             <script id="location-template" type="text/html">
//                 <div class="message">
//                     <p>
//                         <span class="message__name">{{ username }}</span>
//                         <span class="message__meta">{{ createdAt }}</span>
//                     </p>
//                     <p><a href={{ url }}>My Current Location</a></p>
//                 </div>
//             </script>

//             <script id="sidebar-template" type="text/html">
//                 <h2 class="room-title">{{ room }}</h2>
//                 <h3 class="list-title">Users</h3>
//                 <ul class="users">
//                     {{ #users}}
//                     <li>{{ username }}</li>
//                     {{/ users}}
//                 </ul>
//             </script>

//             <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js"></script>
//             <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
//             <script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.6.0/qs.min.js"></script>
//             <script src=" /socket.io/socket.io.js"></script>
//             <script src="/js/chat.js"></script>
//         </>
//     )
// }