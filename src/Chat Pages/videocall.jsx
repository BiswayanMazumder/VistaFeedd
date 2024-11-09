import React, { useEffect, useRef, useState } from 'react';
import { getFirestore, collection, doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
const firebaseConfig = {
    apiKey: "AIzaSyA5h_ElqdgLrs6lXLgwHOfH9Il5W7ARGiI",
    authDomain: "vistafeedd.firebaseapp.com",
    projectId: "vistafeedd",
    storageBucket: "vistafeedd.appspot.com",
    messagingSenderId: "1025680611513",
    appId: "1:1025680611513:web:40aeb5d0434d67ca1ea368",
    measurementId: "G-9V0M9VQDGM"
};
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

function VideoCallPage({ ChatID }) {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const initCall = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('localVideo').srcObject = localStream.current;
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };
    initCall();
  }, []);

  const startCall = async () => {
    try {
      setIsCallStarted(true);
      peerConnection.current = new RTCPeerConnection();

      // Add tracks to the peer connection
      localStream.current.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream.current));

      // Handle receiving tracks
      peerConnection.current.ontrack = event => {
        const [stream] = event.streams;
        document.getElementById('remoteVideo').srcObject = stream;
      };

      peerConnection.current.onicecandidate = async (event) => {
        if (event.candidate) {
          await setDoc(doc(collection(db, 'calls', ChatID, 'offerCandidates')), {
            candidate: event.candidate.toJSON(),
          });
        }
      };

      const offerDescription = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offerDescription);

      await setDoc(doc(db, 'calls', ChatID), { offer: { sdp: offerDescription.sdp, type: offerDescription.type } });

      // Listen for answer in Firestore
      onSnapshot(doc(db, 'calls', ChatID), async (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !isCallAccepted) {
          setIsCallAccepted(true);
          const answerDescription = new RTCSessionDescription(data.answer);
          await peerConnection.current.setRemoteDescription(answerDescription);
        }
      });

      // Listen for ICE candidates from the other user
      onSnapshot(collection(db, 'calls', ChatID, 'answerCandidates'), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if (data?.candidate) {
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
          }
        });
      });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const acceptCall = async () => {
    try {
      const callDoc = doc(db, 'calls', ChatID);
      const offerSnapshot = await callDoc.get();
      const offerData = offerSnapshot.data();

      if (!offerData || !offerData.offer) {
        throw new Error("No call offer found.");
      }

      peerConnection.current = new RTCPeerConnection();
      localStream.current.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream.current));

      peerConnection.current.ontrack = event => {
        const [stream] = event.streams;
        document.getElementById('remoteVideo').srcObject = stream;
      };

      peerConnection.current.onicecandidate = async (event) => {
        if (event.candidate) {
          await setDoc(doc(collection(db, 'calls', ChatID, 'answerCandidates')), {
            candidate: event.candidate.toJSON(),
          });
        }
      };

      const offerDescription = new RTCSessionDescription(offerData.offer);
      await peerConnection.current.setRemoteDescription(offerDescription);

      const answerDescription = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answerDescription);

      await setDoc(callDoc, { answer: { type: answerDescription.type, sdp: answerDescription.sdp } });
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const endCall = async () => {
    try {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      
      localStream.current.getTracks().forEach(track => track.stop());
      await deleteDoc(doc(db, 'calls', ChatID));
      
      setIsCallStarted(false);
      setIsCallAccepted(false);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  return (
    <div>
      <video id="localVideo" autoPlay muted style={{ width: '300px', height: '300px' }}></video>
      <video id="remoteVideo" autoPlay style={{ width: '300px', height: '300px' }}></video>

      {!isCallStarted ? (
        <button onClick={startCall}>Start Call</button>
      ) : !isCallAccepted ? (
        <button onClick={acceptCall}>Accept Call</button>
      ) : null}
      
      {isCallStarted && <button onClick={endCall}>End Call</button>}
    </div>
  );
}

export default VideoCallPage;
