import {
    FormControl,
    FormLabel,
    Input,
    Heading,
    Box,
    Button,
    Container,
    Card,
    CardBody,
    Text,
    Link as ChakraLink,
  
  } from '@chakra-ui/react'

  import { Link, useNavigate } from 'react-router-dom';
  import firebaseApp from "../pages/firebaseConfig.jsx";
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
  import { useState, useEffect } from 'react';
  import Swal from 'sweetalert2';


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate("/");
        }
      });
    }, [])

    const handleLogin = () => {

      if (email !== '' && password !== '') {
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/');
        }).catch((error) => {
          Swal.fire({
            text: "Invalid email or password",
            icon: "error",
            confirmButtonColor: "#3085d6",
        });
      });
      } else {
        Swal.fire({
          text: "There are errors in the registration. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    }

    return (
        <Container maxW="1024px" p="40">

        <Heading size='3xl' mb={5}>Welcome to Chizmiz!</Heading>
        <Text fontSize='3xl' color="#1a237e" mb={5}>Login to your account</Text>
        {/* Login Form */}
        <Card>
          <CardBody>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type='email'
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              value={password}
            />
          </FormControl>
            <Button mt={5} colorScheme='purple' onClick={handleLogin}>Login</Button>
            <Box mt={5}>
              <Link to='/register'>
                <ChakraLink>Don't have an account? Register here.</ChakraLink>
              </Link>
            </Box>
          </CardBody>
        </Card>
      </Container>
    );
}

export default Login;