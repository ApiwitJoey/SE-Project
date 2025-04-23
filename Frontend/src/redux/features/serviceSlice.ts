import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Service } from "../../../interfaces";

type serviceState = {
    service: Service[]
}

const initialState:serviceState = { service: [] };

export const serviceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {
        addService: (state, action:PayloadAction<Service>) => {
            state.service.push(action.payload);
        },
        removeService: (state, action:PayloadAction<string>) => {
            const remainUser = state.service.filter(obj => {
                return (obj._id !== action.payload);
                })
            state.service = remainUser;
        },
        clearServices: (state) => {
            state.service = [];
        }
    }
});

export const { addService, removeService, clearServices } = serviceSlice.actions
export default serviceSlice.reducer