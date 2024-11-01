import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export default function OtherProfile_Mobile() {
    const { otheruserid } = useParams();
    const [profilepicture, setprofilepicture] = useState('');
    const [name, setname] = useState('');
    const [bio, setbio] = useState('');

    useEffect(() => {
        const fetchdp = async () => {
            const docRef = doc(db, "User Details", otheruserid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setprofilepicture(docSnap.data()['Profile Pic']);
                setname(docSnap.data()['Name']);
                setbio(docSnap.data()['Bio'] || 'No bio set');
            }
        };
        fetchdp();
    }, [otheruserid]);

    const [posts, setposts] = useState([]);
    const [postimages, setpostimages] = useState([]);
    const [followers, setfollowers] = useState([]);
    const [following, setfollowing] = useState([]);
    const [tabopened, settabopened] = useState('POSTS');

    const [Posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            const postuids=[];
            const user = auth.currentUser;
            if (user) {
                const Uid = user.uid;
                const docsnap = doc(db, "Global Post IDs", 'Posts');
                const snapshot = await getDoc(docsnap);
                if (snapshot.exists()) {
                    const postids = snapshot.data()['Post IDs'] || [];
                    setposts(postids);
                    const images = [];
                    
                    for (const postId of postids) {
                        const postref = doc(db, "Global Post", postId);
                        const docSnap = await getDoc(postref);
                        if (docSnap.exists()) {
                            if (docSnap.data()['Uploaded UID'] === otheruserid) {
                                postuids.push(docSnap.data()['postid'])
                                // setPosts(docsnap.data().postid)
                                const imageLink = docSnap.data()['Image Link'];
                                if (typeof imageLink === 'string') {
                                    images.push(imageLink);
                                }
                            }
                        }
                    }
                    setPosts(postuids);
                    setpostimages(images);
                }
            }
        };
        fetchPosts();
    }, [otheruserid]);

    useEffect(() => {
        const fetchfollowers = async () => {
            const docsnap = doc(db, 'Followers', otheruserid);
            const snapshot = await getDoc(docsnap);
            if (snapshot.exists()) {
                setfollowers(snapshot.data()['Followers ID'] || []);
            }
        };
        fetchfollowers();
    }, [otheruserid]);

    useEffect(() => {
        const fetchfollowing = async () => {
            const docsnap = doc(db, 'Following', otheruserid);
            const snapshot = await getDoc(docsnap);
            if (snapshot.exists()) {
                setfollowing(snapshot.data()['Following ID'] || []);
            }
        };
        fetchfollowing();
    }, [otheruserid]);
    const [followed,setfollwed]=useState(false);
    const fetchuserfollowers=async(uid)=>{
        const Followers=[];
        const docSnap = await getDoc(doc(db, 'Followers', otheruserid));
        if (docSnap.exists()) {
            Followers.push(...docSnap.data()['Followers ID'] || []);
            console.log('Followers', Followers);
            // setFollowing(docSnap.data()['Following ID'] || []);
            setfollwed(Followers.includes(auth.currentUser.uid));
        }
    }
    useEffect(() => {
        const loggedin=auth.currentUser;
        if(loggedin){
            fetchuserfollowers(auth.currentUser.uid);
        }
    }, [otheruserid]);
    return (
        <div className="profile-container" style={{ color: "white", overflow: "hidden", padding: "20px" }}>
            <div className="profile-header" style={{ display: "flex", flexDirection: "row", gap: "20px", marginTop: "20px", alignItems: "center" }}>
                <div className="profile-picture" style={{ height: "70px", width: "70px", borderRadius: "50%", overflow: "hidden" }}>
                    <img src={profilepicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                </div>
                <div className="profile-info" style={{ display: "flex", flexDirection: "column" }}>
                    <div>{name}</div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="button" style={{ backgroundColor:followed?"gray" :"#0095F6", borderRadius: "5px", padding: "5px 10px", textAlign: "center", fontSize: "12px" }} onClick={async()=>{
                                if(!followed){
                                    const docref=doc(db,'Following',auth.currentUser.uid);
                                const datatoupdate={
                                    'Following ID':arrayUnion(otheruserid)
                                }
                                await setDoc(docref,datatoupdate,{merge:true});
                                const docrefs=doc(db,'Followers',otheruserid);
                                const datatoupdates={
                                    'Followers ID':arrayUnion(auth.currentUser.uid)
                                }
                                await setDoc(docrefs,datatoupdates,{merge:true});
                                setfollwed(true);
                                followers.length+=1;
                                }else{
                                    const docref=doc(db,'Following',auth.currentUser.uid);
                                const datatoupdate={
                                    'Following ID':arrayRemove(otheruserid)
                                }
                                await setDoc(docref,datatoupdate,{merge:true});
                                const docrefs=doc(db,'Followers',otheruserid);
                                const datatoupdates={
                                    'Followers ID':arrayRemove(auth.currentUser.uid)
                                }
                                await setDoc(docrefs,datatoupdates,{merge:true});
                                setfollwed(false);
                                followers.length-=1;
                                }
                            }}>
                            {followed?'Following':'Follow'}
                            </div>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="button" style={{ backgroundColor: "grey", borderRadius: "5px", padding: "5px 10px", textAlign: "center", fontSize: "12px" }}>
                                Message
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="profile-bio" style={{ marginTop: "20px" }}>
                {bio}
            </div>
            <div className="profile-stats" style={{ display: "flex", gap: "20px", marginTop: "20px", width: "85vw", justifyContent: "space-evenly" }}>
                <div>{postimages.length} {postimages.length === 1 || postimages.length === 0 ? 'Post' : 'Posts'}</div>
                <div>{followers.length} {followers.length === 1 || followers.length === 0 ? 'Follower' : 'Followers'}</div>
                <div>{following.length} Following</div>
            </div>
            <div className="tab-navigation" style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
                <div onClick={() => settabopened('POSTS')} style={{ cursor: "pointer", color: tabopened === 'POSTS' ? "blue" : "white" }}>
                    {/* SVG for Posts */}
                </div>
                <div onClick={() => settabopened('TAGGED')} style={{ cursor: "pointer", color: tabopened === 'TAGGED' ? "blue" : "white" }}>
                    {/* SVG for Tagged */}
                </div>
            </div>
            <div className="posts-container" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {
                    tabopened === 'POSTS' ? (
                        postimages.length === 0 ? (
                            <div className="nnjfnvj" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: "100%" }}>
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
                            postimages.map((image, index) => (
                                <Link key={index} style={{ margin: '5px' }} to={`/post/${Posts[index]}`}>
                                    <img src={image} alt="" style={{ width: "139px", height: "139px", borderRadius: '10px' }} />
                                </Link>
                            ))
                        )
                    ) : null
                }
            </div>
        </div>
    );
}
