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
    const [uid, setUid] = useState(null); // Store user UID

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                fetchPosts(user.uid);
            } else {
                // Handle user not logged in case
                console.log("User not logged in");
                setPosts([]); // Clear posts or handle as needed
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const fetchPosts = async (userId) => {
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
                };
            }));

            // Filter out posts by the current user's UID
            const filteredPosts = postsData.filter(post => post.uploadedUID !== userId);

            setPostImages(filteredPosts.map(post => post.imageLink).filter(Boolean));
            setcaptions(filteredPosts.map(post => post.caption));
            setUploaddates(filteredPosts.map(post => post.uploadDate));
            setUploaduid(filteredPosts.map(post => post.uploadedUID));

            fetchUserDetails(filteredPosts.map(post => post.uploadedUID));
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

    return (
        <div className="jndvnfnf" style={{ overflowY: "auto", maxHeight: "90vh" }}>
            <div className="jjrjnv">
                {postImages.length > 0 && (
                    postImages.map((image, index) => (
                        <div className="jfnvnf" key={index}>
                            <div className="jdjvnfv" style={{ height: '40px', width: '40px', borderRadius: '50%' }}>
                                <img src={uploaderpfps[index]} alt="" height={40} width={40} style={{ borderRadius: '50%' }} />
                                <div style={{ marginTop: '15px', whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'ellipsis', maxWidth: '120px' }} className='enjfendf'>
                                    {uploadernames[index]}
                                </div>
                            </div>
                            <div className="jefjn" style={{ marginTop: '30px' }}>
                                <img src={image} alt="" height={'500px'} width={'500px'} style={{ borderRadius: '10px' }} />
                            </div>
                            <div className="jefjn" style={{ marginTop: '20px', fontWeight: '300', fontSize: '12px', width: '500px', display: 'flex', justifyContent: 'start', flexDirection: 'row', gap: '10px' }}>
                                <div style={{ fontWeight: "600" }}>
                                    {uploadernames[index]}
                                </div>
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
