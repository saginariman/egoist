import React,{useState, useEffect} from 'react'
import ldr from './loader.module.css'
const Loader = ({title}) => {
    if(!title)
        title = "загрузка..."
    return (
        <div className={ldr.div__loader}>
            <div className={ldr.loader}>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <div className={ldr.cup}>
                    <span></span>
                </div>
            </div>
            <h1 className={ldr.title__load}>{title}</h1>
        </div>
    )
}

export default Loader
