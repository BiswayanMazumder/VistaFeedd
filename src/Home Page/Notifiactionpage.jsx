import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar_Home from '../Components/sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from '@firebase/firestore';
import Sidebar_Explore from '../Components/sidebar_explore';
import Sidebar_Notification from '../Components/Sidebar_Notification';
import Sidebar_reels_mobile from '../Components_mobile/Sidebar_reels_mobile';
import Sidebar_notification_mobile from '../Components_mobile/sidebar_notification_mobile';
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
export default function NotificationPage() {
    useEffect(() => {
        const checkloggedin = async () => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
            //   window.location.replace('/home');
              const uid = user.uid;
              // ...
            } else {
              // User is signed out
              window.location.replace('/');
              // ...
            }
          });
        }
        checkloggedin();
      })
    useEffect(() => {
        document.title = "VistaFeedd"
    })
    return (
        <div className='webbody' style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'row' }}>
             <div className="jjndv">
          <Sidebar_Notification />
        </div>
        <div className="jnfvnkf" style={{ color: "white" }}>
          <Sidebar_notification_mobile />
        </div>
        </div>
    )
}
