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
  const [uploaduid,setuploaduid]=useState([]);
  const [tabOpened, setTabOpened] = useState('POSTS');
  const [privateprofile, setPrivateprofile] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const uid = auth.currentUser?.uid;
      const postids=[]
      const uploadUIDS=[];
      const profstatus=[];
      if (uid) {
        const docsnap = doc(db, "Global Post IDs", 'Posts');
        const snapshot = await getDoc(docsnap);
        if (snapshot.exists()) {
          const postIds = snapshot.data()['Post IDs'] || [];
          const images = await Promise.all(postIds.map(async (postId) => {
            const postRef = doc(db, "Global Post", postId);
            const postSnap = await getDoc(postRef);
            postids.push(postSnap.data()['postid'])
            uploadUIDS.push(postSnap.data()['Uploaded UID'])
            return postSnap.data()['Image Link'] ;
          }));
          // console.log(uploadUIDS)
          setPosts(postids);
          setPostImages(images.filter(Boolean));
          for(let i = 0; i <uploadUIDS.length; i++) {
            const postRef = doc(db, "User Details", uploadUIDS[i]);
            const postSnap = await getDoc(postRef);
            profstatus.push(postSnap.data()['Private Account']||false)
          }
          setPrivateprofile(profstatus)
          // console.log(profstatus)
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
        <Link key={index} to={`/post/${posts[index]}`}>
          <div style={{ margin: '5px' }}>
            {
              privateprofile[index]?<></>:<img src={image} alt="" height={"308px"} width={"308px"} style={{ borderRadius: '10px',marginRight:"10px" }} />
            }
          </div>
        </Link>
      ))}
    </div>
  )
}
