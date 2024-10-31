import React, { useEffect, useState } from 'react'
import Sidebar_Profile from '../../Components/Sidebar_Profile'
import Sidebar_Profile_mobile from '../../Components_mobile/sidebar_profile_mobile'
import Profilepage_laptop from './profilepage_laptop'
import ProfilePage_Mobile from './ProfilePage_Mobile'
import Sidebar_others from '../../Components/sidebar_others.jsx'
import Sidebar_Others_mobile from '../../Components_mobile/sidebar_other_profile.jsx'
import OthersProfile_Laptop from '../othersprofile_laptop.jsx'
import OtherProfile_Mobile from './Othersporfile_mobile.jsx'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from '@firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyA5h_ElqdgLrs6lXLgwHOfH9Il5W7ARGiI",
  authDomain: "vistafeedd.firebaseapp.com",
  projectId: "vistafeedd",
  storageBucket: "vistafeedd.appspot.com",
  messagingSenderId: "1025680611513",
  appId: "1:1025680611513:web:40aeb5d0434d67ca1ea368",
  measurementId: "G-9V0M9VQDGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export default function OtherProfile() {
  const [loggedin,setloggedin]=useState(true);
  useEffect(() => {
       
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setloggedin(true);
        } else {
            // Handle user not logged in
            console.log("User not logged in");
            setloggedin(false);
        }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
}, []);
  return (
    <div className='webbody' style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'row' }}>
       {
        loggedin?<div><div className="jjndv">
                <Sidebar_others />
            </div>
            <div className="jnfvnkf" style={{ color: "white" }}>
                <Sidebar_Others_mobile />
            </div></div>:<></>
       }
            <div className="jnnf">
                <OthersProfile_Laptop />
            </div>
            <div className="jnnfe">
                <OtherProfile_Mobile />
            </div>
    </div>
  )
}
