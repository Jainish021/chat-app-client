import { createSlice } from '@reduxjs/toolkit'

const socketSlice = createSlice({
    name: 'socket',
    initialState: {},
    reducers: {
        setSocket: (state, action) => {
            return { ...action.payload };
        },
    },
})

export const { setSocket } = socketSlice.actions
export default socketSlice.reducer