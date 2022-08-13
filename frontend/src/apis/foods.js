import axios from 'axios';
import { foodsIndex } from './../urls/index';

export const fetchFoods = async (restaurantId) => {
  try {
    const response = await axios.get(foodsIndex(restaurantId));

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
