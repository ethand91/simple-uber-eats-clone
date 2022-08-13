import axios from 'axios';

import { order } from './../urls/index';

export const postOrder = async (params) => {
  try {
    const response = await axios.post(order, {
      line_food_ids: params.line_food_ids 
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
