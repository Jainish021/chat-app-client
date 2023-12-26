import { useRouter } from 'next/router'
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import Header from "./Header"
import FriendSearch from './FriendSearch'
import Profile from './Profile'
import FriendProfile from './FriendProfile'
import { setSelectedItem } from '../slices/selectedItemSlice'

export default function Sidebar() {
    const router = useRouter()
    const dispatch = useDispatch()
    const selectedItem = useSelector((state) => state.selectedItem)
    const screenWidth = useSelector((state) => state.deviceScreenWidth.width)
    const friendProfileVisibility = useSelector((state) => state.friendProfileVisibility)
    const [friendSearchVisibility, setFriendSearchVisibility] = useState(false)
    const [profileVisibility, setProfileVisibility] = useState(false)
    const [list, setList] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = token

        if (!token) {
            router.push('/login')
        }

        const fetchList = async () => {
            try {
                const res = await axios.get("/friends").then(res => res.data)
                if (res.error) {
                    router.push('/login')
                }
                setList(res)
            } catch (e) {
                router.push('/login')
            }
        }

        token && !friendSearchVisibility && fetchList()
        // eslint-disable-next-line
    }, [friendSearchVisibility])

    function friendSearch() {
        setFriendSearchVisibility(prev => !prev)
    }


    function profile() {
        setProfileVisibility(prev => !prev)
    }


    function AddFriend() {
        return (
            <div className="flex flex-col min-h-[calc(100vh-120px)] items-center text-slate-300">
                <p
                    className='w-[30%] p-[5%] my-auto text-center align-middle bg-violet-700 rounded-lg transition-transform transform hover:scale-110 focus:outline-none active:scale-100 cursor-pointer'
                    onClick={friendSearch}
                >Add Friends</p>
            </div>
        )
    }

    function selectChat(item) {
        if (item?._id !== selectedItem._id) {
            dispatch(setSelectedItem(item))
        }
    }

    function Friends() {
        const friendsList = list.map(listItem => (
            <div
                key={listItem._id}
                className={`flex flex-row px-[5%] py-[1%] ${selectedItem?._id === listItem._id ? "bg-gray-800" : "bg-gray-700"} focus:bg-gray-800 text-slate-300 border-b border-slate-600 cursor-pointer`}
                onClick={() => selectChat(listItem)
                }
            >
                <Image
                    src={listItem.avatar ? `data:image/png;base64, ${listItem.avatar}` : '/userImage.png'}
                    width={40}
                    height={30}
                    alt=''
                    className='rounded-full bg-white m-[2%] w-[10%] h-[10%]'
                    loading="lazy"
                ></Image >
                <div className='text-xl mx-[10%] my-auto'>
                    <p>{listItem.username}</p>
                </div>
            </div >
        ))

        return (
            friendsList
        )
    }

    return (
        <div className='relative'>
            <div className={((friendSearchVisibility || profileVisibility || friendProfileVisibility.isVisible) && 'absolute duration-300 ease-out transition-all top-0 right-0 translate-x-full z-0 opacity-0') || 'duration-300 left-0 bottom-0 ease-in transition-all'}>
                <Header
                    friendSearch={friendSearch}
                    profile={profile}
                />
                {list.length > 0 ? <Friends /> : <AddFriend />}
            </div>

            <div className={!friendProfileVisibility.isVisible && friendSearchVisibility ? 'duration-300 ease-in transition-all' : 'absolute duration-300 ease-out transition-all right-0 top-0 translate-x-full z-0 opacity-0'}>
                <FriendSearch
                    friendSearch={friendSearch}
                    setFriendSearchVisibility={setFriendSearchVisibility}
                />
            </div>
            <div className={!friendProfileVisibility.isVisible && profileVisibility ? 'duration-300 ease-in transition-all' : 'absolute duration-300 ease-out transition-all right-0 top-0 translate-x-full z-0 opacity-0'}>
                <Profile
                    profile={profile}
                />
            </div>

            {
                screenWidth >= process.env.NEXT_PUBLIC_MOBILE_SCREEN_WIDTH
                &&
                < div className={friendProfileVisibility.isVisible ? 'duration-300 ease-in transition-all' : 'absolute duration-300 ease-out transition-all right-0 top-0 translate-x-full z-0 opacity-0'}>
                    <FriendProfile
                        selectedItem={selectedItem}
                    />
                </div>
            }
        </div >
    )
}