import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { arrayRemove, arrayUnion, doc, getDoc, getFirestore, setDoc } from '@firebase/firestore';

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

export default function HomePage_Laptop() {
    const [postImages, setPostImages] = useState([]);
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [tabOpened, setTabOpened] = useState('POSTS');
    const [captions, setcaptions] = useState([]);
    const [uploaddates, setUploaddates] = useState([]);
    const [uploadeduid, setUploaduid] = useState([]);
    const [uploadernames, setUploadernames] = useState([]);
    const [uploaderpfps, setUploaderpfps] = useState([]);
    const [uid, setUid] = useState(null);
    const [PostID, setPostID] = useState([]);
    const [liked, setLiked] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                fetchPosts(user.uid);
            } else {
                console.log("User not logged in");
                setPosts([]);
            }
        });

        return () => unsubscribe();
    }, []);
    const [likedname, setlikedname] = useState([]);
    const fetchPosts = async (userId) => {
        const Following=[];
        const docSnap=doc(db,'Following',userId);
        const followingSnap=await getDoc(docSnap);
        if(followingSnap.exists()){
            Following.push(...followingSnap.data()['Following ID']||[]);
        }
        console.log('Following',Following);
        const docsnap = doc(db, "Global Post IDs", 'Posts');
        const snapshot = await getDoc(docsnap);
        if (snapshot.exists()) {
            const postIds = snapshot.data()['Post IDs'] || [];
            setPosts(postIds);

            const postsData = await Promise.all(postIds.map(async (postId) => {
                const postRef = doc(db, "Global Post", postId);
                const postSnap = await getDoc(postRef);
                const postData = postSnap.data();

                return {
                    imageLink: postData['Image Link'],
                    caption: postData['Caption'],
                    uploadDate: postData['Upload Date'],
                    uploadedUID: postData['Uploaded UID'],
                    Postid: postData['postid']
                };
            }));

            const filteredPosts = postsData.filter(post => post.uploadedUID !== userId && Following.includes(post.uploadedUID));
            setPostImages(filteredPosts.map(post => post.imageLink).filter(Boolean));
            setcaptions(filteredPosts.map(post => post.caption));
            setUploaddates(filteredPosts.map(post => post.uploadDate));
            setUploaduid(filteredPosts.map(post => post.uploadedUID));
            setPostID(filteredPosts.map(post => post.Postid));
            fetchUserDetails(filteredPosts.map(post => post.uploadedUID));

            // Initialize liked state
            const likesuids = [];
            const likesState = await Promise.all(filteredPosts.map(async (post) => {
                const docref = doc(db, 'Post Likes', post.Postid);
                const likesSnapshot = await getDoc(docref);
                // setlikeduid(likesSnapshot.data()['likes'])
                likesuids.push(likesSnapshot.data()['likes']);
                return likesSnapshot.exists() ? likesSnapshot.data()['likes'].includes(userId) : false;
            }));
            setLiked(likesState);
            // console.log('Liked UIDs', likesuids);
        }
    };

    const fetchUserDetails = async (uids) => {
        for (const uid of uids) {
            const docsnap = doc(db, "User Details", uid);
            const snapshot = await getDoc(docsnap);
            if (snapshot.exists()) {
                const userData = snapshot.data();
                setUploadernames(prevNames => [...prevNames, userData['Name']]);
                setUploaderpfps(prevPfps => [...prevPfps, userData['Profile Pic']]);
            }
        }
    };

    const handleLikeToggle = async (index) => {
        const postIDToUpdate = PostID[index];
        const isLiked = liked[index];
        const docref = doc(db, 'Post Likes', postIDToUpdate);

        const updateData = {
            likes: isLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
        };

        await setDoc(docref, updateData, { merge: true });
        setLiked(prevLiked => {
            const newLiked = [...prevLiked];
            newLiked[index] = !isLiked;
            return newLiked;
        });
    };

    function formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const seconds = Math.floor((now - date) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + " y" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " M" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " d" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " h" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " m" + (interval > 1 ? "s" : "");
        return seconds + " second" + (seconds > 1 ? "s" : "") + " ago";
    }
    const [saved, setsaved] = useState([]);
    const fetchsaved = async () => {
        const uid = auth.currentUser.uid;
        const docsnap = doc(db, "Saved Posts", uid);
        const snapshot = await getDoc(docsnap);
        const saveddata = [];
        if (snapshot.exists()) {
            const savedposts = snapshot.data()['POST IDs'] || [];
            saveddata.push(savedposts);
            setsaved(savedposts);
        }
        // console.log('Saved', saveddata);
    }
    useEffect(() => {
        fetchsaved();
    }, []);

    return (
        <div className="jndvnfnf" style={{ overflowY: "auto", maxHeight: "90vh" }}>
            <div className="jjrjnv">
                {postImages.length > 0 && (
                    postImages.map((image, index) => (
                        <div className="jfnvnf" key={index}>
                            <div className="jdjvnfv" style={{ height: '40px', width: '40px', borderRadius: '50%' }}>
                                <img src={uploaderpfps[index]} alt="" height={40} width={40} style={{ borderRadius: '50%' }} />
                                <div style={{ marginTop: '15px', whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'ellipsis', maxWidth: '120px', fontSize: '14px', display: 'flex', justifyContent: 'start', flexDirection: 'row', gap: '5px' }} className='enjfendf'>
                                <Link style={{ textDecoration: 'none', color: 'white' }} to={`/others/${uploadeduid[index]}`}>
                            <div onClick={()=>{
                                localStorage.setItem('clickeduid', uploadeduid[index]);
                            }}>{uploadernames[index]}</div>
                            </Link>
                                    <div style={{ color: 'grey' }}>•</div>
                                    <div style={{ color: 'grey', fontWeight: '300' }}>{formatTimeAgo(uploaddates[index])}</div>
                                </div>
                            </div>
                            <div className="jefjn" style={{ marginTop: '30px' }}>
                                <img src={image} alt="" height={'500px'} width={'500px'} style={{ borderRadius: '10px' }} />
                            </div>
                            <div className="jefjnkrjg" style={{ display: 'flex', justifyContent: 'start', flexDirection: 'row', gap: '20px', marginTop: '10px' }}>
                                <Link style={{ textDecoration: 'none', color: "white" }}>
                                    <div onClick={() => handleLikeToggle(index)}>
                                        {liked[index] ?
                                            <svg aria-label="Unlike" fill="red" height="24" viewBox="0 0 48 48" width="24">
                                                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                                            </svg> :
                                            <svg aria-label="Like" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                                                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                            </svg>
                                        }
                                    </div>
                                </Link>
                                <div>
                                    <svg aria-label="Comment" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                                        <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
                                    </svg>
                                </div>
                                <Link style={{ textDecoration: 'none', color: "white" }}>
                                    <div onClick={async () => {
                                        const docref = doc(db, 'Saved Posts', auth.currentUser.uid);
                                        const isSaved = saved.includes(PostID[index]); // Check if post is already saved

                                        const datatoupdate = {
                                            'POST IDs': isSaved ? arrayRemove(PostID[index]) : arrayUnion(PostID[index])
                                        };

                                        // Update the document in Firestore
                                        await setDoc(docref, datatoupdate, { merge: true });

                                        // Immediately update local saved state
                                        if (isSaved) {
                                            setsaved(prevSaved => prevSaved.filter(id => id !== PostID[index])); // Remove from state
                                        } else {
                                            setsaved(prevSaved => [...prevSaved, PostID[index]]); // Add to state
                                        }
                                    }}>
                                        {saved.includes(PostID[index]) ? (
                                            <svg aria-label="Remove" className="x1lliihq x1n2onr6 x5n08af" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                <title>Remove</title>
                                                <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
                                            </svg>
                                        ) : (
                                            <svg aria-label="Save" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                <title>Save</title>
                                                <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                                            </svg>
                                        )}
                                    </div>
                                </Link>

                            </div>
                            <div className="jefjn" style={{ marginTop: '10px', fontWeight: '300', fontSize: '14px', width: '500px', display: 'flex', justifyContent: 'start', flexDirection: 'row', gap: '10px' }}>
                                <div style={{ fontWeight: "600" }}>{uploadernames[index]}</div>
                                {captions[index]}
                            </div>
                            <br /><br />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
