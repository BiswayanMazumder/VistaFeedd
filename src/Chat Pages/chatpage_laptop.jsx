import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, Timestamp, getDocs, updateDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

export default function Chatpage_laptop() {
    const { ChatID } = useParams();
    const [chatUID, setchatUID] = useState('');
    const [pfp, setpfp] = useState('');
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [otherchatpfp, setotherchatpfp] = useState([]);
    const [otherchatname, setotherchatname] = useState([]);
    const [userverified, isuserverified] = useState(false);
    const [verified, setVerified] = useState([]);
    const [allchatid, setallchatid] = useState([]);
    const [otherchatuid, setotherchatuid] = useState([]);

    // Fetch all chat IDs
    const fetchallchatids = async () => {
        const IDs = [];
        const chatuid = [];
        const docref = doc(db, 'Chat UIDs', auth.currentUser.uid);
        const docSnap = await getDoc(docref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            IDs.push(...data['IDs']);
        }

        setallchatid(IDs);

        for (let i = 0; i < IDs.length; i++) {
            const docref1 = doc(db, 'Chat Details', IDs[i]);
            const docSnap1 = await getDoc(docref1);

            if (docSnap1.exists()) {
                const data1 = docSnap1.data();
                const user1 = data1['User 1'];
                const user2 = data1['User 2'];

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
        const verifiedd = [];

        for (let j = 0; j < chatuid.length; j++) {
            const docref2 = doc(db, 'User Details', chatuid[j]);
            const docSnap2 = await getDoc(docref2);
            if (docSnap2.exists()) {
                const data2 = docSnap2.data();
                pfps.push(data2['Profile Pic']);
                names.push(data2['Name']);
                uids.push(data2['UserId']);
                verifiedd.push(data2['Verified'] || false);
            }
        }

        setotherchatpfp(pfps);
        setVerified(verifiedd);
        setotherchatname(names);
        setotherchatuid(uids);
    };

    // Fetch chat details
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

    // Fetch chat owner details
    const fetchchatownerdetails = async () => {
        if (!chatUID) return;
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

    // Fetch messages and mark as seen
    useEffect(() => {
        const messagesRef = collection(db, 'Chats', ChatID, 'Messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const messagesArr = [];
            querySnapshot.forEach((docSnapshot) => {
                messagesArr.push(docSnapshot.data());
            });

            setMessages(messagesArr);

            // Mark messages as seen for the current user
            querySnapshot.forEach(async (docSnapshot) => {
                const message = docSnapshot.data();
                if (message.senderId !== auth.currentUser.uid && !message.seen) {
                    const messageDocRef = doc(db, 'Chats', ChatID, 'Messages', docSnapshot.id);
                    await updateDoc(messageDocRef, { seen: true });
                }
            });
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, [ChatID]);

    // Handle pressing 'Enter' to send message
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    // Send message
    const sendMessage = async () => {
        if (messageText.trim() === '') return; // Prevent sending empty message
        const messagesRef = collection(db, 'Chats', ChatID, 'Messages');
        await addDoc(messagesRef, {
            senderId: auth.currentUser.uid,
            message: messageText,
            timestamp: Timestamp.now(),
            seen: false,
        });
        setMessageText('');
    };

    // Fetch data on auth state change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
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

        return () => unsubscribe();
    }, [ChatID, chatUID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="jndvnfnf" style={{ overflowY: "auto", maxHeight: "100vh", display: "flex", flexDirection: "row", marginTop: "0px", marginLeft: "0px", width: "100%", gap: "0px" }}>
            {/* Sidebar with chat list */}
            <div className="emnfmdkvm">
                {otherchatname.map((name, index) => (
                    <div className="ekfkmv" key={index}>
                        <Link style={{ textDecoration: 'none', color: 'white' }} to={`/direct/t/${allchatid[index]}`}>
                            <div className="wwkdwkdm">
                                <img src={otherchatpfp[index]} alt={name} style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                            </div>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: 'white' }} to={`/direct/t/${allchatid[index]}`}>
                            <div className="kkmf" style={{ color: 'white', fontWeight: '400', display: 'flex', flexDirection: "row", gap: '5px' }}>
                                {name}
                                <div style={{ marginTop: "2px" }}>
                                    {verified[index] ? (
                                        <svg aria-label="Verified" className="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12">
                                            <title>Verified</title>
                                            <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path>
                                        </svg>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Chat Box */}
            <div className="mdnfmd">
                <div className="jnefjnedf" style={{ position: 'fixed' }}>
                    <Link style={{ textDecoration: 'none', color: 'white' }} to={`/others/${chatUID}`}>
                        <div className="wwkdwkdm">
                            <img src={pfp} alt={name} style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                        </div>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'white', display: "flex", flexDirection: "row", gap: '5px' }} to={`/others/${chatUID}`}>
                        <div className="kkmf">
                            {name}
                        </div>
                        <div style={{ marginTop: "2px" }}>
                            {userverified ? (
                                <svg aria-label="Verified" className="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12">
                                    <title>Verified</title>
                                    <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path>
                                </svg>
                            ) : null}
                        </div>
                    </Link>
                </div>

                {/* Messages Display */}
                <div className="nbfh" style={{ marginTop: '100px', height: 'calc(100vh - 200px)', overflowY: 'scroll', overflowX: 'hidden' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: msg.senderId === auth.currentUser.uid ? 'flex-end' : 'flex-start',
                            padding: '10px',
                        }}>
                        {
                            msg.senderId === auth.currentUser.uid ?<></>:<div style={{height: '35px',width:'35px',borderRadius:'50%',backgroundColor:'white'}}>
                            <img src={pfp} alt="" height={'35px'} width={'35px'} style={{borderRadius:'50%'}}/>
                        </div>
                        }
                            <div style={{
                                backgroundColor: msg.senderId === auth.currentUser.uid ? '#3797F0' : '#1F2937',
                                color: msg.senderId === auth.currentUser.uid ? '#fff' : '#fff',
                                padding: '8px 12px',
                                borderRadius: '15px',
                                marginLeft:'10px',
                                display: 'inline-block',
                            }}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="jedbfcned" style={{ position: 'fixed' }}>
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="ehfjnfn"
                        
                    />
                </div>
            </div>
        </div>
    );
}
