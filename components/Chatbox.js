import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Title from '../components/Title'
import { v4 } from 'uuid'


export default function Chatbox() {
    const selectedItem = useSelector((state) => state.selectedItem)
    const [initState, setInitState] = useState(true)
    const [errorLabel, setErrorLabel] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const scrollableElementRef = useRef(null)


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
        return (
            <div className='flex flex-row px-[5%] py-[1%] bg-gray-700 text-slate-300 cursor-pointer'>
                <Image
                    src={selectedItem.avatar ? `data:image/png;base64, ${selectedItem.avatar}` : ""}
                    width={40}
                    height={40}
                    alt=''
                    className='rounded-full bg-white  cursor-pointer'
                    priority="high"
                ></Image >
                <div className='text-xl mx-[2%] my-auto'>
                    <p>{selectedItem.username}</p>
                </div>
            </div>
        )
    }


    function InputBox() {
        return (
            <form onSubmit={(e) => postMessage(e)}>
                <input
                    type='text'
                    className='flex h-[10%] w-[90%] mx-[5%] mb-[2%] py-[0.4%] px-[1%] justify-self-end bg-gray-700 rounded outline-0 text-slate-300'
                    placeholder='Type a message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoFocus
                />
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
                    (
                        <div className='min-h-[calc(100vh-40px)]'>
                            <div className='h-[10%]'>
                                <ChatBoxHeader />
                            </div>
                            <div className='h-[calc(100vh-160px)] overflow-auto' ref={scrollableElementRef}>
                                <DisplayMessage />
                            </div>
                            <div className='h-[10%]'>
                                <InputBox />
                            </div>
                        </div>

                    )
            }
        </>
    )
}