import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Landingpage from './Landing Page/landingpage';
function App() {
  // console.log('ENV',process.env.REACT_APP_FIREBASE_STORAGE_BUCKET);
  return (
    // <BrowserRouter>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
