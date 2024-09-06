import React, { useState, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '../firebase-config';
import { FaEdit, FaTrashAlt, FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { format } from 'date-fns';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState({
    'in-process': [],
    'in-progress': [],
    'complete': []
  });
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          setFirstName(docSnapshot.data().firstName || '');
          setLastName(docSnapshot.data().lastName || '');
          setEmail(docSnapshot.data().email || '');
          setProfilePic(docSnapshot.data().profilePic || '');
        }
      }
    });
    return () => unsubscribe();
  }, [db]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        checked: false,
        startDate: new Date().toLocaleString(),
        endDate: null
      };
      setTodos(prevTodos => ({
        ...prevTodos,
        'in-process': [
          ...prevTodos['in-process'],
          newTodoItem
        ]
      }));
      setNewTodo('');
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email
        });
        alert('Sign up successful!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sign in successful!');
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Authentication failed!');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleCheckboxChange = (id, section) => {
    setTodos(prevTodos => {
      const updatedSection = prevTodos[section].map(todo => {
        const formattedEndDate = todo.checked ? format(new Date(), 'yyyy-MM-dd HH:mm:ss') : todo.endDate;
        return todo.id === id ? { 
          ...todo, 
          checked: !todo.checked, 
          endDate: !todo.checked ? formattedEndDate : todo.endDate 
        } : todo;
      });
      return {
        ...prevTodos,
        [section]: updatedSection
      };
    });
  };

  const handleDeleteTodo = (id, section) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [section]: prevTodos[section].filter(todo => todo.id !== id)
    }));
  };

  const handleEditTodo = (id, section) => {
    const newText = prompt('Edit task text:', todos[section].find(todo => todo.id === id)?.text || '');
    if (newText && newText.trim() !== '') {
      setTodos(prevTodos => ({
        ...prevTodos,
        [section]: prevTodos[section].map(todo =>
          todo.id === id ? { ...todo, text: newText } : todo
        )
      }));
    }
  };

  const moveTodo = (id, fromSection, toSection) => {
    setTodos(prevTodos => {
      const todoToMove = prevTodos[fromSection].find(todo => todo.id === id);
      if (!todoToMove) return prevTodos;

      return {
        ...prevTodos,
        [fromSection]: prevTodos[fromSection].filter(todo => todo.id !== id),
        [toSection]: [...prevTodos[toSection], todoToMove]
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profile_pics/${user.uid}/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setProfilePic(url);

        // Update Firestore document
        await setDoc(doc(db, 'users', user.uid), { profilePic: url }, { merge: true });
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    }
  };

  const getDefaultProfilePic = () => {
    if (firstName) {
      const initials = firstName.charAt(0).toUpperCase();
      return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
    }
    return '/default-profile-pic.png';
  };

  if (!user) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="card shadow" style={{ borderRadius: '.75rem', maxWidth: '400px', width: '100%' }}>
          <div className="card-body p-4">
            <h4 className="card-title mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h4>
            <form onSubmit={handleAuth}>
              {isSignUp && (
                <>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 style={{display:"flex", justifyContent:"center", color:"blue"}}>Project Managment App</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="profile-pic-container">
          <img
            src={profilePic || getDefaultProfilePic()}
            alt="Profile"
            className="rounded-circle profile-pic"
          />
          <input
            type="file"
            className="profile-pic-upload"
            onChange={handleFileChange}
          />
        </div>
        <button className="btn btn-secondary" onClick={handleSignOut}>
          <FaUserCircle className="me-2" />
          Sign Out
        </button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
      </div>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handleAddTodo}>
          Add Task
        </button>
      </div>
      <div className="todo-sections">
        <div className="todo-section mb-4">
          <h5>In Process</h5>
          <ul className="list-group">
            {todos['in-process'].map(todo => (
              <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={todo.checked}
                    onChange={() => handleCheckboxChange(todo.id, 'in-process')}
                    className="me-2"
                  />
                  {todo.text}
                  <div className="text-muted">
                    <small>Start Date: {todo.startDate}</small>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => handleEditTodo(todo.id, 'in-process')}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => handleDeleteTodo(todo.id, 'in-process')}
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => moveTodo(todo.id, 'in-process', 'in-progress')}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="todo-section mb-4">
          <h5>In Progress</h5>
          <ul className="list-group">
            {todos['in-progress'].map(todo => (
              <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={todo.checked}
                    onChange={() => handleCheckboxChange(todo.id, 'in-progress')}
                    className="me-2"
                  />
                  {todo.text}
                  <div className="text-muted">
                    <small>Start Date: {todo.startDate}</small><br />
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => handleEditTodo(todo.id, 'in-progress')}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => handleDeleteTodo(todo.id, 'in-progress')}
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => moveTodo(todo.id, 'in-progress', 'complete')}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="todo-section">
          <h5>Complete</h5>
          <ul className="list-group">
            {todos['complete'].map(todo => (
              <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {todo.text}
                  <div className="text-muted">
                    <small>Start Date: {todo.startDate}</small><br />
                    <small>End Date: {todo.endDate}</small>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => handleDeleteTodo(todo.id, 'complete')}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
