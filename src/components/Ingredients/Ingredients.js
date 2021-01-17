import React, { useReducer, useEffect, useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD': 
      return [...state, action.ingredient];
    case 'DELETE':
      return state.filter(ing => ing.id  !== action.id);
    default:
      throw new Error('should not get there');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch ] = useReducer(ingredientReducer, []);
  // const [ userIngredients, setUserIngredients ] = useState([]);
  const[isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('rendering useEffect', userIngredients)
  }, [userIngredients]);

  const filteredIngrediensHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);
  //here no dependencies

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch('https://react-hook-test-9bdb4-default-rtdb.firebaseio.com/ingredients.json', {
      method:'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(data => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients, 
      //   {id: data.name, ...ingredient}
      // ]);
      dispatch({type: 'ADD', ingredient: {id: data.name, ...ingredient}});
    }).catch(error => 
      console.log(error));
  }

  const removeIngredientHandler = ingId => {
    setIsLoading(true);
    //you need to specify in the url which item you want to delete to send the request
    fetch(`https://react-hook-test-9bdb4-default-rtdb.firebaseio.com/ingredients/${ingId}.json`, {
      method:'DELETE'
    })
    .then(response => {
      setIsLoading(false);
      // setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingId))
      dispatch({type: 'DELETE', id: ingId});
    })
    .catch(err => {
      setError('something went wrong!');
      setIsLoading(false);
    });
  }

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error ?  <ErrorModal onClose={clearError}> {error}</ErrorModal> : null}
      <IngredientForm  onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngrediensHandler} />
        <IngredientList 
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
          />
      </section>
    </div>
  );
}

export default Ingredients;
