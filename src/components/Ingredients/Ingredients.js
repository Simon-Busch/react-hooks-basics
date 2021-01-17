import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  useEffect(() => {
    console.log('rendering useEffect', userIngredients)
  }, [userIngredients]);

  const filteredIngrediensHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);
  //here no dependencies

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hook-test-9bdb4-default-rtdb.firebaseio.com/ingredients.json', {
      method:'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    }).then(data => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: data.name, ...ingredient}
      ]);
    }).catch(error => 
      console.log(error));
  }

  const removeIngredientHandler = ingId => {
    setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingId))
  }

  return (
    <div className="App">
      <IngredientForm  onAddIngredient={addIngredientHandler} />

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
