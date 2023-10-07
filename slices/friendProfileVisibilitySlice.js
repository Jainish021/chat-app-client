import { createSlice } from '@reduxjs/toolkit'

const friendProfileVisibilitySlice = createSlice({
    name: 'friendProfileVisibility',
    initialState: {
        isVisible: false
    },
    reducers: {
        setFriendProfileVisibility: (state, action) => {
            return { ...action.payload };
        },
    },
})

export const { setFriendProfileVisibility } = friendProfileVisibilitySlice.actions
export default friendProfileVisibilitySlice.reducer