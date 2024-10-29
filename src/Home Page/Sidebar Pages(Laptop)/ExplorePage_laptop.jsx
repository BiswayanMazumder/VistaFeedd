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

export default function ExplorePage_laptop() {
  const [postImages, setPostImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [tabOpened, setTabOpened] = useState('POSTS');

  useEffect(() => {
    const fetchPosts = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const docsnap = doc(db, "Global Post IDs", 'Posts');
        const snapshot = await getDoc(docsnap);
        if (snapshot.exists()) {
          const postIds = snapshot.data()['Post IDs'] || [];
          setPosts(postIds);
          const images = await Promise.all(postIds.map(async (postId) => {
            const postRef = doc(db, "Global Post", postId);
            const postSnap = await getDoc(postRef);
            return postSnap.exists() && postSnap.data()['Uploaded UID'] === uid ? postSnap.data()['Image Link'] : null;
          }));
          setPostImages(images.filter(Boolean));
        }
      }
    };
    fetchPosts();
  }, []);
  useEffect(() => {

  })
  return (
    <div className="jdnvnmvnd" style={{ color: "white", width: "fit-content", backgroundColor: "black", height: "fit-content", display: "flex", justifyContent: "start", alignItems: "start", flexDirection: "row", flexWrap: "wrap", marginTop: "50px", marginLeft: "50px",marginRight:"50px" }}>
      {postImages.map((image, index) => (
        <Link key={index}>
          <div style={{ margin: '5px' }}>
            <img src={image} alt="" height={"308px"} width={"308px"} style={{ borderRadius: '10px',marginRight:"10px" }} />
          </div>
        </Link>
      ))}
    </div>
  )
}
