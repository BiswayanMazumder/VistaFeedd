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
export default function ProfilePage_Mobile() {
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
                    for (const postId of postids) {
                        const postref = doc(db, "Global Post", postId);
                        const docSnap = await getDoc(postref);
                        if (docSnap.exists()) {
                            if (docSnap.data()['Uploaded UID'] === Uid) {
                                const imageLink = docSnap.data()['Image Link'];
                                if (typeof imageLink === 'string') {
                                    images.push(imageLink);
                                }
                            }
                        }
                    }
                    setpostimages(images);
                }
            }
        };
        fetchPosts();
    }, []);
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
    const [tabopened, settabopened] = useState('POSTS')
    return (
        <div className="profile-container" style={{ color: "white", overflow: "hidden", padding: "20px" }}>
            <div className="profile-header" style={{ display: "flex", flexDirection: "row", gap: "20px", marginTop: "20px", alignItems: "center" }}>
                <div className="profile-picture" style={{ height: "70px", width: "70px", borderRadius: "50%", overflow: "hidden" }}>
                    <img src={profilepicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                </div>
                <div className="profile-info" style={{ display: "flex", flexDirection: "column" }}>
                    <div>{name}</div>
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
            <div className="profile-stats" style={{ display: "flex", gap: "20px", marginTop: "20px",width:"85vw",justifyContent:"space-evenly" }}>
                <div>{postimages.length} {postimages.length === 1 ? 'Post' : 'Posts'}</div>
                <div>{followers.length} {followers.length === 1 ? 'Follower' : 'Followers'}</div>
                <div>{following.length} Following</div>
            </div>
            <div className="tab-navigation" style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
                <div onClick={() => settabopened('POSTS')} style={{ cursor: "pointer", color: tabopened === 'POSTS' ? "blue" : "white" }}>
                    {/* SVG for Posts */}
                </div>
                <div onClick={() => settabopened('TAGGED')} style={{ cursor: "pointer", color: tabopened === 'TAGGED' ? "blue" : "white" }}>
                    {/* SVG for Tagged */}
                </div>
            </div>
            <div className="posts-container" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {
                    tabopened === 'POSTS' ? (
                        postimages.length === 0 ? (
                            <div className="no-posts-message" style={{ textAlign: "center", width: "100%", marginTop: '80px' }}>
                                {/* No Posts Message */}
                            </div>
                        ) : (
                            postimages.map((image, index) => (
                                <Link key={index} style={{ margin: '5px' }}>
                                    <img src={image} alt="" style={{ width: "139px", height: "139px", borderRadius: '10px' }} />
                                </Link>
                            ))
                        )
                    ) : null
                }
            </div>
        </div>
    );
    
}
