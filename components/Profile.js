import Image from 'next/image'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setUserInformation } from '../slices/userInformationSlice'
import axios from 'axios'


export default function Profile(props) {
    const router = useRouter()
    const dispatch = useDispatch()
    const userInformation = useSelector((state) => state.userInformation)
    const [userInfo, setUserInfo] = useState("")
    const [avatar, setAvatar] = useState("")
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)


    useEffect(() => {
        setUserInfo(userInformation)
        setAvatar(userInformation.avatar ? `data:image/png;base64, ${userInformation.avatar}` : "")
    }, [userInformation])


    useEffect(() => {
        setUserInfo(userInfo => ({
            ...userInfo,
            avatar: avatar
        }))
    }, [avatar])


    async function logoutAll() {
        try {
            await axios.post('/users/logoutAll')
            localStorage.removeItem('token')
            router.push('/login')
        } catch (e) {

        }
    }


    async function deleteAccount() {
        if (deleteConfirmation) {
            try {
                const deleteConfirmation = await axios.delete('/users/me').then(res => res.data)
                router.push('/login')
            } catch (e) {
                console.log("Failed to delete account")
            }
        }
    }


    async function HandleFileUpload(file) {
        if (file) {
            const formData = new FormData()
            formData.append('avatar', file)
            try {
                const resData = await axios.post("/users/me/avatar", formData, {
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                }).then(res => res.data)
                setAvatar(`data:image/png;base64, ${resData.avatar}`)
                dispatch(setUserInformation({
                    ...userInfo,
                    avatar: resData.avatar
                }))
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
                <div className="absolute inset-0 flex flex-col items-center text-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer">
                    <Image
                        src='/camera.png'
                        width={30}
                        height={30}
                        alt=''
                    ></Image>
                    <p className="text-violet-700 text-lg font-semibold w-[60%]">Change Profile Photo</p>
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
                        className='ml-[5%]  w-[7%] h-[7%]'
                        alt=''
                    >
                    </Image>
                </div>
                <div
                    className='flex w-[80%] bg-orange-700 text-black rounded mt-[10%] p-[1%] self-center justify-center cursor-pointer transition-transform transform hover:scale-105 focus:outline-none active:scale-100'
                    onClick={() => setDeleteConfirmation(prev => !prev)}
                >
                    <p>Delete Account</p>
                    <Image
                        src={'/delete_icon.png'}
                        width={25}
                        height={10}
                        className='ml-[5%] w-[7%] h-[7%]'
                        alt=''
                    >
                    </Image>
                </div>
                {deleteConfirmation &&
                    <>
                        <p className='text-center m-[2%]'>Are you sure you want to delete your account permenantely?</p>
                        <div className='flex justify-center mt-[5%] text-center'>
                            <div
                                className='w-[10%] bg-orange-700 text-black rounded mr-[2%] p-[1%] cursor-pointer transition-transform transform hover:scale-105 focus:outline-none active:scale-100'
                                onClick={deleteAccount}
                            >
                                <p>Yes</p>
                            </div>
                            <div
                                className='w-[10%] bg-orange-700 text-black rounded ml-[2%] p-[1%] cursor-pointer transition-transform transform hover:scale-105 focus:outline-none active:scale-100'
                                onClick={() => setDeleteConfirmation(prev => !prev)}
                            >
                                <p>No</p>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}