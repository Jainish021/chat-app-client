import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import { setSharedData } from '../slices/sharedDataSlice'
import axios from "axios"
import Loading from "../components/Loading"
import HeadComponent from '../components/HeadComponent'
import Title from '../components/Title'


export default function Registration() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [errorLabel, setErrorLabel] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: ""
    })


    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = token
        const fetchUser = async () => {
            try {
                const userDetails = await axios.get("/users/me").then(res => res.data)
                dispatch(setSharedData(userDetails))
                router.push("/chat")
            } catch (e) {
                setIsLoading(false)
            }
        }
        token ? fetchUser() : setIsLoading(false)
        // eslint-disable-next-line
    }, [])


    function handleChange(e) {
        setFormData(prevData => (
            {
                ...prevData,
                [e.target.name]: e.target.value
            })
        )
    }


    async function processRegistration(e) {
        e.preventDefault()
        const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g
        if (formData.username.includes(" ")) {
            setErrorLabel("Username can not contain space.")
            return
        } else if (formData.username) {
            const username = await axios.post("/users/username", { "username": formData.username }).then(res => res.data)
            if (username.error) {
                setErrorLabel(username.error)
                return
            }
        } else if (!regEx.test(formData.email)) {
            setErrorLabel("Invalid email!")
            return
        } else if (formData.password !== formData.password2) {
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
            const userDetails = await axios.post("/users", formData).then(res => res.data)
            localStorage.setItem("token", userDetails.token)
            if (userDetails.error) {
                throw new Error()
            }
            setErrorLabel("")
            dispatch(setSharedData(userDetails.user))
            router.push('/chat')
        } catch (e) {
            setErrorLabel("User already exists! Try logging in.")
        }
    }


    return (
        <>
            {isLoading
                ?
                (<Loading />)
                :
                (
                    <>
                        <HeadComponent />
                        <section className='flex flex-col justify-center px-[2%] bg-gray-900 overflow-auto min-h-screen'>
                            <div className="flex flex-col items-center justify-center md:h-screen lg:py-0">
                                <Title />
                                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-violet-700 border-gray-700 cursor-default text-white">
                                    <div className="p-[6%] space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                                            Register your account
                                        </h1>
                                        <form className="space-y-4 md:space-y-6" onSubmit={(e) => { processRegistration(e) }}>
                                            <div>
                                                <label htmlFor="username" className="block mb-[2%] text-sm font-medium">Username</label>
                                                <input type="username" name="username" id="username" value={formData.username} className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your username" required={true} onChange={(e) => handleChange(e)} />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-[2%] text-sm font-medium">Email</label>
                                                <input type="email" name="email" id="email" value={formData.email} className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" required={true} onChange={(e) => handleChange(e)} />
                                            </div>
                                            <div>
                                                <label htmlFor="password" className="block mb-[2%] text-sm font-medium">Password</label>
                                                <input type="password" name="password" id="password" value={formData.password} placeholder="••••••••" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" required={true} onChange={(e) => handleChange(e)} />
                                            </div>
                                            <div>
                                                <label htmlFor="password2" className="block mb-[2%] text-sm font-medium">Re-enter Password</label>
                                                <input type="password" name="password2" id="password2" value={formData.password2} placeholder="••••••••" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-[2.5%] bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" required={true} onChange={(e) => handleChange(e)} />
                                            </div>
                                            <div>
                                                <label className='text-amber-400'>{errorLabel}</label>
                                            </div>
                                            <button type='submit' className="w-full hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-900 hover:bg-gray-800 focus:ring-white">Register</button>
                                            <hr />
                                            <button className="w-full text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-[5%] py-[2.5%] text-center bg-gray-500 hover:bg-gray-800 focus:ring-white hover:text-white" onClick={() => router.push('/login')}>Sign in</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
        </>
    );
}