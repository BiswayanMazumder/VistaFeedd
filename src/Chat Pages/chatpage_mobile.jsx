import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, getDoc, collection, query, orderBy, onSnapshot, Timestamp, addDoc } from 'firebase/firestore';

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

export default function Chatpage_mobile() {
    const { ChatID } = useParams();
    const [chatUID, setchatUID] = useState('');
    const [pfp, setpfp] = useState('');
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(true);
    const [allchatid, setallchatid] = useState([]);
    const [otherchatpfp, setotherchatpfp] = useState([]);
    const [otherchatname, setotherchatname] = useState([]);
    const [otherchatuid, setotherchatuid] = useState([]);
    const [messages, setMessages] = useState([]);  // State to hold messages
    const [messageText, setMessageText] = useState(''); // State for message input

    // Function to fetch chat details
    const fetchallchatids = async () => {
        const IDs = [];
        const chatuid = [];  // Array to hold UIDs that are not the current user's UID
        const docref = doc(db, 'Chat UIDs', auth.currentUser.uid);
        const docSnap = await getDoc(docref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            IDs.push(...data['IDs']);
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
        const uids = [];
        const docref = doc(db, 'Chat Details', ChatID);
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const UID1 = data['User 1'];
            const UID2 = data['User 2'];
            uids.push(UID1 === auth.currentUser.uid ? UID2 : UID1);
            setchatUID(UID1 === auth.currentUser.uid ? UID2 : UID1);
        } else {
            console.error('Chat details not found');
        }
    };

    // Function to fetch chat owner details
    const [userverified, isuserverified] = useState(false);
    const fetchchatownerdetails = async () => {
        if (!chatUID) return; // Wait until chatUID is set
        const docref = doc(db, 'User Details', chatUID);
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setpfp(data['Profile Pic']);
            setname(data['Name']);
            isuserverified(data['Verified'] || false);
        } else {
            console.error('User details not found');
        }
    };

    // Function to send a message
    const sendMessage = async () => {
        if (messageText.trim() === '') return; // Prevent sending empty message
        const messagesRef = collection(db, 'Chats', ChatID, 'Messages');
        await addDoc(messagesRef, {
            senderId: auth.currentUser.uid,
            message: messageText,
            timestamp: Timestamp.now(),
            seen: false,
        });
        setMessageText('');  // Clear input field
    };

    // Fetch messages in real-time
    useEffect(() => {
        const messagesRef = collection(db, 'Chats', ChatID, 'Messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArr = [];
            querySnapshot.forEach((docSnapshot) => {
                messagesArr.push(docSnapshot.data());
            });
            setMessages(messagesArr); // Update messages state with real-time messages
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [ChatID]);

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
    }, [ChatID, chatUID]);

    return (
        <div style={{ color: 'white' }} className='kdmkfmkmk'>
            <div className="jnefjnedf">
                <Link style={{ textDecoration: 'none', color: 'white' }} to={`/others/${chatUID}`}>
                    <div className="wwkdwkdm">
                        <img src={pfp} alt={name} style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                    </div>
                </Link>
                <Link style={{ textDecoration: 'none', color: 'white' }} to={`/others/${chatUID}`}>
                    <div className="kkmf" style={{ color: 'white', fontWeight: '400', display: 'flex', flexDirection: "row", gap: '5px' }}>
                        {name}
                        <div style={{ marginTop: "2px" }}>
                            {userverified ? (
                                <svg aria-label="Verified" className="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12">
                                    <title>Verified</title>
                                    <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fill-rule="evenodd"></path>
                                </svg>
                            ) : <></>}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Chat Messages */}
            <div className="kenfm" style={{ marginTop: '100px', height: 'calc(100vh - 370px)', overflowY: 'scroll', overflowX: 'hidden' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: msg.senderId === auth.currentUser.uid ? 'flex-end' : 'flex-start',
                        padding: '10px',
                    }}>
                        <div style={{
                            backgroundColor: msg.senderId === auth.currentUser.uid ? '#0078d4' : '#e5e5e5',
                            color: msg.senderId === auth.currentUser.uid ? '#fff' : '#000',
                            padding: '8px 12px',
                            borderRadius: '15px',
                            display: 'inline-block',
                        }}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="ehgddh" style={{position:"fixed"}}>
                <div className="eufhj">
                    <input
                        type="text"
                        className='ejjejkj'
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                    />
                </div>
            </div>
        </div>
    );
}
