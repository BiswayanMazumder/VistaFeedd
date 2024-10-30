import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

export default function ExplorePage_mobile() {
  const [postImages, setPostImages] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const docsnap = doc(db, "Global Post IDs", 'Posts');
        const snapshot = await getDoc(docsnap);
        if (snapshot.exists()) {
          const postIds = snapshot.data()['Post IDs'] || [];
          const images = await Promise.all(postIds.map(async (postId) => {
            const postRef = doc(db, "Global Post", postId);
            const postSnap = await getDoc(postRef);
            return postSnap.exists() && postSnap.data()['Uploaded UID'] === uid ? postSnap.data()['Image Link'] : postSnap.data()['Image Link'];
          }));
          setPostImages(images.filter(Boolean));
        }
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ color: "white", backgroundColor: "black", display: "flex", flexWrap: "wrap", justifyContent: "start", alignItems: "start",position:"fixed",top:"0" ,marginTop:"50px",width:"100%",marginLeft:"20px"}}>
      {postImages.map((image, index) => (
        <Link key={index}>
          <img src={image} alt="" height={"139px"} width={"139px"} style={{ borderRadius: '10px',marginRight:"10px"  }} />
        </Link>
      ))}
    </div>
  );
}
