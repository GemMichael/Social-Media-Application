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
  import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
  import { useState, useEffect } from 'react';
  import Swal from 'sweetalert2';

function Register() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  let navigate = useNavigate();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  }, [])

  const handleRegistration = () => {
    if (
      name !== '' &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword
    ) {
      createUserWithEmailAndPassword(auth, email, password).then(
        (userCredentials) => {
          const user = userCredentials.user;

          updateProfile(auth.currentUser, {
            displayName: name
          });

          navigate("/");

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
        <Text fontSize='3xl' color="1a237e" mb={5}>Create an account</Text>
        {/* Login Form */}
        <Card>
          <CardBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type='text'
              onChange={(e) => {
                setName(e.target.value)
              }}
              value={name} />
          </FormControl>

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

            <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type='password'
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
              value={confirmPassword}
            />
          </FormControl>

          <Button mt={5} colorScheme='purple' onClick={handleRegistration}>Create account</Button>
          <Box mt={5}>
            <Link to='/login'>
              <ChakraLink>Already have an account? Login here.</ChakraLink>
            </Link>
            </Box>
          </CardBody>
        </Card>
      </Container>
    );
}

export default Register;