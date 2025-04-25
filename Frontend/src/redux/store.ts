import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import userSlice from "./features/userSlice";
import shopSlice from "./features/shopSlice";
import serviceSlice  from "./features/serviceSlice";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    user: userSlice,
    shop: shopSlice,
    service : serviceSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
