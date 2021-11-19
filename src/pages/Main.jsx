import React, {useState, useContext} from 'react';
import Header from '../components/Header/Header';
import Wrapper from '../components/Wrapper/Wrapper';
import {MenuContext, CategoriesContext} from '../context'
import Loader from '../components/Loader/Loader'

function Main() {
  const {menuSwitch, setMenuSwitch} = useContext(MenuContext)
  const {categories, isLoading, error} = useContext(CategoriesContext)
  return (
    <div className="App">
      <Header bigTitle="Egoist" littleTitle="чай-кофе" showMenu={setMenuSwitch}/>
      {isLoading
        ?<Loader/>
        :<Wrapper items={categories} error={error}/>
      }
    </div>
  );
}

export default Main;
