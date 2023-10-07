import Image from 'next/image'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setFriendProfileVisibility } from '../slices/friendProfileVisibilitySlice'


export default function Profile(props) {
    const dispatch = useDispatch()

    function FormatTimestamp() {
        const timestamp = new Date(props.selectedItem.createdAt)

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }

        const formattedDate = timestamp.toLocaleDateString('en-US', options)
        return (<p>{formattedDate}</p>)
    }

    return (
        <div>
            <p
                className='text-slate-300 text-center text-4xl ml-[2%] font-bold w-[10%] cursor-pointer transition-transform transform hover:scale-110 focus:outline-none active:scale-100'
                onClick={() => dispatch(setFriendProfileVisibility({ isVisible: false }))}
            >
                &larr;
            </p>
            <div className='w-[60%] flex mx-auto justify-center mb-[5%] group relative'>
                <Image
                    src={props.selectedItem.avatar ? `data:image/png;base64, ${props.selectedItem.avatar}` : '/userImage.png'}
                    width={130}
                    height={130}
                    alt=''
                    className='rounded-full bg-white m-[2%] w-auto h-auto cursor-pointer'
                    loading="lazy"
                ></Image >
            </div>
            <div className='flex flex-col text-slate-300 px-[5%] py-[2%]'>
                <p className='text-violet-700 text-lg font-bold	'>Username</p>
                <p>{props.selectedItem.username}</p>
                <p className='text-violet-700 text-lg font-bold	'>Email</p>
                <p>{props.selectedItem.email}</p>
                <p className='text-violet-700 text-lg font-bold	'>Member since</p>
                <FormatTimestamp />
            </div>
        </div>
    )
}