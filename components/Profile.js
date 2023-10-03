import Image from 'next/image'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'


export default function Profile(props) {
    const router = useRouter()
    const userInformation = useSelector((state) => state.userInformation)
    const [userInfo, setUserInfo] = useState("")
    const [avatar, setAvatar] = useState("")


    useEffect(() => {
        setUserInfo(userInformation)
        setAvatar(userInformation.avatar ? `data:image/png;base64, ${userInformation.avatar}` : "")
    }, [userInformation])


    async function logoutAll() {
        try {
            await axios.post('/users/logoutAll')
            localStorage.removeItem('token')
            router.push('/login')
        } catch (e) {

        }
    }

    async function HandleFileUpload(file) {
        if (file) {
            console.log(file)
            const formData = new FormData()
            formData.append('avatar', file)
            try {
                const resData = await axios.post("/users/me/avatar", formData, {
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                }).then(res => res.data)
                setAvatar(`data:image/png;base64, ${resData.avatar}`)
            } catch (e) {
                console.log("File upload failed.")
            }
        }
    }

    return (
        <div>
            <p
                className='text-slate-300 text-center text-4xl ml-[2%] font-bold w-[10%] cursor-pointer transition-transform transform hover:scale-110 focus:outline-none active:scale-100'
                onClick={props.profile}
            >
                &larr;
            </p>
            <div className='w-[60%] flex mx-auto justify-center mb-[5%] group relative'>
                <Image
                    src={avatar || '/userImage.png'}
                    width={130}
                    height={130}
                    alt=''
                    className='rounded-full bg-white m-[2%] w-auto h-auto group-hover:blur-sm transition duration-300 ease-in-out cursor-pointer'
                    loading="lazy"
                ></Image >
                <input
                    type="file"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={(event) => HandleFileUpload(event.target.files[0])}
                    className='opacity-0 absolute w-[100%] h-[100%] z-10 cursor-pointer'
                />
                <div class="absolute inset-0 flex flex-col items-center text-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer">
                    <Image
                        src='/camera.png'
                        width={30}
                        height={30}
                        alt=''
                    ></Image>
                    <p class="text-violet-700 text-lg font-semibold w-[60%]">Change Profile Photo</p>
                </div>

            </div>
            <div className='flex flex-col text-slate-300 px-[5%] py-[2%]'>
                <p className='text-violet-700 text-lg font-bold	'>Username</p>
                <p>{userInfo.username}</p>
                <p className='text-violet-700 text-lg font-bold	'>Email</p>
                <p>{userInfo.email}</p>
                <div
                    className='flex w-[80%] bg-amber-400 text-black rounded mt-[10%] p-[1%] self-center justify-center cursor-pointer transition-transform transform hover:scale-105 focus:outline-none active:scale-100'
                    onClick={logoutAll}
                >
                    <p>Sign out from all devices</p>
                    <Image
                        src={'/logout_icon.png'}
                        width={20}
                        height={20}
                        className='ml-[2%]'
                        alt=''
                    >
                    </Image>
                </div>
            </div>
        </div>
    )
}