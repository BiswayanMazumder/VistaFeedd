import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from '@firebase/firestore';

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

const OthersProfile_Laptop = () => {
    const { otheruserid } = useParams();
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
                fetchUserData(otheruserid);
                fetchPosts(otheruserid);
                fetchFollowers(otheruserid);
                fetchFollowing(otheruserid);
                fetchuserfollowers(auth.currentUser.uid);
                fetchchatid();
                checkchats();
            } else {
                // Handle user not logged in
                console.log("User not logged in");
                fetchUserData(otheruserid);
                fetchPosts(otheruserid);
                fetchFollowers(otheruserid);
                fetchFollowing(otheruserid);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);
    const [verified, setverified] = useState(false);
    const fetchUserData = async (uid) => {
        const docRef = doc(db, "User Details", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setProfilePicture(data['Profile Pic']);
            setName(data['Name']);
            setverified(data['Verified'] || false);
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
    const [followed, setfollwed] = useState(false);
    const fetchuserfollowers = async (uid) => {
        console.log("Fetching userfollowers");
        const Followers = [];
        const docSnap = await getDoc(doc(db, 'Followers', otheruserid));
        if (docSnap.exists()) {
            Followers.push(...docSnap.data()['Followers ID'] || []);
            // console.log('Followers', Followers);
            // setFollowing(docSnap.data()['Following ID'] || []);
            setfollwed(Followers.includes(auth.currentUser.uid));
        }
    }
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
    const [number, setNumber] = useState(0);
    const generateNumber = () => {
        const randomNumber = Math.floor(Math.random() * 1e17); // Generate a random number with 17 digits
        return randomNumber.toString().padStart(17, '0'); // Ensure it's exactly 17 digits
    };
    const generatefollownotification = async () => {
        const Number = generateNumber();
        console.log('Notification generated', Number);
    
        // Check if a notification already exists for the same Follower ID and Follow ID
        const notifQuery = query(
            collection(db, 'Notifications Details'),
            where('To Followed', '==', otheruserid),
            where('Who Followed', '==', auth.currentUser.uid)
        );
    
        const querySnapshot = await getDocs(notifQuery);
    
        if (!querySnapshot.empty) {
            console.log('Notification already exists for this follow action.');
            return;  // Exit the function if the notification already exists
        }
    
        // If no existing notification, proceed to create a new one
        const docref = doc(db, 'Notifications IDs', otheruserid);
        const datatoupdate = {
            'Follow IDs': arrayUnion(Number)
        };
        await setDoc(docref, datatoupdate, { merge: true });
    
        const notifrefs = doc(db, 'Notifications Details', Number);
        const notifdata = {
            'Notification ID': Number,
            'To Followed': otheruserid,
            'Who Followed': auth.currentUser.uid,
            'Notification Type': 'Follow',
            'Notification Date': serverTimestamp()
        };
    
        await setDoc(notifrefs, notifdata);
        console.log('New follow notification added successfully.');
    }
    
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
            window.location.href=`/direct/t/${number}`;
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
        <div className="jdnvnmvnd" style={{ color: "white", overflow: "hidden" }}>
            <div className="krkmfkfvm">
                <div className="ehfjdv">
                    <div className="nkvmvdl" style={{ height: '100px', width: "100px", borderRadius: "50%", backgroundColor: "white" }}>
                        <img src={profilePicture} alt="" height={"100px"} width={"100px"} style={{ borderRadius: "50%" }} />
                    </div>
                </div>
                <div className="krmfvm">
                    <div className="mdnvmn" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                        <div className="ddvbnd">{name}</div>
                        {
                            verified ? <svg aria-label="Verified" class="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fill-rule="evenodd"></path></svg> : <></>
                        }
                        {
                            auth.currentUser ? <Link style={{ textDecoration: 'none', color: "white" }} to={auth.currentUser.uid === otheruserid ? '/account/edit' : null}>
                                <div className="ddvbnd" style={{ height: "25px", width: "85px", borderRadius: "5px", backgroundColor: auth.currentUser.uid === otheruserid ? "gray" : followed ? "gray" : "#0095F6", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "12px" }} onClick={async () => {
                                    // generatenotification();
                                    if (auth.currentUser.uid != otheruserid) {
                                        if (!followed) {
                                            const docref = doc(db, 'Following', auth.currentUser.uid);
                                            const datatoupdate = {
                                                'Following ID': arrayUnion(otheruserid)
                                            }
                                            await setDoc(docref, datatoupdate, { merge: true });
                                            const docrefs = doc(db, 'Followers', otheruserid);
                                            const datatoupdates = {
                                                'Followers ID': arrayUnion(auth.currentUser.uid)
                                            }
                                            await setDoc(docrefs, datatoupdates, { merge: true });
                                            setfollwed(true);
                                            followers.length += 1;
                                            generatefollownotification();
                                        } else {
                                            const docref = doc(db, 'Following', auth.currentUser.uid);
                                            const datatoupdate = {
                                                'Following ID': arrayRemove(otheruserid)
                                            }
                                            await setDoc(docref, datatoupdate, { merge: true });
                                            const docrefs = doc(db, 'Followers', otheruserid);
                                            const datatoupdates = {
                                                'Followers ID': arrayRemove(auth.currentUser.uid)
                                            }
                                            await setDoc(docrefs, datatoupdates, { merge: true });
                                            setfollwed(false);
                                            followers.length -= 1;
                                        }
                                    }
                                }}>
                                    {auth.currentUser.uid === otheruserid ? "Edit Profile" : followed ? 'Following' : 'Follow'}
                                </div>
                            </Link> : <Link style={{ textDecoration: 'none', color: "white" }} to={'/'}>
                                <div className="ddvbnd" style={{ height: "25px", width: "85px", borderRadius: "5px", backgroundColor: "#0095F6", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "12px" }}>
                                    Login
                                </div>
                            </Link>
                        }
                        <Link style={{ textDecoration: 'none', color: "white" }} to={chatted?`/direct/t/${chatID}`:null}>
                            <div className="ddvbnd" style={{ height: "25px", width: "85px", borderRadius: "5px", backgroundColor: "grey", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "12px" }} onClick={async () => {
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
                    <div className="jkdnfkd">
                        <div className="kvmf">{postImages.length} {postImages.length === 1 || postImages.length === 0 ? 'Post' : 'Posts'}</div>
                        <div className="kvmf">{followers.length} {followers.length === 1 || followers.length === 0 ? 'Follower' : 'Followers'}</div>
                        <div className="kvmf">{following.length} {following.length === 1 ? 'Following' : 'Following'}</div>
                    </div>
                    <div className="jkdnfkd">
                        <div className="kvmf" style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", textAlign: "start" }}>
                            {bio}
                        </div>
                    </div>
                </div>
            </div>
            <div className="jrnknrv">
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} onClick={() => setTabOpened('POSTS')}>
                        <svg aria-label="" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
                            <title></title>
                            <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                        </svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabOpened === 'POSTS' ? "bold" : "400" }}>
                            POSTS
                        </div>
                    </div>
                </Link>
                {/* <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} onClick={() => setTabOpened('SAVED')}>
                        <svg aria-label="" className="x1lliihq x1n2onr6 x1roi4f4" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
                            <title></title>
                            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabOpened === 'SAVED' ? "bold" : "400" }}>
                            SAVED
                        </div>
                    </div>
                </Link> */}
                <Link style={{ textDecoration: 'none', color: "white" }}>
                    <div className="hvbvfvbmfnb" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} onClick={() => setTabOpened('TAGGED')}>
                        <svg aria-label="" className="x1lliihq x1n2onr6 x1roi4f4" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
                            <title></title>
                            <path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            <path d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            <circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                        </svg>
                        <div style={{ color: "white", fontSize: "12px", marginTop: "3px", fontWeight: tabOpened === 'TAGGED' ? "bold" : "400" }}>
                            TAGGED
                        </div>
                    </div>
                </Link>
            </div>
            {tabOpened === 'POSTS' && (
                <div className="dmdnvfnvk">
                    {postImages.length === 0 ? (
                        <div className="nnjfnvj">
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
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "start", flexDirection: "row", marginLeft: "50px", alignContent: "start", width: "80%", marginTop: "-10px" }}>
                            {postImages.map((image, index) => (
                                <Link key={index} to={`/post/${posts[index]}`}>
                                    <div style={{ margin: '5px' }} onClick={() => setModalOpen(true)}>
                                        <img src={image} alt="" height={"308px"} width={"308px"} style={{ borderRadius: '10px' }} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OthersProfile_Laptop;
