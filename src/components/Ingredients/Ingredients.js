import React, { useReducer, useEffect, useCallback } from 'react';
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

const httpReducer = (httpState, action) => {
  switch (action.type){
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...httpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.error};
    case 'CLEAN':
      return {...httpState, error: null};
    default:
      throw new Error('should not get there');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch ] = useReducer(ingredientReducer, []);
  // const [ userIngredients, setUserIngredients ] = useState([]);

  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})
  // const[isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');

  useEffect(() => {
    console.log('rendering useEffect', userIngredients)
  }, [userIngredients]);

  const filteredIngrediensHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);
  //here no dependencies

  const addIngredientHandler = (ingredient) => {
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hook-test-9bdb4-default-rtdb.firebaseio.com/ingredients.json', {
      method:'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'});
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
    dispatchHttp({type: 'SEND'});
    //you need to specify in the url which item you want to delete to send the request
    fetch(`https://react-hook-test-9bdb4-default-rtdb.firebaseio.com/ingredients/${ingId}.json`, {
      method:'DELETE'
    })
    .then(response => {
      dispatchHttp({type: 'RESPONSE'});
      // setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingId))
      dispatch({type: 'DELETE', id: ingId});
    })
    .catch(err => {
      dispatchHttp({type: 'ERROR', error: 'something went wrong'});
    });
  }

  const clearError = () => {
    dispatchHttp({type: 'CLEAR'});
  }

  return (
    <div className="App">
      {httpState.error ?  <ErrorModal onClose={clearError}> {httpState.error}</ErrorModal> : null}
      <IngredientForm  onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

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
