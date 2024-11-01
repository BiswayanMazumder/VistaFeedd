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

const Profilepage_laptop = () => {
    const [profilePicture, setProfilePicture] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('No bio set');
    const [posts, setPosts] = useState([]);
    const [postImages, setPostImages] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [tabOpened, setTabOpened] = useState('POSTS');
    const [modalOpen, setModalOpen] = useState(false);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user.uid);
                fetchPosts(user.uid);
                fetchFollowers(user.uid);
                fetchFollowing(user.uid);
            } else {
                // Handle user not logged in
                console.log("User not logged in");
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const fetchUserData = async (uid) => {
        const docRef = doc(db, "User Details", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setProfilePicture(data['Profile Pic']);
            setName(data['Name']);
            setBio(data['Bio'] || 'No bio set');
        }
    };

    const fetchPosts = async (uid) => {
        const postIds = [];
        const docsnap = doc(db, "Global Post IDs", 'Posts');
        const snapshot = await getDoc(docsnap);
        
        if (snapshot.exists()) {
            const ids = snapshot.data()['Post IDs'] || [];
            const images = await Promise.all(ids.map(async (postId) => {
                const postRef = doc(db, "Global Post", postId);
                const postSnap = await getDoc(postRef);
                
                if (postSnap.exists()) {
                    const postData = postSnap.data();
                    if (postData['Uploaded UID'] === uid) {
                        postIds.push(postData['postid']); // Store the postid
                        return postData['Image Link'];
                    }
                }
                return null; // If post doesn't exist or UID doesn't match
            }));
            
            setPosts(postIds); // Set the post IDs to state
            setPostImages(images.filter(Boolean)); // Filter out null values
        }
    };
    

    const fetchFollowers = async (uid) => {
        const docSnap = await getDoc(doc(db, 'Followers', uid));
        if (docSnap.exists()) {
            setFollowers(docSnap.data()['Followers ID'] || []);
        }
    };

    const fetchFollowing = async (uid) => {
        const docSnap = await getDoc(doc(db, 'Following', uid));
        if (docSnap.exists()) {
            setFollowing(docSnap.data()['Following ID'] || []);
        }
    };

    useEffect(() => {
        document.title = `${name} - VistaFeedd`;
    }, [name]);

    return (
        <div className="jdnvnmvnd" style={{ color: "white", overflow: "hidden" }}>
            <div className="krkmfkfvm">
                <div className="ehfjdv">
                    <div className="nkvmvdl" style={{ height: '100px', width: "100px", borderRadius: "50%", backgroundColor: "white" }}>
                        <img src={profilePicture} alt="" height={"100px"} width={"100px"} style={{ borderRadius: "50%" }} />
                    </div>
                </div>
                <div className="krmfvm">
                    <div className="mdnvmn" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                        <div className="ddvbnd">{name}</div>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="ddvbnd" style={{ height: "25px", width: "85px", borderRadius: "5px", backgroundColor: "grey", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "12px" }}>
                                Edit Profile
                            </div>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="ddvbnd" style={{ height: "25px", width: "85px", borderRadius: "5px", backgroundColor: "grey", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "12px" }}>
                                View Archive
                            </div>
                        </Link>
                    </div>
                    <div className="jkdnfkd">
                        <div className="kvmf">{postImages.length} {postImages.length === 1 ? 'Post' : 'Posts'}</div>
                        <div className="kvmf">{followers.length} {followers.length === 1 ? 'Follower' : 'Followers'}</div>
                        <div className="kvmf">{following.length} {following.length === 1 ? 'Following' : 'Followings'}</div>
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
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} onClick={() => setTabOpened('POSTS')}>
                        <svg aria-label="" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
                            <title></title>
                            <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                        </svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabOpened === 'POSTS' ? "bold" : "400" }}>
                            POSTS
                        </div>
                    </div>
                </Link>
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} onClick={() => setTabOpened('SAVED')}>
                        <svg aria-label="" className="x1lliihq x1n2onr6 x1roi4f4" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
                            <title></title>
                            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabOpened === 'SAVED' ? "bold" : "400" }}>
                            SAVED
                        </div>
                    </div>
                </Link>
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} onClick={() => setTabOpened('TAGGED')}>
                        <svg aria-label="" className="x1lliihq x1n2onr6 x1roi4f4" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
                            <title></title>
                            <path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            <path d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            <circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                        </svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabOpened === 'TAGGED' ? "bold" : "400" }}>
                            TAGGED
                        </div>
                    </div>
                </Link>
            </div>
            {tabOpened === 'POSTS' && (
                <div className="dmdnvfnvk">
                    {postImages.length === 0 ? (
                        <div className="nnjfnvj">
                            <svg aria-label="Camera" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="62" role="img" viewBox="0 0 96 96" width="62">
                                <title>Camera</title>
                                <circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></circle>
                                <ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.095"></ellipse>
                                <path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                            <br />
                            No Posts Yet
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "start", flexDirection: "row", marginLeft: "50px", alignContent: "start", width: "80%", marginTop: "-10px" }}>
                            {postImages.map((image, index) => (
                                <Link key={index} to={`/post/${posts[index]}`}>
                                    <div style={{ margin: '5px' }} onClick={() => setModalOpen(true)}>
                                        <img src={image} alt="" height={"308px"} width={"308px"} style={{ borderRadius: '10px' }} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profilepage_laptop;
