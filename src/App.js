import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Landingpage from './Landing Page/landingpage';
import Homepage from './Home Page/homepage';
import Search_Page from './Home Page/Search_Page';
import ExplorePage from './Home Page/Explorepage';
import Reels_Page from './Home Page/Reels_Page';
import MessengerPage from './Home Page/Messengerpage';
import NotificationPage from './Home Page/Notifiactionpage';
import Profile_Page from './Home Page/Profile_Page';
import { Analytics } from "@vercel/analytics/react"
import OtherProfile from './Home Page/Sidebar Pages(Laptop)/OtherProfile';
function App() {
  // console.log('ENV',process.env.REACT_APP_FIREBASE_STORAGE_BUCKET);
  return (
    // <BrowserRouter>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
      </Routes>
      <Routes>
        <Route path="/home" element={<Homepage />} />
      </Routes>
      <Routes>
        <Route path="/search" element={<Search_Page />} />
      </Routes>
      <Routes>
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
      <Routes>
        <Route path="/reels" element={<Reels_Page />} />
      </Routes>
      <Routes>
        <Route path="/messages" element={<MessengerPage />} />
      </Routes>
      <Routes>
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile_Page />} />
      </Routes>
      <Routes>
        <Route path="/others" element={<OtherProfile />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
