import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserInformation } from '../slices/userInformationSlice'
import Title from '../components/Title'
import HeadComponent from '../components/HeadComponent'

export default function forgotPassword() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [errorLabel, setErrorLabel] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        temporaryPassword: "",
        password: "",
        password2: ""
    })
    const [requestStatus, setRequestStatus] = useState(false)

    function handleChange(e) {
        setFormData(prevData => (
            {
                ...prevData,
                [e.target.name]: e.target.value
            })
        )
    }

    async function processRequest(e) {
        e.preventDefault()
        try {
            await axios.post("users/forgotPassword", { "email": formData.email }).then(res => res.data)
            setErrorLabel("")
            setRequestStatus(true)
        } catch (e) {
            setErrorLabel(`Failed to to send temporary password to ${formData.email}`)
        }
    }

    async function processPasswordChange(e) {
        e.preventDefault()
        if (formData.password !== formData.password2) {
            setErrorLabel("Passwords do no match.")
            return
        } else if (formData.password.includes(" ")) {
            setErrorLabel("Password can not contain space.")
            return
        } else if (formData.password.length < 7) {
            setErrorLabel("Password must be longer than 7 characters.")
            return
        }

        try {
            const userDetails = await axios.post("/users/changePassword", formData).then(res => res.data)
            setErrorLabel("")
            router.push('/login')
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
                                Reset password
                            </h1>
                            {
                                !requestStatus ?
                                    (
                                        <>
                                            <form className="space-y-4 md:space-y-6" onSubmit={(e) => processRequest(e)}>
                                                <div>
                                                    <label htmlFor="email" className="block mb-[2%] text-sm font-medium">Enter Registered Email</label>
                                                    <input type="email" name="email" id="email" value={formData.email} className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" required={true} onChange={(e) => handleChange(e)} />
                                                </div>
                                                <div className='text-amber-400'>
                                                    {errorLabel}
                                                </div>
                                                <button type='submit' className="w-full hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-900 hover:bg-gray-800 focus:ring-white">Request</button>
                                                <hr />
                                                <button className="w-full text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-500 hover:bg-gray-800 focus:ring-white hover:text-white" onClick={() => router.push('/login')}>Sign in</button>
                                            </form>
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <p className="text-sm text-amber-400 font-bold leading-tight tracking-tight cursor-default">
                                                A temporary password is sent to <u className='cursor-pointer'>{formData.email}</u>
                                            </p>
                                            <form className="space-y-4 md:space-y-6" onSubmit={(e) => processPasswordChange(e)}>
                                                <div>
                                                    <label className="block mb-[2%] text-sm font-medium">Temporary Password</label>
                                                    <input name="temporaryPassword" id="temporaryPassword" value={formData.temporaryPassword} className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter temporary password" required={true} onChange={(e) => handleChange(e)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="block mb-[2%] text-sm font-medium">New Password</label>
                                                    <input type="password" name="password" id="password" value={formData.password} placeholder="••••••••" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" required={true} onChange={(e) => handleChange(e)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="block mb-[2%] text-sm font-medium">Confirm New Password</label>
                                                    <input type="password" name="password2" id="password2" value={formData.password2} placeholder="••••••••" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" required={true} onChange={(e) => handleChange(e)} />
                                                </div>
                                                <div className='text-amber-400'>
                                                    {errorLabel}
                                                </div>
                                                <button type='submit' className="w-full hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-900 hover:bg-gray-800 focus:ring-white">Submit</button>
                                                <hr />
                                                <button className="w-full text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-500 hover:bg-gray-800 focus:ring-white hover:text-white" onClick={() => router.push('/login')}>Sign in</button>
                                            </form>
                                        </>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}