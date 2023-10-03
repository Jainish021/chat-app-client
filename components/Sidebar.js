import { useRouter } from 'next/router'
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import Header from "./Header"
import FriendSearch from './FriendSearch'
import Profile from './Profile'
import { setSelectedItem } from '../slices/selectedItemSlice'

export default function Sidebar() {
    const router = useRouter()
    const dispatch = useDispatch()
    const selectedItem = useSelector((state) => state.selectedItem)
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
                    className='w-[30%] p-[5%] my-auto text-center align-middle bg-violet-700 rounded-lg transition-transform transform hover:scale-110 focus:outline-none active:scale-100'
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
                    className='rounded-full bg-white m-[2%]'
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
        <>
            {
                friendSearchVisibility ?
                    <FriendSearch
                        friendSearch={friendSearch}
                        setFriendSearchVisibility={setFriendSearchVisibility}
                    />
                    :
                    profileVisibility
                        ?
                        <>
                            <Profile
                                profile={profile}
                            />
                        </>
                        :
                        <>
                            <Header
                                friendSearch={friendSearch}
                                profile={profile}
                            />
                            {list.length > 0 ? <Friends /> : <AddFriend />}
                        </>

            }
        </>
    )
}