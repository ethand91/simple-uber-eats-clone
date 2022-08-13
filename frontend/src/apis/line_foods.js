import axios from 'axios';

import { lineFoods, lineFoodsReplace } from './../urls/index';

export const postLineFoods = async (params) => {
  const response = await axios.post(lineFoods, {
    food_id: params.foodId,
    count: params.count
  });

  return response.data;
};

export const replaceLineFoods = async (params) => {
  const response = await axios.put(lineFoodsReplace, {
    food_id: params.foodId,
    count: params.count
  });

  return response.data;
};

export const fetchLineFoods = async () => {
  const response = await axios.get(lineFoods);

  console.log('test', response.data);
  return response.data;
};
