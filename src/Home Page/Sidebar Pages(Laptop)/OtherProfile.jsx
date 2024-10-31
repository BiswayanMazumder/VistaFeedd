import React from 'react'
import Sidebar_Profile from '../../Components/Sidebar_Profile'
import Sidebar_Profile_mobile from '../../Components_mobile/sidebar_profile_mobile'
import Profilepage_laptop from './profilepage_laptop'
import ProfilePage_Mobile from './ProfilePage_Mobile'
import Sidebar_others from '../../Components/sidebar_others.jsx'
import Sidebar_Others_mobile from '../../Components_mobile/sidebar_other_profile.jsx'
import OthersProfile_Laptop from '../othersprofile_laptop.jsx'
import OtherProfile_Mobile from './Othersporfile_mobile.jsx'

export default function OtherProfile() {
  return (
    <div className='webbody' style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'row' }}>
       <div className="jjndv">
                <Sidebar_others />
            </div>
            <div className="jnfvnkf" style={{ color: "white" }}>
                <Sidebar_Others_mobile />
            </div>
            <div className="jnnf">
                <OthersProfile_Laptop />
            </div>
            <div className="jnnfe">
                <OtherProfile_Mobile />
            </div>
    </div>
  )
}
