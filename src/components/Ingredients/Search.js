import React, { useState, useEffect, useCallback } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter ] = useState('');
  const { onLoadIngredients } = props; 

  useEffect(() => {
    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch('https://react-hook-test-9bdb4-default-rtdb.firebaseio.com/ingredients.json' + query)
    .then(response => response.json())
    .then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    });
  }, [enteredFilter, onLoadIngredients]);
  // in the array, we need to specific our dependencies
  //function will happen only when enteredFilter change 

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            type="text" 
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
