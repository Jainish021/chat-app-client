import Image from 'next/image'

export default function Title() {
    return (
        <div className="flex items-center mb-[2%] cursor-pointer">
            <Image
                src='/icon.png'
                width={100}
                height={100}
                alt=''
                loading='lazy'
                className='px-[2%]'
            ></Image>
            <h1 className='text-6xl px-[2%] font-semibold text-white'> Howdy</h1>
            {/* <a target="_blank" href="https://icons8.com/icon/g3YMw7LYW7Kp/chat">Chat</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
        </div>
    )
}