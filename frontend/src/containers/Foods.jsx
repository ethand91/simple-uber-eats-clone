import React, { Fragment, useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { useHistory, Link } from 'react-router-dom';

import { NewOrderConfirmDialog } from './../components/NewOrderConfirmDialog';
import { LocalMallIcon } from './../components/Icons';
import { FoodWrapper } from './../components/FoodWrapper';
import { FoodOrderDialog } from './../components/FoodOrderDialog';
import Skeleton from '@material-ui/lab/Skeleton';

import { postLineFoods, replaceLineFoods } from './../apis/line_foods';

import { HTTP_STATUS_CODE } from './../constants';

import {
  initialState as foodsInitialState,
  foodsActionTypes,
  foodsReducer
} from './../reducers/foods';

import { fetchFoods } from './../apis/foods';

import MainLogo from './../images/logo.png';
import FoodImage from './../images/food-image.jpg';

import { COLORS } from './../style_constants';
import { REQUEST_STATE } from './../constants';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`;

const BagIconWrapper = styled.div`
  padding-top: 24px;
`;

const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const MainLogoImage = styled.img`
  height: 90px;
`;

const FoodsList = styled.div`
  display: flax;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;

export const Foods = ({ match }) => {
  const [ foodsState, dispatch ] = useReducer(foodsReducer, foodsInitialState);
  const history = useHistory();

  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingRestaurantName: '',
    newRestaurantName: ''
  }
  const [ state, setState ] = useState(initialState);

  useEffect(() => {
    dispatch({ type: foodsActionTypes.FETCHING });

    fetchFoods(match.params.restaurantId).then((data) => {
      dispatch({
        type: foodsActionTypes.FETCH_SUCCESS,
        payload: {
          foods: data.foods
        }
      });
    });
  }, []);

  const handleFoodOnClicked = food => {
    console.log('click', food);
    setState({
      ...state,
      isOpenOrderDialog: true,
      selectedFood: food
    });
  };

  const handleDialogOnClose = () => {
    setState({
      ...state,
      isOpenOrderDialog: false,
      selectedFood: null,
      selectedFoodCount: 1
    });
  };

  const handleCountDownOnClick = () => {
    setState({
      ...state,
      selectedFoodCount: state.selectedFoodCount - 1
    });
  };

  const handleCountUpOnClick = () => {
    setState({
      ...state,
      selectedFoodCount: state.selectedFoodCount + 1
    });
  };

  const submitOrder = async () => {
    try {
      await postLineFoods({
        foodId: state.selectedFood.id,
        count: state.selectedFoodCount
      });

      history.push('/orders');
    } catch (error) {
    console.log(error);
      if (error.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
        setState({
          ...state,
          isOpenOrderDialog: false,
          isOpenNewOrderDialog: true,
          existingRestaurantName: error.response.data.existing_restaurant,
          newRestaurantName: error.response.data.new_restaurant
        });
      } else {
        throw error;
      }
    }
  };

  const replaceOrder = async () => {
    await replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount
    });

    history.push('/orders');
  }

  const handleNewOrderConfirmOnClose = () => {
    setState({
      ...state,
      isOpenNewOrderDialog: false
    });
  };

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={ MainLogo } alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large"/>
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {
          foodsState.fetchState === REQUEST_STATE.LOADING
            ?
              <Fragment>
                {
                  [...Array(12).keys()].map(i =>
                    <ItemWrapper key={ i }>
                      <Skeleton key={ i } variant="rect" width={ 450 } height={ 180 } />
                    </ItemWrapper>
                  )
                }
              </Fragment>
            :
              foodsState.foodsList.map(food =>
                <ItemWrapper key={ food.id }>
                  <FoodWrapper
                    food={ food }
                    onClickFoodWrapper = { handleFoodOnClicked }
                    imageUrl={ FoodImage }
                  />
                </ItemWrapper>
              )
          }
        }
      </FoodsList>
      { state.isOpenOrderDialog &&
        <FoodOrderDialog
          food={ state.selectedFood }
          isOpen={ state.isOpenOrderDialog }
          countNumber={ state.selectedFoodCount }
          onClickCountUp={ handleCountUpOnClick }
          onClickCountDown={ handleCountDownOnClick }
          onClickOrder={ submitOrder }
          onClose={ handleDialogOnClose }
        />
      }
      { state.isOpenNewOrderDialog &&
        <NewOrderConfirmDialog
          isOpen={ state.isOpenNewOrderDialog }
          onClose={ handleNewOrderConfirmOnClose }
          existingRestaurantName={ state.existingRestaurantName }
          newRestaurantName={ state.newRestaurantName }
          onClickSubmit={ replaceOrder }
        />
      }
    </Fragment>
  );
};
