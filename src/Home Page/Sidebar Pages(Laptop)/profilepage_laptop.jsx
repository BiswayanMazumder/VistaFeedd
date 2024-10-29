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
    const [tabopened, settabopened] = useState('POSTS');

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
            <div className="jrnknrv">
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                        <svg aria-label="" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><rect fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabopened == 'POSTS' ? "bold" : "400" }} onClick={() => settabopened('POSTS')}>
                            POSTS
                        </div>
                    </div>
                </Link>
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                        <svg aria-label="" class="x1lliihq x1n2onr6 x1roi4f4" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabopened == 'SAVED' ? "bold" : "400" }} onClick={() => settabopened('SAVED')}>
                            SAVED
                        </div>
                    </div>
                </Link>
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                        <svg aria-label="" class="x1lliihq x1n2onr6 x1roi4f4" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle></svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabopened == 'TAGGED' ? "bold" : "400" }} onClick={() => settabopened('TAGGED')}>
                            TAGGED
                        </div>
                    </div>
                </Link>
            </div>
            {
                tabopened==='POSTS'?<div className="dmdnvfnvk">
            {
                postimages.length===0?<div className="nnjfnvj">
            <svg aria-label="Camera" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="62" role="img" viewBox="0 0 96 96" width="62"><title>Camera</title><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></circle><ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" stroke-linejoin="round" stroke-width="2.095"></ellipse><path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
            <br />
            No Posts Yet

            </div>:<></>
            }
            </div>:<></>
            }
        </div>
    )
}
