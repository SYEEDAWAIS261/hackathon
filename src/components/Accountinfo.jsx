import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase-config';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, getFirestore, getDoc, setDoc } from 'firebase/firestore';
import { FaEdit, FaLock, FaUser } from 'react-icons/fa';

const AccountInfo = () => {
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const [firstName, setFirstName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [activeTab, setActiveTab] = useState('password');
  const fileInputRef = useRef();
  const [lastName, setLastName] = useState('');
const [newLastName, setNewLastName] = useState('');
const [mobile, setMobile] = useState('');
const [dob, setDob] = useState('');
const [address, setAddress] = useState('');


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || '');
          setNewFirstName(data.firstName || '');
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setNewFirstName(data.firstName || '');
          setNewLastName(data.lastName || '');
          setMobile(data.mobile || '');
          setDob(data.dob || '');
          setAddress(data.address || '');
        }
      }
    });
    return () => unsubscribe();
  }, [db]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      localStorage.setItem('profilePic', base64);
      setProfilePic(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  const handleAccountUpdate = async (e) => {
  e.preventDefault();
  if (!user) return;

  try {
    await setDoc(doc(db, 'users', user.uid), {
      firstName: newFirstName,
      lastName: newLastName,
      mobile,
      dob,
      address
    }, { merge: true });
    alert('Account info updated!');
    setFirstName(newFirstName);
    setLastName(newLastName);
  } catch (err) {
    alert('Error updating account: ' + err.message);
  }
};


  const handleNameUpdate = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', user.uid), {
        firstName: newFirstName
      }, { merge: true });
      alert('Name updated!');
      setFirstName(newFirstName);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-4 d-flex flex-column" style={{ width: '250px' }}>
        <div className="position-relative text-center mb-4">
  <div
    className="rounded-circle mx-auto border"
    style={{
      width: '120px',
      height: '120px',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    {profilePic ? (
      <img src={profilePic} alt="Profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
    ) : (
      <div className="bg-secondary w-100 h-100 d-flex align-items-center justify-content-center">
        <span className="text-white">No Image</span>
      </div>
    )}
  </div>

  {/* 👇 Just the edit icon below the profile image */}
  <FaEdit
    title="Edit Profile Picture"
    className="mt-2"
    style={{
      cursor: 'pointer',
      fontSize: '20px',
      color: '#ccc',
      transition: 'color 0.3s'
    }}
    onClick={() => fileInputRef.current.click()}
    onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
    onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
  />
  <input
    type="file"
    ref={fileInputRef}
    accept="image/*"
    className="d-none"
    onChange={handleProfilePicChange}
  />
</div>

          <h5 className="mt-3">{firstName}</h5>
        <div className="nav flex-column">
          <button className={`btn btn-sm text-start ${activeTab === 'password' ? 'btn-light' : 'btn-outline-light'} mb-2`} onClick={() => setActiveTab('password')}>
            <FaLock className="me-2" /> Change Password
          </button>
          <button className={`btn btn-sm text-start ${activeTab === 'account' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setActiveTab('account')}>
            <FaUser className="me-2" /> Manage Account
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 flex-grow-1 bg-light">
        {activeTab === 'password' && (
          <div>
            <h4 className="mb-4">Change Password</h4>
            <form onSubmit={handlePasswordUpdate} style={{ maxWidth: '400px' }}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit">Update Password</button>
            </form>
          </div>
        )}

        {activeTab === 'account' && (
  <div>
    <h4 className="mb-4">Manage Account</h4>
    <form onSubmit={handleAccountUpdate} style={{ maxWidth: '500px' }}>
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Mobile Number</label>
        <input
          type="tel"
          className="form-control"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          className="form-control"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Address</label>
        <textarea
          className="form-control"
          rows="2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
      </div>
      <button className="btn btn-primary" type="submit">Update Info</button>
    </form>
  </div>
)}

      </div>
    </div>
  );
};

export default AccountInfo;
