import React,{useReducer,useState,useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import Search from './Search';


const ingredientReducer=(currentIngredient,action)=>{
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredient,action.ingredient]
    case 'DELETE':
      return currentIngredient.filter((ing)=>ing.id!==action.id)
    default:
      throw new Error('Never reach here!')
  }
}

const httpReducer=(currenthttpState,action)=>{
  switch(action.type){
    case 'SEND':
      return {loadingStatus:true,modelError:false}
    case 'RESPONSE':
      return {...currenthttpState, loadingStatus:false}
    case 'ERROR':
      return {loadingStatus:false,modelError:action.error}
   default :
   throw new Error('Will never reach here');
  }

}
  

const Ingredients=() =>{ 
  const [ingredientList,dispatch]=useReducer(ingredientReducer,[]);
  const [httpState,httpDispatch]=useReducer(httpReducer,{loadingStatus:false,modelError:null});
  //const [ingredientList,setIngredientList]=useState([]);
  const [loadingStatus,updateLoadingStatus]=useState(false);
  const [modelError,showErrorModel]=useState();
  
  useEffect(()=>{
    fetchIngredientData('');
  },[])

 const fetchIngredientData=(searchString='')=>{
   httpDispatch({type:'SEND'}); 
   const queryString=searchString.length===0?'':`?orderBy="title"&equalTo="${searchString}"`;
   fetch('https://react-hooks-update-42415-default-rtdb.firebaseio.com/ingredients.json'+queryString).then(responseData=>responseData.json().
   then(responseData=>{
    let ingredientList=[];
    for(const key in responseData){
      ingredientList.push({id:key,title:responseData[key].title,amount:responseData[key].amount})
    }
    //setIngredientList(ingredientList)
    dispatch({type:'SET',ingredients:ingredientList})
    httpDispatch({type:'RESPONSE'});
  }).catch((error)=>
     showErrorModel(error))
  ).catch((error)=>
    showErrorModel(error))
 }

 const onClose=()=>{
  httpDispatch({type:'ERROR'});
 }

  const addnewIngredient=ingredient=>{
  //const [loadingStatus,updateLoadingStatus]=useState(true);
  httpDispatch({type:'SEND'});
    fetch('https://react-hooks-update-42415-default-rtdb.firebaseio.com/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{'Content-Type':'application.json'}
    }).then(responseData=> responseData.json()).then(responseData=>{
     // setIngredientList(previngredient=>[...previngredient,{id:responseData.toString(),...ingredient}]);
      dispatch({type:'ADD',ingredient:{id:responseData.toString(),...ingredient}})
      httpDispatch({type:'RESPONSE'})
    }).catch((error)=>{
      httpDispatch({type:'RESPONSE'})
    })
  }

  return (
    <div className="App">
      {httpState.modelError  &&  <ErrorModal onClose={onClose}>Something went Wrong!</ErrorModal>}
      <IngredientForm addnewIngredient={addnewIngredient} loadingStatus={httpState.loadingStatus}/>

      <section>
        <Search fetchFilteredData={fetchIngredientData}/>
        {/* Need to add list here! */}
        <IngredientList ingredients={ingredientList} onRemoveItem={()=>{}}/>
      </section>
      
    </div>
    
  );
}

export default Ingredients;
