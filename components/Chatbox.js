import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedItem } from '../slices/selectedItemSlice'
import { setFriendProfileVisibility } from '../slices/friendProfileVisibilitySlice'
import FriendProfile from './FriendProfile'
import axios from 'axios'
import EmojiPicker from 'emoji-picker-react'
import Title from '../components/Title'
import { v4 } from 'uuid'
import io from 'socket.io-client'


export default function Chatbox() {
    const dispatch = useDispatch()
    const selectedItem = useSelector((state) => state.selectedItem)
    const screenWidth = useSelector((state) => state.deviceScreenWidth.width)
    const friendProfileVisibility = useSelector((state) => state.friendProfileVisibility)
    const [desktopScreen, setDesktopScreen] = useState(true)
    const [initState, setInitState] = useState(true)
    const [errorLabel, setErrorLabel] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [socket, setSocket] = useState(false)
    const [messages, setMessages] = useState([])
    const [emojiPicker, setEmojiPicker] = useState(false)
    const [scrollButton, setScrollButton] = useState(false)
    const [mobileFriendProfileVisibility, setMobileFriendProfileVisibility] = useState(false)
    const scrollableElementRef = useRef(null)

    useEffect(() => {
        if (!desktopScreen && screenWidth >= process.env.NEXT_PUBLIC_MOBILE_SCREEN_WIDTH) {
            setDesktopScreen(true)
        } else if (desktopScreen && screenWidth < process.env.NEXT_PUBLIC_MOBILE_SCREEN_WIDTH) {
            setDesktopScreen(false)
        }
    }, [screenWidth])

    function createSocket() {
        const socketInfo = io.connect(process.env.NEXT_PUBLIC_DESTINATION, {
            query: {
                token: localStorage.getItem('token'),
            },
        })
        setSocket(socketInfo)
        socketInfo.emit('message', "Hello")
    }

    useEffect(() => {
        !socket && createSocket()
    }, [])

    function listenMessages() {
        socket.on('message', (data) => {
            data = JSON.parse(data)
            setMessages(prevMessages => [...prevMessages, data])
        })
    }

    useEffect(() => {
        socket && listenMessages()
    }, [socket])

    useEffect(() => {
        if (selectedItem?._id) {
            setInitState(false)
            fetchMessages()
        }
        // eslint-disable-next-line
    }, [selectedItem])


    useEffect(() => {
        DisplayMessage()
        scrollToBottom()
        // eslint-disable-next-line
    }, [messages])


    function scrollToBottom() {
        if (scrollableElementRef.current) {
            scrollableElementRef.current.scrollTop = scrollableElementRef.current.scrollHeight
        }
    }

    function displayScrollToBottomButton() {
        scrollableElementRef.current && scrollableElementRef.current.scrollHeight - scrollableElementRef.current.scrollTop > 800 ? setScrollButton(true) : setScrollButton(false)
    }


    async function fetchMessages() {
        setErrorLabel("")
        try {
            const fetchData = await axios.post('/chats/getMessages', { receiverId: selectedItem._id }).then(res => res.data)
            setMessages(fetchData)
        } catch (e) {
            setErrorLabel("Failed to fetch latest messages.")
        }
    }


    function getMessageTime(timestamp) {
        const messageDate = new Date(timestamp)
        const currentDate = new Date()

        if (
            messageDate.getDate() === currentDate.getDate() &&
            messageDate.getMonth() === currentDate.getMonth() &&
            messageDate.getFullYear() === currentDate.getFullYear()
        ) {
            return 'Today'
        }

        const yesterday = new Date(currentDate)
        yesterday.setDate(currentDate.getDate() - 1)
        if (
            messageDate.getDate() === yesterday.getDate() &&
            messageDate.getMonth() === yesterday.getMonth() &&
            messageDate.getFullYear() === yesterday.getFullYear()
        ) {
            return 'Yesterday'
        }

        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return messageDate.toLocaleDateString(undefined, options)
    }


    function timeFormatter(timestamp) {
        const date = new Date(timestamp)

        const hours = date.getHours() % 12 || 12
        const minutes = date.getMinutes()
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM'

        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`

        return <p className='text-xs self-end ml-3'>{formattedTime}</p>
    }


    function DisplayMessage() {
        if (messages.length > 0) {
            const formattedMessages = []
            let prevDate = ""
            let prevMessageSender = ""

            for (let i = 0; i < messages.length; i++) {
                const message = messages[i]
                const messageClass = message?.senderId === selectedItem._id ? "bg-gray-900" : "bg-gray-700 self-end"
                const marginTop = prevMessageSender === message.senderId ? "mt-[0.25%]" : "mt-[0.5%]"
                const messageDate = getMessageTime(message.createdAt)

                formattedMessages.push(
                    <div className='flex flex-col' key={message._id}>
                        {messageDate !== prevDate ? <p className='self-center bg-violet-700 text-sm px-2 rounded mt-[1%]'>{messageDate}</p> : ""}
                        <div className='flex flex-col'>
                            <div className={`flex w-fit px-[1%] rounded mx-[0.5%] ${marginTop} ${messageClass}`}>
                                {/* <span className='w-2 bg-gray-900'>"</span> */}
                                <p className="text-base py-[2%]">{message.message}</p>
                                {timeFormatter(message.createdAt)}
                            </div>
                        </div>
                    </div>
                )
                prevDate = messageDate
                prevMessageSender = message.senderId
            }


            return (
                <div>
                    <div className='my-[2%] px-[5%] text-slate-300 overflow-y-auto'>
                        {formattedMessages}
                    </div>
                    <div
                        className='text-center text-amber-400'>
                        {errorLabel}
                    </div>
                </div>
            )
        }
    }


    async function postMessage(e) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = token
        setErrorLabel("")
        const msg = {
            message: newMessage,
            receiverId: selectedItem._id
        }

        try {
            const status = await axios.post('/chats/postMessage', msg).then(res => res.data)
            if (!status.error) {
                const msgLocal = {
                    message: newMessage,
                    senderId: "",
                    seen: false,
                    _id: v4(),
                    createdAt: new Date().toISOString(),
                }
                setMessages(prevMessages => [...prevMessages, msgLocal])
                scrollToBottom()
                setNewMessage("")
            } else {
                setErrorLabel("Could not deliver message. Please try again.")
            }
        } catch (e) {

        }
    }


    function ChatBoxHeader() {
        if (screenWidth < process.env.NEXT_PUBLIC_MOBILE_SCREEN_WIDTH) {
            return (
                <div className='flex flex-row px-[2%] py-[2%] bg-gray-700 text-slate-300 cursor-pointer'>
                    <p
                        className='mr-[5%] text-slate-300 text-center text-4xl font-bold w-[10%] transition-transform transform hover:scale-110 focus:outline-none active:scale-100'
                        onClick={() => dispatch(setSelectedItem({}))}
                    >
                        &larr;
                    </p>
                    <div
                        className='flex'
                        onClick={() => setMobileFriendProfileVisibility(true)}
                    >
                        <Image
                            src={selectedItem.avatar ? `data:image/png;base64, ${selectedItem.avatar}` : '/userImage.png'}
                            width={40}
                            height={40}
                            alt=''
                            className='rounded-full bg-white  cursor-pointer'
                            priority="high"
                        ></Image >
                        <div className='text-xl mx-[5%] my-auto'>
                            <p>{selectedItem.username}</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    className='flex flex-row px-[5%] py-[1%] bg-gray-700 text-slate-300 cursor-pointer'
                    onClick={() => dispatch(setFriendProfileVisibility({ isVisible: true }))}
                >
                    <Image
                        src={selectedItem.avatar ? `data:image/png;base64, ${selectedItem.avatar}` : '/userImage.png'}
                        width={40}
                        height={40}
                        alt=''
                        className='rounded-full bg-white  cursor-pointer'
                        priority="high"
                    ></Image >
                    <div className='text-xl mx-[5%] my-auto'>
                        <p>{selectedItem.username}</p>
                    </div>
                </div>
            )
        }
    }

    function addEmoji(e) {
        setEmojiPicker(false)
        setNewMessage(prevValue => prevValue + e.emoji)
    }

    function InputBox() {
        return (
            <form className='relative flex bg-gray-800 ' onSubmit={(e) => postMessage(e)}>

                {
                    desktopScreen
                    &&
                    <Image
                        src={'/emoji_icon.png'}
                        width={20}
                        height={20}
                        alt=''
                        className='cursor-pointer bg-gray-900 rounded h-fit w-fit ml-[2%] mt-[0.5%] p-[0.6%] transition-transform transform hover:scale-110 focus:outline-none active:scale-100'
                        priority="high"
                        onClick={() => setEmojiPicker(prevValue => !prevValue)}
                    ></Image >
                }
                {
                    desktopScreen
                    &&
                    emojiPicker
                    &&
                    <div className='absolute bottom-0'>
                        <EmojiPicker theme='dark' onEmojiClick={(e) => addEmoji(e)} />
                    </div>
                }
                <input
                    type='text'
                    className={desktopScreen ? 'flex h-12 w-[80%] ml-[2%] mr-[5%] my-[0.5%] py-[0.4%] px-[1%] justify-self-end bg-gray-900 rounded outline-0 text-slate-300' : 'flex h-12 w-[90%] ml-[5%] mr-[5%] my-[0.5%] py-[0.4%] px-[1%] justify-self-end bg-gray-900 rounded outline-0 text-slate-300'}
                    placeholder='Type a message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoFocus
                />

                {
                    scrollButton
                    &&
                    <Image
                        src={'/down-arrow.svg'}
                        width={10}
                        height={10}
                        alt=''
                        className='cursor-pointer bg-gray-900 rounded-full w-8 h-8 mr-[2%] mt-[0.5%] p-[0.6%] transition-transform transform hover:scale-110 focus:outline-none active:scale-100'
                        priority="high"
                        onClick={scrollToBottom}
                    ></Image >
                }
            </form>
        )
    }


    return (
        <>
            {
                initState
                    ?
                    (
                        <div className='flex min-h-[calc(100vh-40px)] justify-center'>
                            <Title />
                        </div>
                    ) :
                    mobileFriendProfileVisibility
                        ?
                        (
                            < div className={mobileFriendProfileVisibility ? 'duration-300 ease-in transition-all' : 'absolute duration-300 ease-out transition-all right-0 top-0 translate-x-full z-0 opacity-0'}>
                                <FriendProfile
                                    selectedItem={selectedItem}
                                    mobileFriendProfileVisibility={mobileFriendProfileVisibility}
                                    setMobileFriendProfileVisibility={setMobileFriendProfileVisibility}
                                />
                            </div>
                        )
                        :
                        (
                            <div className={'min-h-[calc(100vh-40px)]' && !mobileFriendProfileVisibility ? 'duration-300 ease-in transition-all' : 'absolute duration-300 ease-out transition-all right-0 top-0 translate-x-full z-0 opacity-0'}>
                                <div className='h-[10%]' onClick={() => setEmojiPicker(false)}>
                                    <ChatBoxHeader />
                                </div>
                                <div
                                    className={desktopScreen ? 'h-[calc(100vh-170px)] overflow-auto' : 'h-[calc(100vh-120px)] overflow-auto'}
                                    ref={scrollableElementRef}
                                    onClick={() => setEmojiPicker(false)}
                                    onScroll={displayScrollToBottomButton}
                                >
                                    <DisplayMessage />
                                </div>
                                <div className='h-[10%]'>
                                    <InputBox />
                                </div>
                            </div >
                        )
            }
        </>
    )
}