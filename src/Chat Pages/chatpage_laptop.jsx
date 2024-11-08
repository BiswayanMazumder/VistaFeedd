import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Firebase config
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

export default function Chatpage_laptop() {
    const { ChatID } = useParams();
    const [chatUID, setchatUID] = useState('');
    const [pfp, setpfp] = useState('');
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(true);

    // Function to fetch chat details
    const fetchchatdetails = async () => {
        const docref = doc(db, 'Chat Details', ChatID);
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const UID1 = data['User 1'];
            const UID2 = data['User 2'];
            setchatUID(UID1 === auth.currentUser.uid ? UID2 : UID1);
        } else {
            console.error('Chat details not found');
        }
    };

    // Function to fetch chat owner details
    const fetchchatownerdetails = async () => {
        if (!chatUID) return; // Wait until chatUID is set
        const docref = doc(db, 'User Details', chatUID);
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setpfp(data['Profile Pic']);
            setname(data['Name']);
        } else {
            console.error('User details not found');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Fetch chat and user details after user is authenticated
                fetchchatdetails()
                    .then(() => {
                        fetchchatownerdetails();
                    })
                    .finally(() => setLoading(false)); // Set loading to false after fetching data
            } else {
                console.log("User not logged in");
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [ChatID, chatUID]); // Dependencies include ChatID and chatUID to refetch when these change

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="jndvnfnf" style={{ overflowY: "auto", maxHeight: "100vh", display: "flex", flexDirection: "row", marginTop: "0px", marginLeft: "0px", width: "100%", gap: "0px" }}>
            <div className="emnfmdkvm">
                {/* Sidebar content can go here */}
            </div>
            <div className="mdnfmd">
                <div className="jnefjnedf">
                    <Link style={{ textDecoration: 'none',color: 'white' }} to={`/others/${chatUID}`}>
                    <div className="wwkdwkdm">
                        <img src={pfp} alt={name} style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                    </div>
                    </Link>
                    <Link style={{ textDecoration: 'none',color: 'white' }} to={`/others/${chatUID}`}>
                    <div className="kkmf">
                        {name}
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
