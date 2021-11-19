import React from 'react'
import lgSt from './Logged.module.css'
const Logged = ({title}) => {
    return (
        <div className={lgSt.blog}>
            {title}
        </div>
    )
}

export default Logged
