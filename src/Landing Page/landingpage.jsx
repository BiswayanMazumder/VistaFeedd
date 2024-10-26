import React, { useEffect } from 'react'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default function Landingpage() {
    useEffect(() => {
        document.title = "Fotofusion";
    })
  return (
    <div className='webbody'>
      <div className="jrnfmemf">
        fff
      </div>
    </div>
  )
}
