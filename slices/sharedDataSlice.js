import { createSlice } from '@reduxjs/toolkit'

const sharedDataSlice = createSlice({
    name: 'sharedData',
    initialState: {},
    reducers: {
        setSharedData: (state, action) => {
            return { ...action.payload };
        },
    },
})

export const { setSharedData } = sharedDataSlice.actions
export default sharedDataSlice.reducer