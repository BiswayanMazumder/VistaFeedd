import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../Components/sidebar'

export default function Homepage() {
    useEffect(() => {
        document.title = "VistaFeedd"
    })
    return (
        <div className='webbody' style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'row' }}>
            <Sidebar/>
        </div>
    )
}
