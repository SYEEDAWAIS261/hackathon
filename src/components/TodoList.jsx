import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Add this at the top
import { useNavigate } from 'react-router-dom';
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '../firebase-config';
import {
  FaEdit,
  FaTrashAlt,
  FaArrowRight,
  FaUserCircle,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
// import AccountInfo from './Accountinfo';
import { format } from 'date-fns';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  const [endDate, setEndDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const [todos, setTodos] = useState({
    'in-process': [],
    'in-progress': [],
    'complete': []
  });
  const [filterText, setFilterText] = useState('');
  const [activeSection, setActiveSection] = useState('todos');
  const db = getFirestore();
const navigate = useNavigate();
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
        }
      }
    });
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
  setProfilePic(localStorage.getItem('profilePic') || '');
}, []);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        checked: false,
        startDate: new Date().toLocaleString(),
        endDate:  null
      };
      setTodos(prev => ({
        ...prev,
        'in-process': [...prev['in-process'], newTodoItem]
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
    setTodos(prev => {
      const updatedSection = prev[section].map(todo => {
        const formattedEndDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        return todo.id === id ? {
          ...todo,
          checked: !todo.checked,
          endDate: !todo.checked ? formattedEndDate : todo.endDate
        } : todo;
      });
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  const handleDeleteTodo = (id, section) => {
    setTodos(prev => ({
      ...prev,
      [section]: prev[section].filter(todo => todo.id !== id)
    }));
  };

  const handleEditTodo = (id, section) => {
    if (section === 'complete') return; // Prevent editing in complete section
    const newText = prompt('Edit task text:', todos[section].find(todo => todo.id === id)?.text || '');
    if (newText && newText.trim() !== '') {
      setTodos(prev => ({
        ...prev,
        [section]: prev[section].map(todo =>
          todo.id === id ? { ...todo, text: newText } : todo
        )
      }));
    }
  };

  const moveTodo = (id, fromSection, toSection) => {
    setTodos(prev => {
      const todoToMove = prev[fromSection].find(todo => todo.id === id);
      if (!todoToMove) return prev;

      const updatedTodo = toSection === 'complete'
        ? { ...todoToMove, endDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss') }
        : todoToMove;

      return {
        ...prev,
        [fromSection]: prev[fromSection].filter(todo => todo.id !== id),
        [toSection]: [...prev[toSection], updatedTodo]
      };
    });
  };

  const filteredTodos = (section) =>
    todos[section].filter(todo => todo.text.toLowerCase().includes(filterText.toLowerCase()));

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
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">Project Management App</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Welcome, {firstName} {lastName}</h5>
        <div>
          {/* <button className={`btn btn-outline-${activeSection === 'todos' ? 'primary' : 'secondary'} me-2`} onClick={() => setActiveSection('todos')}>Tasks</button> */}
        <div className="dropdown">
  <button
  className="border-0 bg-transparent p-0"
  type="button"
  data-bs-toggle="dropdown"
  aria-expanded="false"
  style={{
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(245, 245, 245)',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(230, 230, 230)')}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(245, 245, 245)')}
>
  {profilePic ? (
    <img
      src={profilePic}
      alt="Profile"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%'
      }}
    />
  ) : (
    <FaUserCircle size={28} color="#333" />
  )}
</button>


  <ul className="dropdown-menu dropdown-menu-end mt-2">
    <li>
      <button className="dropdown-item" onClick={() => navigate('/accountinfo')}>
        Account Info
      </button>
    </li>
    <li>
  <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleSignOut}>
    <FaSignOutAlt /> Sign Out
  </button>
</li>
  </ul>
</div>


        </div>
      </div>

      {activeSection === 'profile' ? (
        <div className="card p-4 shadow">
          <h4>User Profile</h4>
          <p><strong>First Name:</strong> {firstName}</p>
          <p><strong>Last Name:</strong> {lastName}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Filter tasks..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add a new task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <button className="btn btn-primary" onClick={handleAddTodo}>Add Task</button>
          </div>

          <div className="row">
            {['in-process', 'in-progress', 'complete'].map(section => (
              <div className="col-md-4" key={section}>
                <h5 className="text-capitalize">{section.replace('-', ' ')}</h5>
                <ul className="list-group">
                  {filteredTodos(section).map(todo => (
                    <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        {section === 'complete' ? (
                          <FaCheckCircle className="text-success me-2" />
                        ) : (
                          <input type="checkbox" checked={todo.checked} onChange={() => handleCheckboxChange(todo.id, section)} className="me-2" />
                        )}
                        {todo.text}
                        <div className="text-muted">
                          <small>Start: {todo.startDate}</small><br />
                          {todo.endDate && <small>End: {todo.endDate}</small>}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        {section !== 'complete' && (
                          <button className="btn btn-sm btn-link" onClick={() => moveTodo(todo.id, section, section === 'in-process' ? 'in-progress' : 'complete')}><FaArrowRight /></button>
                        )}
                        {section === 'in-progress' && (
                          <button className="btn btn-sm btn-link" onClick={() => moveTodo(todo.id, section, 'in-process')}><FaArrowLeft /></button>
                        )}
                        {section !== 'complete' && (
                          <button className="btn btn-sm btn-link" onClick={() => handleEditTodo(todo.id, section)}><FaEdit /></button>
                        )}
                        <button className="btn btn-sm btn-link text-danger" onClick={() => handleDeleteTodo(todo.id, section)}><FaTrashAlt /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;
