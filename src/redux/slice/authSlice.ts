// import { createSlice } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";

// const userData = Cookies.get("userInfo")

// const initialState = {
//     userInfo: userData ? JSON.parse(userData) : null,
// };

// const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         setUser: (state, action) => {
//             state.userInfo = action.payload
//             Cookies.set('userInfo', JSON.stringify(action.payload), { expires: 1 })
//         },
//         clearUser: (state) => {
//             state.userInfo = null
//             Cookies.remove('userInfo')
//         }
//     }
// })

// export const { setUser, clearUser } = userSlice.actions;
// export default userSlice.reducer