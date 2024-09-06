// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
// import { auth } from './firebase-config';
// import AccountLogo from './components/AccountLogo';
import TodoList from './components/TodoList';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useEffect, useState } from 'react';

const App = () => {
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(setUser);
  //   return () => unsubscribe();
  // }, []);
  return (
    <Router>
      <div className="app-container">
        {/* <header className="header d-flex justify-content-between align-items-center p-3">
          {user && <AccountLogo user={user} />}
        </header> */}
        <main>
          <Routes>
            <Route path="/" element={<TodoList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};


export default App;
