import React, {useEffect} from 'react'
import { useNavigate } from 'react-router'

export default function EmptyPage() {
    const navigate = useNavigate()
    var Switch = true
    useEffect(() => {
        if(Switch){
            navigate('/')
        }
        return () => {
            Switch=false
        }
    }, [])
    return (
        <div>
            
        </div>
    )
}
