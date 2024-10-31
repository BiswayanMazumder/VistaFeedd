import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from '@firebase/firestore';

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
const db = getFirestore(app);

export default function Postviewing_laptop() {
    const { PostID } = useParams();
    const [uploaduid, setuploaduid] = useState('');
    const [name, setname] = useState('');
    const [pfp, setpfp] = useState('');
    const [image, setimage] = useState('');
    const [uploaddate, setuploaddate] = useState('');
    const [caption, setcaption] = useState('');

    const fetchpostdetails = async () => {
        try {
            const docRef = doc(db, "Global Post", PostID);
            const docsnap = await getDoc(docRef);
            if (docsnap.exists()) {
                const data = docsnap.data();
                setuploaduid(data['Uploaded UID']);
                setimage(data['Image Link']);
                setuploaddate(data['Upload Date']);
                setcaption(data.Caption);
                
                const nameref = doc(db, "User Details", data['Uploaded UID']);
                const nameSnap = await getDoc(nameref);
                if (nameSnap.exists()) {
                    const userData = nameSnap.data();
                    setname(userData['Name']);
                    setpfp(userData['Profile Pic']);
                } else {
                    console.error("User document not found");
                }
            } else {
                console.error("Post document not found");
            }
        } catch (error) {
            console.error("Error fetching post details:", error);
        }
    };
    
    useEffect(() => {
        fetchpostdetails();
    }, []);
    function formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const seconds = Math.floor((now - date) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + " y" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " M" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " d" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " h" + (interval > 1 ? "s" : "");
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " m" + (interval > 1 ? "s" : "");
        return seconds + " second" + (seconds > 1 ? "s" : "") + " ago";
    }
    return (
        <div className="kefkek" style={{
            height: "100vh",
            width: "100%",
            backgroundColor: "black",
            overflowY: 'auto',
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            color: "white"
        }}>
            <div className="rnvnfv" style={{ marginTop: "50px", display: 'flex', alignItems: 'center',marginLeft: "50px"}}>
                <img src={pfp} alt="" style={{ borderRadius: '50%' }} height={40} width={40} />
                <div style={{ marginLeft: "10px", color: "white", fontSize: "15px" ,display:"flex",flexDirection:"row",gap:"10px"}}>
                    <Link to={`/others/${uploaduid}`} style={{textDecoration:"none",color:"white"}}>
                    {name}
                    </Link>
                    <div style={{ color: 'grey' }}>•</div>
                                    <div style={{ color: 'grey', fontWeight: '300' }}>{formatTimeAgo(uploaddate)}</div>
                </div>
            </div>
            <div className="jrnvjf" style={{ marginTop: "30px", display: "flex", justifyContent: "start",marginLeft: "50px" }}>
                <img src={image} alt="" style={{ height: '80vh', objectFit: 'contain', borderRadius: '10px' }} />
            </div>
            <div className="jrnvjf" style={{ marginTop: "30px", display: "flex", justifyContent: "start",marginLeft: "50px",flexDirection:'row',gap:'10px' }}>
            <div style={{fontWeight:'600'}}>
            {name}
            </div>
                {caption}
            </div>
            <div className="jrnvjf" style={{ marginTop: "30px", display: "flex", justifyContent: "start",marginLeft: "50px" }}>
                {/* <img src={image} alt="" style={{ height: '80vh', objectFit: 'contain', borderRadius: '10px' }} /> */}
            </div>
        </div>
    );
}
