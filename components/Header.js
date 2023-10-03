import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function Header(props) {
    const router = useRouter()
    const userInformation = useSelector((state) => state.userInformation)
    const [visibility, setVisibility] = useState(false)
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        setAvatar(userInformation.avatar ? `data:image/png;base64, ${userInformation.avatar}` : "")
    }, [userInformation])

    function Menu() {
        setVisibility(prev => !prev)
    }


    function LogOut() {
        localStorage.removeItem("token")
        router.push('/login')
    }

    return (
        <>
            <div
                className='flex flex-row items-center justify-between px-[10%] py-[3%] h-[10%] border-b border-slate-600'
            >
                <Image
                    src={avatar || '/userImage.png'}
                    width={40}
                    height={40}
                    alt=''
                    className='rounded-full bg-white cursor-pointer'
                    priority="high"
                    onClick={props.profile}
                ></Image >
                <div className='flex flex-row w-20 items-center justify-between cursor-pointer text-2xl text-slate-300'>
                    <p
                        className='w-10 mx-[2%] px-[2%] text-center bg-violet-700 rounded-lg transition-transform transform hover:scale-110 focus:outline-none active:scale-100'
                        onClick={props.friendSearch}
                    >&#x002B;</p>
                    <div className='relative'>
                        <span
                            onClick={Menu}
                            className='w-10 mx-[2%] px-[2%] text-center cursor-pointer'
                        >&#x22EE;
                        </span>
                        {visibility &&
                            <div className='absolute my-2 bg-gray-900 block text-slate-300 right-0 z-1 w-fit text-lg'>
                                {/* <p className='hover:bg-violet-700  px-3 py-1'>Settings</p> */}
                                <p className='hover:bg-violet-700  px-3 py-1' onClick={LogOut}>Logout</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}