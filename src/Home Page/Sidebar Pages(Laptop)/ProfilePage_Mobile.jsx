import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

export default function ProfilePage_Mobile() {
    const [profilepicture, setprofilepicture] = useState('');
    const [name, setname] = useState('');
    const [bio, setbio] = useState('');
    const [verified,setverified] = useState(false);
    // Fetch user profile information
    useEffect(() => {
        const fetchdp = async () => {
            const Uid = auth.currentUser.uid;
            const docRef = doc(db, "User Details", Uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setprofilepicture(docSnap.data()['Profile Pic']);
                setname(docSnap.data()['Name']);
                setverified(docSnap.data()['Verified']||false);
                setbio(docSnap.data()['Bio'] || 'No bio set');
            }
        };
        fetchdp();
    }, []);
    
    const [posts, setposts] = useState([]);
    const [postimages, setpostimages] = useState([]);
    const [followers, setfollowers] = useState([]);
    const [following, setfollowing] = useState([]);
    const [Posts, setPosts] = useState([]);

    // Fetch posts and related info
    useEffect(() => {
        const fetchPosts = async () => {
            const user = auth.currentUser;
            if (user) {
                const Uid = user.uid;
                const docsnap = doc(db, "Global Post IDs", 'Posts');
                const snapshot = await getDoc(docsnap);
                if (snapshot.exists()) {
                    const postids = snapshot.data()['Post IDs'] || [];
                    setposts(postids);
                    const images = [];
                    const postuids = [];
                    
                    for (const postId of postids) {
                        const postref = doc(db, "Global Post", postId);
                        const docSnap = await getDoc(postref);
                        if (docSnap.exists() && docSnap.data()['Uploaded UID'] === Uid) {
                            postuids.push(docSnap.data()['postid']);
                            const imageLink = docSnap.data()['Image Link'];
                            if (typeof imageLink === 'string') {
                                images.push(imageLink);
                            }
                        }
                    }
                    setPosts(postuids);
                    setpostimages(images);
                }
            }
        };
        fetchPosts();
    }, []);

    // Fetch followers
    useEffect(() => {
        const fetchFollowers = async () => {
            const docSnap = await getDoc(doc(db, 'Followers', auth.currentUser.uid));
            if (docSnap.exists()) {
                setfollowers(docSnap.data()['Followers ID'] || []);
            }
        };
        fetchFollowers();
    }, []);

    // Fetch following
    useEffect(() => {
        const fetchFollowing = async () => {
            const docSnap = await getDoc(doc(db, 'Following', auth.currentUser.uid));
            if (docSnap.exists()) {
                setfollowing(docSnap.data()['Following ID'] || []);
            }
        };
        fetchFollowing();
    }, []);

    const [saved, setsaved] = useState([]);
    const [savedimage, setsavedimage] = useState([]);
    const [savedpost, setsavedpost] = useState([]);

    const fetchsaved = async () => {
        const uid = auth.currentUser.uid;
        const docsnap = doc(db, "Saved Posts", uid);
        const snapshot = await getDoc(docsnap);
        const saveddata = []; 
        const savedimages = [];
        const savedpostid = [];
        if (snapshot.exists()) {
            const savedposts = snapshot.data()['POST IDs'] || [];
            saveddata.push(...savedposts); 
            setsaved(savedposts);
        }

        for (let i = 0; i < saveddata.length; i++) {
            const postRef = doc(db, "Global Post", saveddata[i]);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                const postData = postSnap.data();
                savedpostid.push(postData['postid']);
                savedimages.push(postData['Image Link']);
            }
        }
        setsavedpost(savedpostid);
        setsavedimage(savedimages);
    };
    
    useEffect(() => {
        fetchsaved();
    }, []);

    const [tabopened, settabopened] = useState('POSTS');

    return (
        <div className="profile-container" style={{ color: "white", overflow: "hidden", padding: "20px", maxWidth: "100vw", boxSizing: "border-box" }}>
            <div className="profile-header" style={{ display: "flex", flexDirection: "row", gap: "20px", marginTop: "20px", alignItems: "center" }}>
                <div className="profile-picture" style={{ height: "70px", width: "70px", borderRadius: "50%", overflow: "hidden" }}>
                    <img src={profilepicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                </div>
                <div className="profile-info" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{display:"flex",flexDirection:"row",gap:"10px"}}>{name}
                    {
                        verified?<svg aria-label="Verified" class="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fill-rule="evenodd"></path></svg>:<></>
                    }
                    </div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="button" style={{ backgroundColor: "grey", borderRadius: "5px", padding: "5px 10px", textAlign: "center", fontSize: "12px" }}>
                                Edit Profile
                            </div>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="button" style={{ backgroundColor: "grey", borderRadius: "5px", padding: "5px 10px", textAlign: "center", fontSize: "12px" }}>
                                View Archive
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="profile-bio" style={{ marginTop: "20px" }}>
                {bio}
            </div>
            <div className="profile-stats" style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%", justifyContent: "center",alignItems: "center" }}>
                <div>{postimages.length} {postimages.length === 1 || postimages.length === 0 ? 'Post' : 'Posts'}</div>
                <div>{followers.length} {followers.length === 1 || followers.length === 0 ? 'Follower' : 'Followers'}</div>
                <div>{following.length} Following</div>
            </div>
            <div className="tab-navigation" style={{ marginTop: "20px", display: "flex",flexDirection: "row", width: "100vw", justifyContent: "space-evenly", alignItems: "center" }}>
                <div onClick={() => settabopened('POSTS')} style={{ cursor: "pointer", color: tabopened === 'POSTS' ? "blue" : "white" }}>
                    <svg aria-label="" fill="currentColor" height="12" viewBox="0 0 24 24" width="12">
                        <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                    </svg>
                </div>
                <div onClick={() => settabopened('SAVED')} style={{ cursor: "pointer", color: tabopened === 'SAVED' ? "blue" : "white" }}>
                    <svg aria-label="" fill="currentColor" height="12" viewBox="0 0 24 24" width="12">
                        <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                    </svg>
                </div>
            </div>
            <div className="posts-container" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {tabopened === 'POSTS' ? (
                    postimages.length === 0 ? (
                        <div className="nnjfnvj" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: "100%" }}>
                            <svg aria-label="Camera" fill="currentColor" height="62" viewBox="0 0 96 96" width="62">
                                <circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></circle>
                                <ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.095"></ellipse>
                                <path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                            <br />
                            No Posts Yet
                        </div>
                    ) : (
                        postimages.map((image, index) => (
                            <Link key={index} style={{ margin: '5px' }} to={`/Post/${Posts[index]}`}>
                                <img src={image} alt="" style={{ width: "30vw", maxWidth: "139px", height: "auto", borderRadius: '10px' }} />
                            </Link>
                        ))
                    )
                ) : savedpost.length === 0 ? (
                    <div className="nnjfnvj" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: "100%" }}>
                        <svg aria-label="Camera" fill="currentColor" height="62" viewBox="0 0 96 96" width="62">
                            <circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></circle>
                            <ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.095"></ellipse>
                            <path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <br />
                        No Saved Posts Yet
                    </div>
                ) : (
                    savedpost.map((image, index) => (
                        <Link key={index} style={{ margin: '5px' }} to={`/Post/${savedpost[index]}`}>
                            <img src={savedimage[index]} alt="" style={{ width: "30vw", maxWidth: "139px", height: "auto", borderRadius: '10px' }} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
