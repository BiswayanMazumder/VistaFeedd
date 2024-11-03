import React, { useEffect, useRef, useState } from 'react';
import { getAuth } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

export default function ReelPage_Mobile() {
  const videoRef = useRef(null);
  const [postImages, setPostImages] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const docsnap = doc(db, "Reels ID", 'RID');
      const snapshot = await getDoc(docsnap);
      if (snapshot.exists()) {
        const postIds = snapshot.data()['IDs'] || [];
        const postsData = await Promise.all(postIds.map(async (postId) => {
          const postRef = doc(db, "Global Reels", postId);
          const postSnap = await getDoc(postRef);
          return postSnap.data()?.['Video ID'] || null;
        }));
        setPostImages(postsData.filter(Boolean));
      }
    };

    fetchPosts();
  }, []);

  const handleScroll = (event) => {
    const delta = Math.sign(event.deltaY);
    if (delta > 0 && currentReelIndex < postImages.length - 1) {
      setCurrentReelIndex(prevIndex => prevIndex + 1);
    } else if (delta < 0 && currentReelIndex > 0) {
      setCurrentReelIndex(prevIndex => prevIndex - 1);
    }
  };

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault(); // Prevent default scrolling
      handleScroll(event);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentReelIndex, postImages]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPaused(false);
    }
  };
  return (
    <div className='rjghfg'>
      {postImages.length > 0 && (
        <video
          ref={videoRef}
          src={postImages[currentReelIndex]}
          height={'100%'}
          width={'80%'}
          style={{ borderRadius: '10px' }}
          autoPlay
          muted={muted}
          loop
          onClick={togglePlayPause}
        />
      )}
      {isPaused && (
        <div
          onClick={handlePlayButtonClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <svg
            aria-label="Play button icon"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"></path>
          </svg>
        </div>
      )}
      <div 
                    className="kefn" 
                    style={{ 
                        position: 'absolute', 
                        top: '120px', 
                        right: '50px', 
                        borderRadius: '50%',
                        color: 'white', 
                        padding: '5px', 
                        cursor: 'pointer'
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from bubbling to the video
                        setMuted(!muted); // Toggle mute state
                    }} 
                >
                    {muted ? (
                        <svg aria-label="Audio is muted" fill="currentColor" height="16" viewBox="0 0 48 48" width="16">
                            <path clipRule="evenodd" d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z" fillRule="evenodd"></path>
                        </svg>
                    ) : (
                        <svg aria-label="Audio is playing" fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                            <path d="M16.636 7.028a1.5 1.5 0 10-2.395 1.807 5.365 5.365 0 011.103 3.17 5.378 5.378 0 01-1.105 3.176 1.5 1.5 0 102.395 1.806 8.396 8.396 0 001.71-4.981 8.39 8.39 0 00-1.708-4.978zm3.73-2.332A1.5 1.5 0 1018.04 6.59 8.823 8.823 0 0120 12.007a8.798 8.798 0 01-1.96 5.415 1.5 1.5 0 002.326 1.894 11.672 11.672 0 002.635-7.31 11.682 11.682 0 00-2.635-7.31zm-8.963-3.613a1.001 1.001 0 00-1.082.187L5.265 6H2a1 1 0 00-1 1v10.003a1 1 0 001 1h3.265l5.01 4.682.02.021a1 1 0 001.704-.814L12.005 2a1 1 0 00-.602-.917z"></path>
                        </svg>
                    )}
                </div>
    </div>
  )
}
