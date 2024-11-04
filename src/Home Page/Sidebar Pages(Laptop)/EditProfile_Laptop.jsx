import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { doc, getDoc, getFirestore, updateDoc } from '@firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage(app);

export default function EditProfile_Laptop() {
    useEffect(() => {
        document.title = 'Edit profile • VistaFeedd';
    }, []);

    const [profilePicture, setProfilePicture] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('No bio set');
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user.uid);
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

    const handleChangePhoto = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result; // Get base64 string of the image

                // Create a storage reference
                const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);

                try {
                    // Upload the image
                    await uploadString(storageRef, base64Image, 'data_url');

                    // Get the download URL
                    const downloadURL = await getDownloadURL(storageRef);

                    // Update the Firestore document
                    await updateDoc(doc(db, "User Details", auth.currentUser.uid), {
                        'Profile Pic': downloadURL
                    });

                    // Update the local state to reflect the new profile picture
                    setProfilePicture(downloadURL);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
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
            <div className="rfmn">
                Bio
            </div>
            <div className="ejfefn">
                <input
                    type="text"
                    value={bio}
                    className='enbfemnf'
                    onChange={(e) => setBio(e.target.value)} // Corrected here
                />

            </div>
            <div
                className="mddnfmn"
                style={{ textDecoration: 'none', color: "white", cursor: 'pointer' }}
                onClick={async () => {
                    await updateDoc(doc(db, "User Details", auth.currentUser.uid), {
                        'Bio': bio
                    });
                }}
            >
                Submit Bio
            </div>
        </div>
    );
}
