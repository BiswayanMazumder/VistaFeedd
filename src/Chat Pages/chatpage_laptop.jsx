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

    const fetchchatdetails = async () => {
        const uids = []
        const docref = doc(db, 'Chat Details', ChatID);
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const UID1 = data['User 1'];
            const UID2 = data['User 2'];
            uids.push(UID1 === auth.currentUser.uid ? UID2 : UID1);
            // console.log('UID',uids)
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
                fetchallchatids();
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
            <div className="mdnfmd">
                <div className="jnefjnedf" style={{position:'fixed'}}>
                    <Link style={{ textDecoration: 'none', color: 'white' }} to={`/others/${chatUID}`}>
                        <div className="wwkdwkdm">
                            <img src={pfp} alt={name} style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                        </div>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'white' }} to={`/others/${chatUID}`}>
                        <div className="kkmf">
                            {name}
                        </div>
                    </Link>
                </div>
                <div className="jedbfcned">
                    <input type="text" className='ehfjnfn' />
                </div>
            </div>
        </div>
    );
}
