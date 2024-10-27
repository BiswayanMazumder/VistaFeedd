import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, serverTimestamp, setDoc, arrayUnion } from "firebase/firestore";

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
export default function Landing_laptop() {
  const videolinks = [
    'https://static.snapchat.com/videos/snapchat-dot-com/lens.mp4',
    'https://static.snapchat.com/videos/snapchat-dot-com/find-your-friends.mp4',
    'https://static.snapchat.com/videos/snapchat-dot-com/spotlight.mp4',
    'https://static.snapchat.com/videos/snapchat-dot-com/map.mp4',
    'https://videos.ctfassets.net/inb32lme5009/2Xi6NUEtv8wTyfVbYZFV8b/c0ba37fc46e3aa87182231b9fe43c816/Section_2TalkSpace.mp4',
    'https://videos.ctfassets.net/inb32lme5009/34ca6VPJhXCkcpJfPYyQL/29709124985abb089d1042d51157edc5/Section_3YoungLA.mp4',
    'https://videos.ctfassets.net/inb32lme5009/3blBBSbEfm9vVY4EvqWrcV/611d691c67340e76cb471491c792a988/Section_2JavyCoffee.mp4'

  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videolinks.length);
  };
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [username, setusername] = useState('');
  const [issignup, setsignup] = useState(false);
  const [error, seterror] = useState('');
  useEffect(() => {
    const checkloggedin = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          window.location.replace('/home');
          const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
    }
    checkloggedin();
  })
  const loginuser = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Welcome', user.email); // Log the user's email or any other property
        window.location.replace('/home');
    } catch (error) {
        // console.error('Login error:', error.code, error.message);
        seterror('Please enter correct email or password');
    }
};
  const signupuser = async () => {
    try {
      // Check if the username already exists
      const usernameDoc = await getDoc(doc(db, 'User Names', 'usernames'));
      const existingUsernames = usernameDoc.exists() ? usernameDoc.data().usernames : [];

      if (existingUsernames.includes(username)) {
        console.error('Username already exists. Please choose a different username.');
        seterror('Username already exists. Please choose a different username.');
        // Handle the error (e.g., show a message to the user)
        return;
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);

      // Prepare data to update
      const docRef = doc(db, 'User Details', user.uid);
      const dataToUpdate = {
        Name: username,
        UserId: user.uid,
        Password: password, // Consider storing hashed passwords instead of plain text
        Email: email,
        DoJ: serverTimestamp(),
        'Profile Pic': 'https://archive.org/download/instagram-plain-round/instagram%20dip%20in%20hair.jpg',
      };

      // Set document in Firestore
      await setDoc(docRef, dataToUpdate);

      const usernameAddDoc = doc(db, 'User Names', 'usernames');
      const usernameUpdates = {
        usernames: arrayUnion(username)
      };
      await setDoc(usernameAddDoc, usernameUpdates, { merge: true });

      setsignup(false);
      // Additional success handling can go here
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error during signup:', errorCode, errorMessage);
      seterror('Email address already exists. Please choose a different email address.');
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <div className='webbody' style={{ overflow: 'hidden' }}>
      <div className="kefkdmvdm">
        <Link>
          <div className="logo">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 38 38" data-testid="GhostIconFilled"><path d="M35.8336 26.7701C35.6786 26.2535 34.9294 25.8918 34.9294 25.8918C34.8623 25.8505 34.7951 25.8195 34.7434 25.7936C33.4983 25.1943 32.3978 24.471 31.473 23.6495C30.7291 22.9882 30.0884 22.2649 29.5769 21.49C28.9518 20.5497 28.6573 19.7592 28.5333 19.3355C28.461 19.0565 28.4765 18.948 28.5333 18.8034C28.585 18.6846 28.7245 18.5657 28.7968 18.5141C29.2153 18.2196 29.8921 17.7804 30.3054 17.5118C30.6619 17.2793 30.9719 17.0778 31.1527 16.9538C31.7365 16.5456 32.1344 16.1323 32.372 15.6828C32.6768 15.1042 32.713 14.4635 32.4753 13.8384C32.155 12.9911 31.3645 12.4848 30.3622 12.4848C30.1401 12.4848 29.9076 12.5106 29.6803 12.5571C29.1068 12.6811 28.5591 12.8878 28.1045 13.0634C28.0735 13.0789 28.0373 13.0531 28.0373 13.0169C28.0838 11.8855 28.1407 10.3665 28.0167 8.9199C27.903 7.61278 27.6343 6.51232 27.1952 5.55135C26.7509 4.58522 26.1826 3.87225 25.7279 3.36076C25.2991 2.86995 24.55 2.14664 23.4133 1.49566C21.8169 0.581195 19.9983 0.116211 18.0092 0.116211C16.0253 0.116211 14.2118 0.581195 12.6102 1.4905C11.4116 2.17764 10.6418 2.95261 10.2905 3.3556C9.84097 3.87225 9.26749 4.58522 8.82317 5.54619C8.38402 6.50715 8.11536 7.60761 8.0017 8.91473C7.8777 10.3614 7.92937 11.7615 7.98103 13.0118C7.98103 13.0479 7.94487 13.0738 7.91387 13.0583C7.45922 12.8826 6.91157 12.6759 6.33809 12.5519C6.11076 12.5003 5.88344 12.4796 5.65611 12.4796C4.65382 12.4796 3.86334 12.9859 3.54302 13.8332C3.30536 14.4635 3.34153 15.099 3.64635 15.6777C3.88401 16.1271 4.28183 16.5405 4.86564 16.9486C5.04647 17.0726 5.35646 17.2741 5.71295 17.5066C6.1211 17.7701 6.77724 18.1937 7.19573 18.4934C7.24739 18.5296 7.42305 18.6639 7.47988 18.8034C7.54188 18.9532 7.55221 19.0617 7.47472 19.3562C7.34555 19.785 7.05107 20.5652 6.43625 21.49C5.92477 22.2649 5.28413 22.9882 4.54015 23.6495C3.61019 24.471 2.50972 25.1943 1.26977 25.7936C1.21294 25.8195 1.14061 25.8556 1.06311 25.9021C0.985611 25.9486 0.319134 26.2793 0.179639 26.7701C-0.0270202 27.4934 0.520627 28.1702 1.08894 28.537C2.00858 29.1312 3.1297 29.4515 3.78068 29.622C3.96151 29.6685 4.12683 29.715 4.27666 29.7615C4.36966 29.7925 4.60215 29.8803 4.70548 30.0095C4.82948 30.1697 4.84498 30.3711 4.89147 30.5985C4.96381 30.9808 5.12397 31.4509 5.59412 31.7764C6.11076 32.1329 6.77208 32.1588 7.60388 32.1898C8.47702 32.2208 9.56198 32.2673 10.8019 32.6754C11.3754 32.8666 11.8972 33.1869 12.5017 33.5589C13.7623 34.3338 15.3329 35.3 18.0143 35.3C20.6958 35.3 22.2767 34.3287 23.5477 33.5537C24.147 33.1869 24.6636 32.8666 25.2268 32.6806C26.4667 32.2724 27.5517 32.2311 28.4248 32.1949C29.2566 32.1639 29.9179 32.1381 30.4346 31.7816C30.9409 31.4354 31.0856 30.9136 31.1527 30.521C31.1889 30.3298 31.2147 30.1542 31.3232 30.0095C31.4162 29.8855 31.6332 29.8028 31.7365 29.7667C31.8915 29.7202 32.0569 29.6737 32.248 29.622C32.899 29.4463 33.7101 29.2449 34.7021 28.6817C35.8749 28.0101 35.9576 27.1783 35.8336 26.7701Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M36.5235 25.9461C37.097 26.2664 37.5982 26.6487 37.8617 27.3669C38.1613 28.1677 37.9805 29.0821 37.2572 29.8571L37.2468 29.8675C36.9885 30.1619 36.6527 30.4203 36.2291 30.6528C35.2681 31.1849 34.4569 31.4381 33.8215 31.6137C33.7026 31.6499 33.4753 31.7326 33.372 31.8204C33.2274 31.9443 33.1671 32.1036 33.0919 32.3021C33.0354 32.4512 32.9706 32.6225 32.8553 32.8175C32.6073 33.2412 32.3025 33.5202 32.0545 33.6907C31.2737 34.23 30.401 34.2638 29.4719 34.2997L29.4558 34.3003C28.6085 34.3313 27.6527 34.3675 26.5626 34.7291C26.1428 34.8674 25.6994 35.1379 25.1872 35.4503C25.1636 35.4647 25.1399 35.4792 25.1159 35.4938C23.8037 36.2997 22.0006 37.4054 19.004 37.4054C16.0116 37.4054 14.2248 36.3079 12.913 35.5023L12.9075 35.4989C12.3651 35.1631 11.8949 34.8738 11.4403 34.724C10.345 34.3623 9.38916 34.3261 8.54703 34.2951L8.53096 34.2945C7.60183 34.2586 6.72909 34.2249 5.94829 33.6855C5.73129 33.5408 5.47297 33.3083 5.24564 32.9725C5.06076 32.7066 4.97644 32.4816 4.90565 32.2928C4.83204 32.0964 4.77306 31.939 4.63083 31.8152C4.51717 31.7171 4.25885 31.6344 4.15035 31.6034C3.52004 31.4277 2.71407 31.1746 1.77377 30.6528C1.37595 30.4306 1.05563 30.1929 0.802467 29.9191C0.0326611 29.1286 -0.168832 28.1935 0.135991 27.3669C0.479982 26.4363 1.22301 26.0629 2.00197 25.6715C2.13556 25.6044 2.27021 25.5367 2.40408 25.4656C4.12968 24.5305 5.4833 23.3577 6.42877 21.9731C6.74392 21.5081 6.97125 21.0844 7.12624 20.7383C7.21407 20.4851 7.21407 20.3508 7.15208 20.2216C7.10041 20.1131 6.94025 19.9943 6.89375 19.9633C6.65756 19.8058 6.41473 19.6484 6.22122 19.5229C6.17346 19.4919 6.12869 19.4629 6.08778 19.4363C5.70546 19.1883 5.40581 18.992 5.20948 18.8577C4.47584 18.3462 3.96436 17.8037 3.64403 17.1941C3.19455 16.3364 3.13772 15.3548 3.48387 14.4352C3.96952 13.159 5.17848 12.3634 6.64059 12.3634C6.94542 12.3634 7.25541 12.3944 7.56023 12.4616C7.59898 12.4719 7.63902 12.4809 7.67906 12.49C7.7191 12.499 7.75914 12.5081 7.79789 12.5184C7.78239 11.6504 7.80305 10.7256 7.88055 9.81632C8.15438 6.6286 9.27034 4.95466 10.438 3.62171C10.9236 3.06889 11.7657 2.25259 13.0419 1.52411C14.814 0.511482 16.8134 0 18.9937 0C21.1791 0 23.1837 0.511482 24.9506 1.52411C26.2164 2.25259 27.0637 3.06373 27.5494 3.62171C28.717 4.95466 29.8329 6.62343 30.1068 9.81632C30.1843 10.7205 30.2049 11.6504 30.1894 12.5184L30.1894 12.5184C30.2669 12.4977 30.3444 12.4771 30.4271 12.4616C30.7371 12.3996 31.0419 12.3634 31.3467 12.3634C32.814 12.3634 34.0178 13.159 34.5034 14.4352C34.8496 15.36 34.7928 16.3364 34.3433 17.1941C34.023 17.8037 33.5115 18.3462 32.7778 18.8577C32.6075 18.9773 32.347 19.1462 32.0219 19.357C31.9821 19.3828 31.9413 19.4093 31.8995 19.4363C31.8112 19.4945 31.7039 19.5644 31.5868 19.6407C31.4232 19.7473 31.2402 19.8665 31.0626 19.984C31.0006 20.0305 30.8817 20.1286 30.8352 20.2216C30.7784 20.3405 30.7732 20.4748 30.8559 20.7124C31.0161 21.0638 31.2434 21.4977 31.5689 21.9731C32.535 23.3887 33.9248 24.5821 35.7124 25.5276C35.8881 25.6154 36.0637 25.7033 36.2342 25.7911C36.3169 25.8324 36.415 25.8841 36.5235 25.9461ZM32.9783 29.6387C33.5905 29.4749 34.3148 29.2811 35.201 28.7929C36.2343 28.2194 35.6505 27.868 35.294 27.7027C29.4145 24.856 28.4742 20.4593 28.4329 20.1287C28.4311 20.1134 28.4293 20.0983 28.4275 20.0833C28.3827 19.7118 28.3464 19.4104 28.7636 19.023C29.046 18.7615 29.9877 18.1515 30.7288 17.6714C31.0856 17.4403 31.3959 17.2393 31.5638 17.1218C32.4214 16.5276 32.7986 15.9283 32.5196 15.1947C32.3284 14.6883 31.8531 14.4972 31.352 14.4972C31.197 14.4972 31.042 14.5179 30.887 14.5489C30.3273 14.6688 29.7768 14.8839 29.3117 15.0656C28.9954 15.1892 28.7186 15.2974 28.5052 15.3497C28.4329 15.3652 28.3657 15.3755 28.3089 15.3755C28.0299 15.3755 27.9266 15.2515 27.9473 14.9105C27.9491 14.8819 27.9511 14.8526 27.953 14.8225C28.022 13.771 28.1495 11.8258 27.9938 10.0075C27.7716 7.4346 26.9398 6.15848 25.953 5.02702C25.4828 4.48454 23.2664 2.13379 18.9989 2.13379C14.7417 2.13379 12.5201 4.48454 12.0448 5.02702C11.058 6.15331 10.2262 7.4346 10.0041 10.0075C9.8551 11.747 9.96981 13.6026 10.0365 14.6808C10.0415 14.7619 10.0462 14.8386 10.0506 14.9105C10.0712 15.236 9.96789 15.3755 9.6889 15.3755C9.6269 15.3755 9.5649 15.3652 9.49257 15.3497C9.27312 15.298 8.98647 15.1864 8.65874 15.0587C8.19948 14.8798 7.65955 14.6695 7.11082 14.5489C6.961 14.5179 6.80083 14.4972 6.64584 14.4972C6.14469 14.4972 5.66937 14.6883 5.47821 15.1947C5.19922 15.9283 5.57638 16.5224 6.43401 17.1218C6.59031 17.2296 6.87002 17.4107 7.19574 17.6217C7.94673 18.108 8.94236 18.7528 9.23425 19.023C9.66041 19.4091 9.6195 19.7173 9.56949 20.094C9.56797 20.1055 9.56643 20.117 9.5649 20.1287C9.52357 20.4593 8.58844 24.856 2.70381 27.7027C2.35766 27.868 1.77384 28.2194 2.80714 28.7929C3.695 29.2848 4.42192 29.4782 5.03532 29.6413C5.54272 29.7763 5.97245 29.8906 6.35135 30.1361C6.73707 30.3849 6.79163 30.7894 6.84226 31.1648C6.88522 31.4833 6.92535 31.7808 7.16249 31.9444C7.43801 32.1348 7.94856 32.1543 8.63644 32.1805C9.53514 32.2148 10.7365 32.2606 12.112 32.7142C12.7969 32.9408 13.3925 33.3067 14.0199 33.6922C15.2523 34.4493 16.6075 35.282 19.0041 35.282C21.3974 35.282 22.7667 34.4423 24.003 33.6841C24.6296 33.2999 25.2219 32.9366 25.8962 32.7142C27.2716 32.2606 28.473 32.2148 29.3717 32.1805C30.0596 32.1543 30.5701 32.1348 30.8457 31.9444C31.0858 31.778 31.1257 31.4792 31.1683 31.1602C31.2183 30.7861 31.2719 30.3844 31.6568 30.1361C32.0389 29.89 32.4699 29.7747 32.9783 29.6387Z" fill="black"></path></svg>
          </div>
        </Link>
        <div className="jdnvkfmv">
          <div className="loginoptions">
            <div className="ehfjenfedn">
              <div className="fjnvkfnv" style={{ fontWeight: '600', fontSize: '22px' }}>
                {issignup ? 'Sign up to VistaFeedd' : "Log in to VistaFeedd"}
              </div>
              <div className="ejfdmn" style={{ fontWeight: '500', fontSize: '18px' }}>
                Chat, Snap and video call your friends. Watch Stories and <br /> Spotlight, all from your computer.
              </div>
              {issignup ? <div className="ejfdmn" style={{ fontWeight: '500', fontSize: '18px', marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                {issignup ? 'Username' : 'Username or email address'}
                <input type="text" style={{ marginTop: '10px' }} className='jefjnjfjkj' value={username} onChange={(e) => setusername(e.target.value)} />
              </div> : <></>}
              <div className="ejfdmn" style={{ fontWeight: '500', fontSize: '18px', marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                {issignup ? 'Email Address' : 'Username or email address'}
                <input type="text" style={{ marginTop: '10px' }} className='jefjnjfjkj' value={email} onChange={(e) => setemail(e.target.value)} />
              </div>
              <div className="ejfdmn" style={{ fontWeight: '500', fontSize: '18px', marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                Password
                <input type="password" style={{ marginTop: '10px' }} className='jefjnjfjkj' value={password} onChange={(e) => setpassword(e.target.value)} />
              </div>
              <Link style={{ textDecoration: 'none' }}>
                <div className="ejfdmn" style={{ fontWeight: '500', fontSize: '15px', marginTop: '35px', display: 'flex', flexDirection: 'column', backgroundColor: '#00A3E0', height: '40px', width: '100%', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }} onClick={issignup ? signupuser : loginuser}>
                  {issignup ? 'Sign up' : 'Log in'}
                </div>
              </Link>
              {
                issignup ? <div className="ejfdmn" style={{ fontWeight: '500', fontSize: '15px', marginTop: '20px', display: 'flex', flexDirection: 'column', color: 'red',display: 'flex',alignItems: 'center',textAlign: 'center' ,justifyContent: 'center'}}>
                  {error}
                </div> : <></>
              }
              <div className="jrnjrnv" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: '10px' }}>
                {issignup ? 'Already have an account' : "Don't have an account"}
                <Link style={{ textDecoration: 'none', fontWeight: '600', fontSize: '15px' }} onClick={() => setsignup(!issignup)}>
                  {issignup ? 'Log in' : "Sign up"}
                </Link>
              </div>
            </div>
          </div>
          <div className="njnkfmkedmfkm">
            {/* <br /><br /> */}
            <div className="mdnk">
              <img src="https://static.snapchat.com/images/snapchatdotcom/Homepage+Bitmojis.png" alt="" height={'40px'} width={'200px'} />
              <div className="jndkfdlv">
                <video src={videolinks[currentIndex]} autoPlay muted width={'100%'} height={'90%'} style={{ borderRadius: '20px' }} onEnded={handleVideoEnd}></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
