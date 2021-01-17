import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter ] = useState('');
  const { onLoadIngredients } = props; 
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      //thanks to CLOSURE, enteredFilter here is the value that was entered 500ms ago
      // not the initial value
      //we need to be able to check with the current value now 
      // done with REF
      if (enteredFilter ===  inputRef.current.value) {
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
          };
          onLoadIngredients(loadedIngredients);
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer)
    };
    // will make that we clear the timeout
    //because we don't want to keep the old timer for every keystroke

    //use setTimeout so the function doesn't trigger on everykeystroke but only if the user stops for 500ms
  }, [enteredFilter, onLoadIngredients, inputRef]);
  // in the array, we need to specific our dependencies
  //function will happen only when enteredFilter change 

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
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
