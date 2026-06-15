import authReducer from "@/redux/features/authSlice";
import restaurantReducer from "@/redux/features/restaurantSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  restaurant: restaurantReducer,
});

export default rootReducer;

