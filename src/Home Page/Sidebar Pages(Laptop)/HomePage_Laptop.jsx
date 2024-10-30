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

export default function HomePage_Laptop() {
    function formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

        const seconds = Math.floor((now - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
        return seconds + " second" + (seconds > 1 ? "s" : "") + " ago";
    }
    const [postImages, setPostImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [tabOpened, setTabOpened] = useState('POSTS');
  const [captions,setcaptions] = useState([]);
  const [uploaddates, setUploaddates] = useState([]);
  const [uploadeduid, setUploaduid] = useState([]);
  const fetchPosts = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
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
        const filteredPosts = postsData.filter(post => post.uploadedUID !== uid);

        setPostImages(filteredPosts.map(post => post.imageLink).filter(Boolean));
        setcaptions(filteredPosts.map(post => post.caption));
        setUploaddates(filteredPosts.map(post => post.uploadDate));
        setUploaduid(filteredPosts.map(post => post.uploadedUID));
      }
    }
  };
    useEffect(() => {
        fetchPosts();
    }, []);
    return (
        <div style={{color:"white"}}>
        dkvdv
        </div>
    )
}
