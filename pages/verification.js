import { useRouter } from 'next/router'
import { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Title from '../components/Title'
import HeadComponent from '../components/HeadComponent'

export default function Verification() {
    const router = useRouter()
    const userInformation = useSelector((state) => state.userInformation)
    const [errorLabel, setErrorLabel] = useState("")
    const [formData, setFormData] = useState({
        email: userInformation.email,
        verificationCode: ""
    })

    function handleChange(e) {
        setFormData(prevData => (
            {
                ...prevData,
                [e.target.name]: e.target.value
            })
        )
    }

    async function processVerificationRequest(e) {
        e.preventDefault()
        try {
            const verificationStatus = await axios.post("/users/verification", formData).then(res => res.data)
            if (verificationStatus.verified) {
                setErrorLabel("")
                localStorage.setItem("token", verificationStatus.token)
                router.push('/chat')
            } else {
                setErrorLabel(`Verification failed. A new verification code is sent to ${formData.email}`)
            }
        } catch (e) {
            setErrorLabel("Failed to set new password. Please try again.")
        }
    }

    return (
        <>
            <HeadComponent />
            <section className='flex flex-col justify-center px-[2%] bg-gray-900 overflow-auto min-h-screen'>
                <div className="flex flex-col items-center justify-center md:h-screen lg:py-0">
                    <Title />
                    <div className="w-full rounded-lg shadow border md:mt-[0%] sm:max-w-md xl:p-0 bg-violet-700 border-gray-700 text-white">
                        <div className="p-[6%] space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl cursor-default">
                                Verify account
                            </h1>
                            <p className="text-sm text-amber-400 font-bold leading-tight tracking-tight cursor-default">
                                A verification code is sent to <u className='cursor-pointer'>{formData.email}</u>
                            </p>
                            <form className="space-y-4 md:space-y-6" onSubmit={(e) => processVerificationRequest(e)}>
                                <div>
                                    <label className="block mb-[2%] text-sm font-medium">Verification Code</label>
                                    <input name="verificationCode" id="verificationCode" value={formData.verificationCode} className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter verification code" required={true} onChange={(e) => handleChange(e)} />
                                </div>
                                <div className='text-amber-400'>
                                    {errorLabel}
                                </div>
                                <button type='submit' className="w-full hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-900 hover:bg-gray-800 focus:ring-white">Submit</button>
                                <hr />
                                <button className="w-full text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-500 hover:bg-gray-800 focus:ring-white hover:text-white" onClick={() => router.push('/login')}>Sign in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}