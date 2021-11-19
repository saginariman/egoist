import React, {useContext} from 'react'
import Header from '../components/Header/Header'
import {MenuContext} from '../context'

export default function About() {
  const {menuSwitch, setMenuSwitch} = useContext(MenuContext)
    return (
        <div className="App">
            <Header bigTitle="О нас" littleTitle="egoist" showMenu={setMenuSwitch}/><br/><br/><br/><br/><br/><br/>
            We are human
        </div>
    )
}
