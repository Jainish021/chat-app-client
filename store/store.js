import { configureStore } from '@reduxjs/toolkit'
import sharedDataReducer from '../slices/sharedDataSlice'
import selectedItemReducer from '../slices/selectedItemSlice'
import userInformationReducer from '../slices/userInformationSlice'

const store = configureStore({
    reducer: {
        sharedData: sharedDataReducer,
        selectedItem: selectedItemReducer,
        userInformation: userInformationReducer,
    },
})

export default store