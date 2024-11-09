import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

// Firebase config
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

export default function Searchpagemobile() {
    const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to fetch search results from Firestore
  const searchUsers = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]); // Reset results if the search query is empty
      return;
    }

    setLoading(true);

    try {
      const usersRef = collection(db, 'User Details'); // Assuming your collection name is 'User Details'
      
      // Searching where 'name' >= searchQuery
      const q = query(
        usersRef, 
        where('Name', '>=', searchQuery),
        where('Name', '<=', searchQuery + '\uf8ff') // This ensures the query fetches all documents starting with searchQuery
      );
      
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setSearchResults(results); // Update the state with search results
    } catch (error) {
      console.error("Error fetching search results: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Run search when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]); // Clear results if query is empty
    }
  }, [searchQuery]);
  return (
    <div style={{
        overflowY: "auto",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "0px",
        marginLeft: "0px",
        width: "100%",
        color: "white",
        gap: "0px",
      }}>
      <div className="ncnjndjv">
        <div className="bvnvfmnv">
          <input
            type="text"
            className="ebfnb"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            
          />
        </div>
        <div
          style={{
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: "10px", // Set the gap between the search result items to 10px
            marginTop: "20px",
            marginLeft: "20px",
          }}
        >
          {loading && <p style={{ color: "white" }}>Loading...</p>}
          {searchResults.length === 0 && !loading && <p style={{ color: "white" }}>No results found</p>}

          <div>
            {searchResults.map((user, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px", // Space between profile picture and name
                  marginBottom: "50px", // Add margin between search results
                }}
              >
                <img
                  src={user['Profile Pic'] || "default-profile-pic-url.jpg"} // Use a default image if no profile picture is available
                  alt={`${user.Name}'s profile`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%", // Make the profile picture circular
                    objectFit: "cover", // Ensure the image is scaled properly within the circle
                  }}
                />
                <Link
                  to={`/others/${user.id}`}
                  style={{
                    fontSize: "16px",
                    color: "white", // Set the name color to white
                    textDecoration: "none", // Remove underline
                    fontWeight: "bold",
                  }}
                >
                  {user.Name}
                </Link>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
