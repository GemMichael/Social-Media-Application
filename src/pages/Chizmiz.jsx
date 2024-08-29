import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, 
  Button, 
  Text, 
  Stack, 
  Image, 
  Input 
} from '@chakra-ui/react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';



const fetchLikes = async (db, chizmizId) => {
  try {
    const docRef = doc(db, 'chizmizs', chizmizId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return Array.isArray(docSnap.data().likes) ? docSnap.data().likes : [];
    } else {
      console.error('No such document!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error('Failed to fetch likes');
  }
};


const fetchComments = async (db, chizmizId) => {
  try {
    const docRef = doc(db, 'chizmizs', chizmizId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return Array.isArray(docSnap.data().comments) ? docSnap.data().comments : [];
    } else {
      console.error('No such document!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error('Failed to fetch comments');
  }
};

const Chizmiz = ({ body, name, datePosted, userId, chizmizId, db, initialLikes = [], imageUrl = '', initialComments = [] }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching likes and comments for chizmizId:', chizmizId);
        const fetchedLikes = await fetchLikes(db, chizmizId);
        const fetchedComments = await fetchComments(db, chizmizId);
        console.log('Fetched likes:', fetchedLikes);
        console.log('Fetched comments:', fetchedComments);
        setLikes(fetchedLikes);
        setComments(fetchedComments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [db, chizmizId]);


  const handleLike = async () => {
    try {
      const updatedLikes = likes.includes(userId)
        ? likes.filter((id) => id !== userId)
        : [...likes, userId];
      setLikes(updatedLikes);

      const docRef = doc(db, 'chizmizs', chizmizId);
      await updateDoc(docRef, { likes: updatedLikes });
    } catch (error) {
      console.error('Error updating likes:', error);
      setError('Failed to update likes.');
    }
  };


  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      const newCommentObj = { id: Date.now(), user_name: name, comment: newComment };

      try {

        const updatedComments = [...comments, newCommentObj];
        setComments(updatedComments);


        const docRef = doc(db, 'chizmizs', chizmizId);
        await updateDoc(docRef, { comments: updatedComments });


        setNewComment('');
      } catch (error) {
        Swal.fire({
          text: "There are errors in the registration. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  const handleDeletePost = async () => {
    try {
      const docRef = doc(db, 'chizmizs', chizmizId);
      await deleteDoc(docRef);
      console.log('Document sucessfully deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete the post.');
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="red">{error}</Box>;
  }

  return (
    <Box maxW="600px" mx="auto" p={6} bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.300" mb={4}>
      <Stack spacing={3}>
        <Text textAlign="left" fontSize="lg" fontWeight="bold" color="gray.700">
          {name}
        </Text>
        <Text textAlign="left" fontSize="sm" color="gray.400">
          {datePosted}
        </Text>
        {imageUrl && (
          <Image src={imageUrl} alt="Chizmiz image" borderRadius="md" mb={2} maxH="400px" objectFit="cover" />
        )}
        <Text textAlign="center" fontSize="md" color="gray.800">
          {body}
        </Text>
                  <Button
            onClick={handleDeletePost}
            sx={{ width: '100%', py: 1.5, borderRadius: '8px' }}
            bg="red.600"
            color="white"
            variant="solid"
            size="sm"
            _hover={{ bg: 'red.700' }}
          >
            Delete Post
          </Button>

        <Button onClick={handleLike} sx={{ width: '100%', py: 1.5, borderRadius: '8px' }} bg="#1a237e" color="white" variant="solid" size="sm" px={4} py={2} _hover={{ bg: '#3f51b5' }}>
          {likes.includes(userId) ? '👍🏿' : '👍🏻'} {likes.length > 0 && <Text as="span" ml={2} fontWeight="bold">({likes.length})</Text>}
        </Button>


        <Stack mt={4} spacing={2}>
          <Input placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} size="sm" />
          <Button
            onClick={handleCommentSubmit}
            sx={{ width: '100%', py: 1.5, borderRadius: '8px' }}
            bg="#1a237e"
            colorScheme="blue"
            color="white"
            variant="solid"
            size="sm"
            _hover={{ bg: '#3f51b5' }}
            disabled={newComment.trim() === ''}
          >
            Comment
          </Button>


          {comments.map((comment) => (
            <Box key={comment.id} bg="gray.100" p={2} borderRadius="md">
              <Text fontSize="sm" fontWeight="bold">{comment.user_name}</Text>
              <Text fontSize="sm">{comment.comment}</Text>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};


Chizmiz.propTypes = {
  body: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  datePosted: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  chizmizId: PropTypes.string.isRequired,
  db: PropTypes.object.isRequired,
  initialLikes: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  initialComments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_name: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
  }))
};

Chizmiz.defaultProps = {
  initialLikes: [],
  imageUrl: '',
  initialComments: []
};

export default Chizmiz;
