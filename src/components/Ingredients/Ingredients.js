import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([])

  const addIngredientHandler = (ingredient) => {
    setUserIngredients(prevIngredients => [...prevIngredients, {id: Math.random().toString(), ...ingredient}]);
  }

  const removeIngredientHandler = ingId => {
    setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingId))
  }

  return (
    <div className="App">
      <IngredientForm  onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList 
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
          />
      </section>
    </div>
  );
}

export default Ingredients;
