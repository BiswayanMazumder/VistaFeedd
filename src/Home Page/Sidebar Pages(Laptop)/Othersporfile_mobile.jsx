import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { arrayRemove, arrayUnion, doc, getDoc, getFirestore, serverTimestamp, setDoc } from '@firebase/firestore';

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
    const [verified,setverified] = useState(false);
    useEffect(() => {
        const fetchdp = async () => {
            const docRef = doc(db, "User Details", otheruserid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setprofilepicture(docSnap.data()['Profile Pic']);
                setname(docSnap.data()['Name']);
                setverified(docSnap.data()['Verified']||false);
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
            // console.log('Followers', Followers);
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
    const [number, setNumber] = useState(0);
    const generateNumber = () => {
        const randomNumber = Math.floor(Math.random() * 1e17); // Generate a random number with 17 digits
        return randomNumber.toString().padStart(17, '0'); // Ensure it's exactly 17 digits
    };

    const generatechats = async () => {
        try {
            if (typeof auth.currentUser.uid !== 'string' || typeof otheruserid !== 'string') {
                throw new Error('User IDs must be strings');
            }

            // Generate the number synchronously here
            const number = generateNumber(); // Get the random number directly

            const docref = doc(db, 'Chat UIDs', auth.currentUser.uid);
            const datatoupdate = {
                'UIDs': arrayUnion(otheruserid),
                'IDs': arrayUnion(number)
            };
            await setDoc(docref, datatoupdate, { merge: true });

            const docrefs = doc(db, 'Chat UIDs', otheruserid);
            const datatoupdates = {
                'UIDs': arrayUnion(auth.currentUser.uid),
                'IDs': arrayUnion(number)
            };
            await setDoc(docrefs, datatoupdates, { merge: true });

            const chatdet = doc(db, 'Chat Details', number);
            const chatdetdata = {
                'Chat ID': number,
                'User 1': auth.currentUser.uid,
                'User 2': otheruserid,
                'Chat Initialized Date': serverTimestamp()
            };
            await setDoc(chatdet, chatdetdata);
            setchatted(true);
        } catch (error) {
            console.error("Error generating chats:", error);
        }
    };

    const [chatted, setchatted] = useState(false);
    const checkchats = async () => {
        try {
            const docref = doc(db, 'Chat UIDs', auth.currentUser.uid);
            const docSnap = await getDoc(docref);
            if (docSnap.exists()) {
                const Chatted = docSnap.data()['UIDs'].includes((otheruserid));
                setchatted(docSnap.data()['UIDs'].includes(otheruserid));
                // console.log('Chatted:', Chatted);
            }
        } catch (error) {
            console.error("Error checking chats:", error);
        }
    };
    const [chatID,setChatID]=useState('');
    const fetchchatid = async () => {
        await checkchats();
    
        const chattedUID = [];
        const chatID = [];
        try {
            const docref = doc(db, 'Chat UIDs', auth.currentUser.uid);
            const docSnap = await getDoc(docref);
    
            if (docSnap.exists()) {
                const data = docSnap.data();  // Extract the document data
                chattedUID.push(...data['UIDs']);
                chatID.push(...data['IDs']);
                // console.log('chattedUID:', chattedUID);
                // console.log('chatID:', chatID);
                // Ensure that 'UIDs' is an array before calling findIndex
                const indexchat = data['UIDs'].findIndex(uid => uid === otheruserid);
    
                if (indexchat !== -1) {
                    setChatID(chatID[indexchat]);
                    const Chatted = chatID[indexchat];
                    // console.log('Chatted:', Chatted);
                } else {
                    console.log('User not found in the UIDs array');
                }
            }
        } catch (error) {
            console.error("Error fetching chat ID:", error);
        }
    };
    return (
        <div className="profile-container" style={{ color: "white", overflow: "hidden", padding: "20px" }}>
            <div className="profile-header" style={{ display: "flex", flexDirection: "row", gap: "20px", marginTop: "20px", alignItems: "center" }}>
                <div className="profile-picture" style={{ height: "70px", width: "70px", borderRadius: "50%", overflow: "hidden" }}>
                    <img src={profilepicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                </div>
                <div className="profile-info" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{display:"flex",gap:"10px",flexDirection:"row"}}>{name}
                    {
                            verified?<svg aria-label="Verified" class="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fill-rule="evenodd"></path></svg>:<></>
                        }
                    </div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                        {auth.currentUser?<Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="button" style={{ backgroundColor:auth.currentUser.uid===otheruserid?"gray":followed?"gray":"#0095F6", borderRadius: "5px", padding: "5px 10px", textAlign: "center", fontSize: "12px" }} onClick={async()=>{
                               if(auth.currentUser.uid!=otheruserid){
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
                               }
                            }}>
                             {auth.currentUser.uid===otheruserid?"Edit Profile":followed?'Following':'Follow'}
                            </div>
                        </Link>:<Link style={{ textDecoration: 'none', color: "white" }} to={'/'}>
                        <div className="button" style={{ backgroundColor:followed?"gray" :"#0095F6", borderRadius: "5px", padding: "5px 10px", textAlign: "center", fontSize: "12px" }}>
                            Login
                            </div>
                        </Link>}
                        <Link style={{ textDecoration: 'none', color: "white" }}>
                            <div className="button" style={{ backgroundColor: "grey", borderRadius: "5px", padding: "5px 10px", textAlign: "center", fontSize: "12px" }} onClick={async () => {
                                if (auth.currentUser) {
                                    if (!chatted) {
                                        await generatechats();
                                    }
                                }
                            }}>
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
