import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shop } from "../../../interfaces";

type shopState = {
    shop: Shop[]
}

const initialState:shopState = { shop: [] };

export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        addShop: (state, action:PayloadAction<Shop>) => {
            state.shop.push(action.payload);
        },
        removeShop: (state, action:PayloadAction<string>) => {
            const remainUser = state.shop.filter(obj => {
                return (obj._id !== action.payload);
                })
            state.shop = remainUser;
        },
        clearShops: (state) => {
            state.shop = [];
        }
    }
});

export const { addShop, removeShop, clearShops } = shopSlice.actions
export default shopSlice.reducer