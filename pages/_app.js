// `pages/_app.js`
import { Provider } from 'react-redux'
import '../styles/global.css'
import store from '../store/store'
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
            <SpeedInsights />
        </Provider>
    )
}