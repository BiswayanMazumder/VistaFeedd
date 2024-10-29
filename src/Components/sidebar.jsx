import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
// import Sidebar_Home from '../Components/sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import Sidebar_home_mobile from '../Components_mobile/sidebar_home_mobile';
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

export default function Sidebar_Home() {
    const user = auth.currentUser; // Get the current user
    const uid = user ? user.uid : null;
    const [profilepicture, setprofilepicture] = useState('');
    useEffect(() => {
        const fetchdp = async () => {
            const uid = auth.currentUser.uid;
            const docRef = doc(db, "User Details", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setprofilepicture(docSnap.data()['Profile Pic']);
            }
        }
        fetchdp();
    }, [])
    return (
        <div className="jrnvfnvkfmv">
            <Link>
                <div className="jjvnkvn">
                    <svg width="100" height="30" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="30" fill="black" rx="5" />
                        <text
                            x="50%"
                            y="50%"
                            fontFamily="'Lobster', cursive"
                            fontSize="21"
                            fill="white"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            dominantBaseline="middle"
                        >
                            VistaFeedd
                        </text>
                    </svg>
                </div>

            </Link>
            <Link style={{ textDecoration: 'none' }} to={'/home'}>
                <div className="dnvdnvd">
                    <svg aria-label="Home" class="x1lliihq x1n2onr6 x5n08af" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Home</title><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>
                    <div className="bvjnv" style={{ marginLeft: '10px', marginTop: '5px' }}>
                        Home
                    </div>
                </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to={'/search'}>
                <div className="dnvdnvd">
                    <svg aria-label="Search" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Search</title><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
                    <div className="bvjnv" style={{ marginTop: '2px', fontWeight: '500', marginLeft: '10px' }}>
                        Search
                    </div>
                </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to={'/explore'}>
                <div className="dnvdnvd">
                    <svg aria-label="Explore" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Explore</title><polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon><polygon fill-rule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle></svg>
                    <div className="bvjnv" style={{ marginTop: '4px', fontWeight: '500', marginLeft: '10px' }}>
                        Explore
                    </div>
                </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to={'/reels'}>
                <div className="dnvdnvd">
                    <svg aria-label="Reels" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Reels</title><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line><path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z" fill-rule="evenodd"></path></svg>
                    <div className="bvjnv" style={{ marginTop: '4px', fontWeight: '500', marginLeft: '10px' }}>
                        Reels
                    </div>
                </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to={'/messages'}>
                <div className="dnvdnvd">
                    <svg aria-label="Messenger" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Messenger</title><path d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.739"></path><path d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z" fill-rule="evenodd"></path></svg>
                    <div className="bvjnv" style={{ marginTop: '4px', fontWeight: '500', marginLeft: '10px' }}>
                        Messages
                    </div>
                </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to={'/notifications'}>
                <div className="dnvdnvd">
                    <svg aria-label="Notifications" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Notifications</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                    <div className="bvjnv" style={{ marginTop: '4px', fontWeight: '500', marginLeft: '10px' }}>
                        Notifications
                    </div>
                </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to={`/profile/${uid}`}>
                <div className="dnvdnvd" style={{ width: "30px", height: "30px", borderRadius: "50%" }}>
                    <img src={profilepicture} alt="" height={"30px"} width={"30px"} style={{ borderRadius: "50%" }} />
                    <div className="bvjnv" style={{ marginTop: '7px', fontWeight: '500', marginLeft: '5px' }}>
                        Profile
                    </div>
                </div>
            </Link>
        </div>
    )
}
