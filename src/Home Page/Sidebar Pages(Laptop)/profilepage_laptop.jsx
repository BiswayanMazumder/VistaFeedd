import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
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

export default function Profilepage_laptop() {
    const [profilepicture, setprofilepicture] = useState('');
    const [name, setname] = useState('');
    const [bio, setbio] = useState('');
    useEffect(() => {
        const fetchdp = async () => {
            const Uid = auth.currentUser.uid;
            const docRef = doc(db, "User Details", Uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setprofilepicture(docSnap.data()['Profile Pic']);
                setname(docSnap.data()['Name']);
                setbio(docSnap.data()['Bio'] || 'No bio set');

            }
        }
        fetchdp();
    }, []);
    useEffect(() => {
        document.title = `${name} - VistaFeedd`
    })
    const [posts, setposts] = useState([]);
    const [postimages, setpostimages] = useState([]);
    const [postcaptions, setpostcaptions] = useState([]);
    const [followers, setfollowers] = useState([]);
    const [following, setfollowing] = useState([]);
    useEffect(() => {
        const fetchposts = async () => {
            const Uid = auth.currentUser.uid;
            const docsnap = doc(db, "Global Post IDs", 'Posts');
            const postids = [];
            const snapshot = await getDoc(docsnap);
            if (snapshot.exists()) {
                setposts(snapshot.data()['Post IDs'] || []);
                postids.push(snapshot.data()['Post IDs']);
            }
            for (var i = 0; i < postids.length; i++) {
                const postref = doc(db, "Global Post", 'Posts', postids[i]);
                const docSnap = await getDoc(postref);
                if (docSnap.exists()) {
                    if (docSnap.data()['Uploaded UID'] == auth.currentUser.uid) {
                        setpostimages(docSnap.data()['Image Link']);
                        setpostcaptions(docSnap.data()['Caption']);
                    }
                }
            }
        }
        fetchposts();
    }, [])
    useEffect(() => {
        const fetchfollowers = async () => {
            const Uid = auth.currentUser.uid;
            const docsnap = doc(db, 'Followers', Uid);
            const snapshot = await getDoc(docsnap);
            if (snapshot.exists()) {
                setfollowers(snapshot.data()['Followers ID'] || []);
            }
        }
        fetchfollowers();
    }
        , [])
    useEffect(() => {
        const fetchfollowing = async () => {
            const Uid = auth.currentUser.uid;
            const docsnap = doc(db, 'Following', Uid);
            const snapshot = await getDoc(docsnap);
            if (snapshot.exists()) {
                setfollowers(snapshot.data()['Following ID'] || []);
            }
        }
        fetchfollowing();
    }
        , [])
    return (
        <div className="jdnvnmvnd" style={{ color: "white", overflow: "hidden" }}>
            <div className="krkmfkfvm">
                <div className="ehfjdv">
                    <div className="nkvmvdl" style={{ height: '100px', width: "100px", borderRadius: "50%", backgroundColor: "white" }}>
                        <img src={profilepicture} alt="" height={"100px"} width={"100px"} style={{ borderRadius: "50%" }} />
                    </div>
                </div>
                <div className="krmfvm">
                    <div className="mdnvmn" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                        <div className="ddvbnd">
                            {name}
                        </div>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="ddvbnd" style={{ height: "25px", width: "85px", borderRadius: "5px", backgroundColor: "grey", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "12px" }}>
                                Edit Profile
                            </div>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="ddvbnd" style={{ height: "25px", width: "85px", borderRadius: "5px", backgroundColor: "grey", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "12px" }}>
                                View Archieve
                            </div>
                        </Link>
                    </div>
                    <div className="jkdnfkd">
                        <div className="kvmf">
                            {
                                postimages.length > 0 ? postimages.length + ' Posts' : postimages.length + ' Post'
                            }
                        </div>
                        <div className="kvmf">
                            {
                                followers.length > 0 ? followers.length + ' Followers' : followers.length + ' Follower'
                            }
                        </div>
                        <div className="kvmf">
                            {
                                following.length > 0 ? following.length + ' Followings' : following.length + ' Following'
                            }
                        </div>
                    </div>
                    <div className="jkdnfkd">
                        <div className="kvmf" style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", textAlign: "start" }}>
                            {bio}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
