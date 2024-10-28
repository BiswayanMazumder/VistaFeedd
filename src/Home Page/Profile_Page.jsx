import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar_Home from '../Components/sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import Sidebar_home_mobile from '../Components_mobile/sidebar_home_mobile';
import Sidebar_Profile from '../Components/Sidebar_Profile';
import Profilepage_laptop from './Sidebar Pages(Laptop)/profilepage_laptop';
import ProfilePage_Mobile from './Sidebar Pages(Laptop)/ProfilePage_Mobile';
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
export default function Profile_Page() {
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
    const [profilepicture, setprofilepicture] = useState('');
    const [name, setname] = useState('');
    useEffect(() => {
        const fetchdp = async () => {
            const Uid = auth.currentUser.uid;
            const docRef = doc(db, "User Details", Uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setprofilepicture(docSnap.data()['Profile Pic']);
                setname(docSnap.data()['Name']);
            }
        }
        fetchdp();
    }, [])
    return (
        <div className='webbody' style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'row' }}>
            <div className="jjndv">
                <Sidebar_Profile />
            </div>
            <div className="jnfvnkf" style={{ color: "white" }}>
                <Sidebar_home_mobile />
            </div>
            <div className="jnnf">
                <Profilepage_laptop />
            </div>
            <div className="jnnfe">
                <ProfilePage_Mobile />
            </div>
        </div>
    )
}
