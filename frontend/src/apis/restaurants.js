import axios from 'axios';
import { restaurantsIndex } from './../urls/index';

export const fetchRestaurants = async () => {
  try {
    const response = await axios.get(restaurantsIndex);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
