import React,{useState} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [filterString,updateFilterString]=useState('');
  const updateSearch=(event)=>{
    const searchVal=event.target.value;
    updateFilterString(searchVal);
   
    const timer=setTimeout(()=>{
      props.fetchFilteredData(searchVal);
    },1000)
  }
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {/* <input type="text"  value={filterString} onChange={event=>{updateFilterString(event.target.value)}}/> */}

          <input type="text"  value={filterString} onChange={event=>updateSearch(event)}/> 
        </div>
      </Card>
    </section>
  );
});

export default Search;
