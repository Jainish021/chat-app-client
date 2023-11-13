import { configureStore } from '@reduxjs/toolkit'
import friendProfileVisibilityReducer from '../slices/friendProfileVisibilitySlice'
import selectedItemReducer from '../slices/selectedItemSlice'
import userInformationReducer from '../slices/userInformationSlice'
import socketReducer from '../slices/socketSlice'

const store = configureStore({
    reducer: {
        friendProfileVisibility: friendProfileVisibilityReducer,
        selectedItem: selectedItemReducer,
        userInformation: userInformationReducer,
        socket: socketReducer
    },
})

export default store