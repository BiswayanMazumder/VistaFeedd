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
    }, []);

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
                console.log("User not logged in");
            }
        });

        return () => unsubscribe();
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
                        postIds.push(postData['postid']);
                        return postData['Image Link'];
                    }
                }
                return null;
            }));

            setPosts(postIds);
            setPostImages(images.filter(Boolean));
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

    const handleChangePhoto = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Update profile picture state
                setProfilePicture(reader.result); // Set the new profile picture
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="jdnvnmvnd" style={{ color: "white", overflow: "hidden" }}>
            <div className="mnvmv">
                <div className="rjhgjrg">
                    <div className="rjrnmrg">
                        <img 
                            src={profilePicture} 
                            alt="" 
                            height={"80px"} 
                            width={"80px"} 
                            style={{ borderRadius: "50%" }} 
                        />
                    </div>
                    <h3>{name}</h3>
                </div>
                <div 
                    className="njfjf" 
                    style={{ textDecoration: 'none', color: "white", cursor: 'pointer' }} 
                    onClick={handleChangePhoto}
                >
                    Change Photo
                </div>
                <input 
                    id="fileInput" 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                />
            </div>
        </div>
    );
}
