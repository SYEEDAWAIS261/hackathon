import './App.css'
import React from 'react';
//  import { auth } from './firebase-config';
// import AccountLogo from './components/AccountLogo';
import TodoList from './components/TodoList';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccountInfo from './components/Accountinfo';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>
          {/* <AccountLogo />    */}
            <Route path="/" element={<TodoList />} />
            <Route path="/accountinfo" element={<AccountInfo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};


export default App;
