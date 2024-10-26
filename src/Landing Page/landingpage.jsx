import React, { useEffect, useState } from 'react'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Link, useParams } from 'react-router-dom';
import Landing_laptop from './landing_laptop';
import Landing_mobile from './landing_mobile';
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
export default function Landingpage() {
  useEffect(() => {
    document.title = "VistaFeedd - Home";
  });
  const videolinks = [
    'https://static.snapchat.com/videos/snapchat-dot-com/lens.mp4',
    'https://static.snapchat.com/videos/snapchat-dot-com/find-your-friends.mp4',
    'https://static.snapchat.com/videos/snapchat-dot-com/spotlight.mp4',
    'https://static.snapchat.com/videos/snapchat-dot-com/map.mp4',
    ''
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videolinks.length);
  };
  return (
    <div className="webbody">
      <div className="jhghgj">
      <Landing_laptop/>
      </div>
      <div className="ekfjjf">
        <Landing_mobile/>
      </div>
    </div>
  )
}
