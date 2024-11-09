import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar_Home from '../Components/sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from '@firebase/firestore';
import Sidebar_Explore from '../Components/sidebar_explore';
import Sidebar_Search from '../Components/sidebar_search';
import Sidebar_search_mobile from '../Components_mobile/sidebar_search_mobile';
import Searchpagemobile from '../Search Pages/searchpagelaptop';
import Searchpagelaptop from '../Search Pages/searchpagelaptop';
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
export default function Search_Page() {
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
        <Sidebar_Search />
      </div>
      <div className="jnfvnkf" style={{ color: "white" }}>
        <Sidebar_search_mobile />
      </div>
      <div className="jnnf">
        <Searchpagelaptop />
      </div>
      <div className="jnnfe">
        {/* <ProfilePage_Mobile /> */}
      </div>
    </div>
  )
}
