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

export default function Message_laptop() {
    const [chatUID, setchatUID] = useState('');
    const [pfp, setpfp] = useState('');
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(true);
    const [allchatid, setallchatid] = useState([]);
    const [otherchatpfp, setotherchatpfp] = useState([]);
    const [otherchatname, setotherchatname] = useState([]);
    const [otherchatuid, setotherchatuid] = useState([]);

    // Function to fetch chat details
    const fetchallchatids = async () => {
        const IDs = [];
        const chatuid = [];  // Array to hold UIDs that are not the current user's UID
        const docref = doc(db, 'Chat UIDs', auth.currentUser.uid);
        const docSnap = await getDoc(docref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            IDs.push(...data['IDs']);
            // console.log('allchatid', IDs);
        }

        setallchatid(IDs);  // Assuming this updates the state or UI with all the chat IDs

        for (let i = 0; i < IDs.length; i++) {
            const docref1 = doc(db, 'Chat Details', IDs[i]);
            const docSnap1 = await getDoc(docref1);

            if (docSnap1.exists()) {
                const data1 = docSnap1.data();
                const user1 = data1['User 1'];
                const user2 = data1['User 2'];

                // Push whichever UID is not equal to the current user's UID
                if (user1 !== auth.currentUser.uid) {
                    chatuid.push(user1);
                }
                if (user2 !== auth.currentUser.uid) {
                    chatuid.push(user2);
                }
            }
        }

        const names = [];
        const pfps = [];
        const uids = [];

        // console.log('Chat UIDs:', chatuid);
        for (let j = 0; j < chatuid.length; j++) {
            const docref2 = doc(db, 'User Details', chatuid[j]);
            const docSnap2 = await getDoc(docref2);
            if (docSnap2.exists()) {
                const data2 = docSnap2.data();
                pfps.push(data2['Profile Pic']);
                names.push(data2['Name']);
                uids.push(data2['UserId']);
            }
        }

        // Update state in one go after fetching all necessary data
        setotherchatpfp(pfps);
        setotherchatname(names);
        setotherchatuid(uids);
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
                fetchallchatids();

            } else {
                console.log("User not logged in");
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [chatUID]); // Dependencies include ChatID and chatUID to refetch when these change

    return (
        <div className="jndvnfnf" style={{ overflowY: "auto", maxHeight: "100vh", display: "flex", flexDirection: "row", marginTop: "0px", marginLeft: "0px", width: "100%", gap: "0px" }}>
            <div className="emnfmdkvm">
                {otherchatname.map((name, index) => (
                    <div className="ekfkmv" key={index}>
                        <Link style={{ textDecoration: 'none', color: 'white' }} to={`/direct/t/${allchatid[index]}`}>
                            <div className="wwkdwkdm">
                                <img src={otherchatpfp[index]} alt={name} style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                            </div>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: 'white' }} to={`/direct/t/${allchatid[index]}`}>
                            <div className="kkmf" style={{ color: 'white', fontWeight: '400' }}>
                                {name}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {/* <div className="mdnfmd" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                <svg aria-label="" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="96" role="img" viewBox="0 0 96 96" width="96"><title></title><path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path></svg>
                <div style={{ fontWeight: "600", color: "white" }}>
                    Your messages
                </div>
                <div style={{ fontWeight: "400", color: "gray", fontSize: "14px" }}>
                    Send a message to start a chat.
                </div>
            </div> */}
        </div>
    )
}
