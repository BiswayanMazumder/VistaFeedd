import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

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

export default function Notification_mobile() {
    const [selectedtab, setselectedtab] = useState('FOLLOWS');
    const [whofollowd, setwhofollowed] = useState([]);
    const [followername, setfollowername] = useState([]);
    const [followerUID, setfollowerUID] = useState([]);
    const [followerpfp, setfollowerpfp] = useState([]);

    const changetab = (tab) => setselectedtab(tab);

    const fetchUserNotifications = async () => {
        try {
            const notifQuery = query(
                collection(db, 'Notifications Details'),
                where('To Followed', '==', auth.currentUser.uid)
            );
            const querySnapshot = await getDocs(notifQuery);
            if (querySnapshot.empty) return [];

            const notifications = querySnapshot.docs.map(doc => doc.data());
            const whoFollowed = notifications.map(notification => notification['Who Followed']);
            setwhofollowed(whoFollowed);
            return whoFollowed;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    };

    const fetchfollownotifuserdetails = async (followers) => {
        const Name = [];
        const PFP = [];
        const UIDS = [];

        const promises = followers.map(async (userID) => {
            const docRef = doc(db, 'User Details', userID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                Name.push(data['Name']);
                PFP.push(data['Profile Pic']);
                UIDS.push(data['UserId']);
            }
        });

        await Promise.all(promises);
        setfollowername(Name);
        setfollowerpfp(PFP);
        setfollowerUID(UIDS);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const followers = await fetchUserNotifications();
                await fetchfollownotifuserdetails(followers);
            } else {
                console.log("User not logged in");
            }
        });

        return () => unsubscribe();
    }, []);
    return (
        <div className="jndvnfnf" style={{ overflowY: "auto", maxHeight: "100vh", display: "flex", flexDirection: "column", marginTop: "0px", marginLeft: "0px", width: "100%", gap: "0px" }}>
            <div className="dnjndv">
                <div className="ufgfgf">
                    <Link style={{ textDecoration: 'none', color: "white" }}>
                        <div className="bvnf" style={{ backgroundColor: selectedtab === 'FOLLOWS' ? "white" : '#1F2937', color: selectedtab === 'FOLLOWS' ? "black" : "white", fontWeight: selectedtab === 'FOLLOWS' ? "600" : "500" }} onClick={() => changetab('FOLLOWS')}>
                            Follows
                        </div>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: "white" }}>
                        <div className="bvnf" style={{ backgroundColor: selectedtab === 'LIKES' ? "white" : '#1F2937', color: selectedtab === 'LIKES' ? "black" : "white", fontWeight: selectedtab === 'LIKES' ? "600" : "500" }} onClick={() => changetab('LIKES')}>
                            Likes
                        </div>
                    </Link>
                </div>
            </div>
            {
                    selectedtab === 'FOLLOWS' ?<div className="jefjf">
                    {
                        followerUID.map((followerUID, index) => (
                            <div className='dnvjnvjn' key={index}>
                            <div style={{ fontWeight: "600",height:"40px",width:"40px",borderRadius:"50%" }}>
                                    <Link style={{ textDecoration: 'none', color: "white" }} to={`/others/${followerUID}`}>
                                        <img src={followerpfp[index]} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                                    </Link>
                                </div>
                                <div style={{ fontWeight: "600",marginTop:"10px",marginLeft:"5px",fontSize:"12px" }}>
                                    <Link style={{ textDecoration: 'none', color: "white" }} to={`/others/${followerUID}`}>
                                        {followername[index]}
                                    </Link>
                                </div>
                                
                                <div style={{marginTop:"10px",fontSize:"12px"}}>started following you</div>
                            </div>
                        ))
                    }
                </div>:<></>
                }
        </div>
    )
}
