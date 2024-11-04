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

export default function EditProfile_Laptop() {
    useEffect(() => {
        document.title = 'Edit profile • VistaFeedd';
    })
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
    const [saved, setsaved] = useState([]);
    const [savedimage, setsavedimage] = useState([]);
    const [savedpost, setsavedpost] = useState([]);
    const fetchsaved = async () => {
        const uid = auth.currentUser.uid;
        const docsnap = doc(db, "Saved Posts", uid);
        const snapshot = await getDoc(docsnap);
        const saveddata = []; // Array to hold post ID
        const savedimages = [];
        const savedpostid = []
        if (snapshot.exists()) {
            const savedposts = snapshot.data()['POST IDs'] || [];
            // Push each ID individually to saveddata
            saveddata.push(...savedposts); // Spread operator to flatten
            setsaved(savedposts);
        }

        // console.log(`Saved`, saveddata); 

        for (let i = 0; i < saveddata.length; i++) {
            const postRef = doc(db, "Global Post", saveddata[i]); // Use saveddata[i] directly
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const postData = postSnap.data();
                savedpostid.push(postData['postid']);
                savedimages.push(postData['Image Link']);
            }
            // console.log('Images',savedimages);
        }
        setsavedpost(savedpostid);
        setsavedimage(savedimages);
    };

    useEffect(() => {
        fetchsaved();
    }, []);
    return (
        <div className="jdnvnmvnd" style={{ color: "white", overflow: "hidden" }}>
            <div className="mnvmv">
                <div className="rjhgjrg">
                    <div className="rjrnmrg">
                        <img src={profilePicture} alt="" height={"80px"} width={"80px"} style={{ borderRadius: "50%" }} />
                    </div>
                    <h3>{name}</h3>
                </div>
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="njfjf">
                        Change Photo
                    </div>
                </Link>
            </div>
        </div>
    )
}
