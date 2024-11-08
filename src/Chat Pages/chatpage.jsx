import React from 'react'
import Sidebar_Profile from '../Components/Sidebar_Profile'
import Sidebar_Messages from '../Components/Sidebar_Messages'
import Sidebar_messages_mobile from '../Components_mobile/Sidebar_messages_mobile'
import Chatpage_laptop from './chatpage_laptop'
import Chatpage_mobile from './chatpage_mobile'

export default function Chatpage() {
  return (
    <div className='webbody' style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'row' }}>
            <div className="jjndv">
                <Sidebar_Messages />
            </div>
            <div className="jnfvnkf" style={{ color: "white" }}>
                <Sidebar_messages_mobile/>
            </div>
            <div className="jnnf">
                <Chatpage_laptop />
            </div>
            <div className="jnnfe">
                <Chatpage_mobile />
            </div>
        </div>
  )
}
