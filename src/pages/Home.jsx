import { ThemeProvider, 
  createTheme 
} from '@mui/material/styles';
import { Button, 
  TextField, 
  Typography,  
  MenuItem, 
  Menu 
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import * as React from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import firebaseApp from "../pages/firebaseConfig";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, addDoc, collection, Timestamp, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Chizmiz from './Chizmiz';
import { format } from 'date-fns';


function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [chizmiz, setChizmiz] = useState('');
  const [image, setImage] = useState(null);
  const [chizmizs, setChizmizs] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserProfile({
          email: user.email,
          name: user.displayName
        });
      } else {
        navigate("/login");
      }
    });

    const unsubscribeSnapshot = onSnapshot(collection(db, "chizmizs"), (snapshot) => {
      const sortedChizmizs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.date_posted.toDate() - a.date_posted.toDate());

      setChizmizs(sortedChizmizs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, [auth, db, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const createChizmiz = async () => {
    setButtonLoading(true);
    if (chizmiz.trim() === '') {
      alert("Chizmiz cannot be empty!");
      setButtonLoading(false);
      return;
    }

    const chizmizData = {
      body: chizmiz.trim(),
      user_email: userProfile.email,
      name: userProfile.name,
      date_posted: Timestamp.now(),
      likes: 0, 
    };

    try {
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        chizmizData.imageUrl = imageUrl;
      }


      await addDoc(collection(db, "chizmizs"), chizmizData);


      setChizmiz('');
      setImage(null);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to post Chizmiz. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  const theme = createTheme({
    palette: {
      primary: { main: '#1a237e' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Chizmiz
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls="primary-search-account-menu-mobile"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box component="main" sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              maxWidth: '600px',
              width: '100%',
              p: 4,
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              mb: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Spill the tea🤭
            </Typography>
            <TextField
              label="Share the tea"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={chizmiz}
              onChange={(e) => setChizmiz(e.target.value)}
              margin="normal"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ margin: '16px 0' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={createChizmiz}
              disabled={buttonLoading}
              sx={{ width: '100%', py: 1.5, borderRadius: '8px' }}
              _hover={{ bg: '#3f51b5' }}
            >
              {buttonLoading ? 'Posting...' : 'Post'}
            </Button>
          </Box>
          <Box sx={{ maxWidth: '600px', width: '100%' }}>
            {chizmizs.map((item) => (
              <Chizmiz
              key={item.id}
              body={item.body}
              name={item.name}
              datePosted={format(item.date_posted.toDate(), 'HH:mm MMM dd, yyyy')}
              imageUrl={item.imageUrl}
              userId={userProfile.email}  
              chizmizId={item.id}  
              db={db}  
              currentUserId={userProfile.email}
            />
            ))}
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id="primary-search-account-menu"
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id="primary-search-account-menu-mobile"
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >

          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton size="large" aria-label="account of current user" color="inherit">
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
          <MenuItem onClick={logout}>
            <IconButton size="large" aria-label="logout" color="inherit">
              <AccountCircle />
            </IconButton>
            <p>Logout</p>
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
}

export default Home;