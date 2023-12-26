import { configureStore } from '@reduxjs/toolkit'
import friendProfileVisibilityReducer from '../slices/friendProfileVisibilitySlice'
import selectedItemReducer from '../slices/selectedItemSlice'
import userInformationReducer from '../slices/userInformationSlice'
import deviceScreenWidthReducer from '../slices/deviceScreenWidthSlice'

const store = configureStore({
    reducer: {
        friendProfileVisibility: friendProfileVisibilityReducer,
        selectedItem: selectedItemReducer,
        userInformation: userInformationReducer,
        deviceScreenWidth: deviceScreenWidthReducer
    },
})

export default store