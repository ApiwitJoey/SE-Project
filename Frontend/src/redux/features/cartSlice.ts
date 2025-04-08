import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationItem, Service, UpdateReservationDto } from "../../../interfaces";
import { Shop } from "../../../interfaces";

type CartState = {
    reservationItems: ReservationItem[]
}

const initialState:CartState = { reservationItems: [] }

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addReservation: (state, action:PayloadAction<ReservationItem>) => {
            state.reservationItems.push(action.payload)
        },
        removeReservation: (state, action:PayloadAction<ReservationItem>) => {
            const remainItem = state.reservationItems.filter(obj => {
                return (obj._id !== action.payload._id)
                })
            state.reservationItems = remainItem
        },
        updateReservation: (state, action:PayloadAction<{ id: string; shop: Shop; date: string, service:Service }>) => {
            const newReservationItem = action.payload;
            for (let i = 0; i < state.reservationItems.length; i++) {
                if (state.reservationItems[i]._id === newReservationItem.id) {
                    state.reservationItems[i].shop = newReservationItem.shop;
                    state.reservationItems[i].date = newReservationItem.date;
                    state.reservationItems[i].service = newReservationItem.service;
                    break;
                }
            }
        },
        fetchReservation: (state, action:PayloadAction<ReservationItem[]>) => {
            state.reservationItems = action.payload;
        }
    }
});

export const { addReservation, removeReservation, fetchReservation, updateReservation } = cartSlice.actions
export default cartSlice.reducer