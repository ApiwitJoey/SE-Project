import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setShopTimeRange } from '../store/slices/shopTimeRangeSlice';

interface ShopTimeRangeProps {
  shopId: string;
}

const ShopTimeRange: React.FC<ShopTimeRangeProps> = ({ shopId }) => {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state: RootState) => state.shopTimeRange);

  const updateShopTimeRange = async () => {
    try {
      // เรียก API เพื่อดึงข้อมูล time range ของ shop
      const response = await fetch(`/api/shops/${shopId}/time-range`);
      const data = await response.json();
      
      dispatch(setShopTimeRange({
        startDate: data.startDate,
        endDate: data.endDate
      }));
    } catch (error) {
      console.error('Error fetching shop time range:', error);
    }
  };

  useEffect(() => {
    if (shopId) {
      updateShopTimeRange();
    }
  }, [shopId]);

  return null; // Component นี้ไม่มีการแสดงผล UI
};

export default ShopTimeRange; 