import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShopTimeRangeState {
  startDate: string | null;
  endDate: string | null;
}

const initialState: ShopTimeRangeState = {
  startDate: null,
  endDate: null,
};

const shopTimeRangeSlice = createSlice({
  name: 'shopTimeRange',
  initialState,
  reducers: {
    setShopTimeRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setShopTimeRange } = shopTimeRangeSlice.actions;
export default shopTimeRangeSlice.reducer; 