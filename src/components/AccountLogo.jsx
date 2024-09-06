// // src/components/AccountLogo.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signOut } from '../firebase-config';
// import { FaUserCircle } from 'react-icons/fa';

// const AccountLogo = ({ user }) => {
//   const navigate = useNavigate();

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       navigate('/');
//     } catch (error) {
//       console.error('Error signing out:', error.message);
//     }
//   };

//   return (
//     <div className="account-logo d-flex align-items-center">
//       <FaUserCircle size={40} />
//       <div className="ms-2">
//         <strong>{user ? user.email.split('@')[0] : 'Guest'}</strong>
//         <br />
//         <button onClick={handleSignOut} className="btn btn-link">Sign Out</button>
//       </div>
//     </div>
//   );
// };

// export default AccountLogo;
