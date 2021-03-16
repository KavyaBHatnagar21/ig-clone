import React, {useState, useEffect} from 'react'
import logo from './logo.png'
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { Button, Input, makeStyles } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;
  
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]); 
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id, 
        post: doc.data()})));
    })
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in...
        console.log(authUser);
        console.log(username);
        console.log("I am recieving user info and name");
        setUser(authUser);
         
      } else {
        //user has logged out...
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  
  }, [user, username]);
   

  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return (authUser.user.updateProfile({
        displayName: username,
      })
      )
    })
    .catch((error) => alert(error.message));

    
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
  }

  

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup"> 
        <center>
          <img 
            className="app__headerImage"
            src={logo}
            alt="logo"
          />
        </center>  
          <Input 
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />  
          <Input 
            placeholder="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form> 
      </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup"> 
        <center>
          <img 
            className="app__headerImage"
            src={logo}
            alt="logo"
          />
        </center>  
         
          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />  
          <Input 
            placeholder="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button type="submit" onClick={signIn}>Sign In</Button>
          </form> 
      </div>
      </Modal>

     <div className="app__header">
       <img className="app__headerImage" src={logo} alt="ig logo" />
   
      { user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button> 
      ) : (
        <div className="app__loginContainer">
        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button> 
        <Button onClick={() => setOpen(true)}>Sign Up</Button> 
        </div>
      )}
      </div>
      {/* Header */}
      <div className="app__posts">
        
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} 
            user={user}
            username={post.username} 
            caption={post.caption} 
            imageURL={post.imageURL} />
          ))
        }
      </div>
      
     <div className="app__upload">
   
      {user ? 
      (<ImageUpload username={user?.displayName} />) : (<h3>You need to login to upload</h3>)
      }
      
     </div>
    </div>
  );
}
