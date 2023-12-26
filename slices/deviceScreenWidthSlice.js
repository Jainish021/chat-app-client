import { createSlice } from '@reduxjs/toolkit'

const deviceScreenWidthSlice = createSlice({
    name: 'deviceScreenWidth',
    initialState: {},
    reducers: {
        setDeviceScreenWidth: (state, action) => {
            return { ...action.payload };
        },
    },
})

export const { setDeviceScreenWidth } = deviceScreenWidthSlice.actions
export default deviceScreenWidthSlice.reducer