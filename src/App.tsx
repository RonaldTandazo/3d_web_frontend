// import { useAuth } from './context/AuthContext';
// import { Button, Box } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';

// const App = () => {
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/signin');
//   };

//   return (
//     <Box>
//       <Box as="header" p={4} bg="teal.500" color="white">
//         <Button onClick={() => navigate('/')}>ArtVerse</Button>
//         {isAuthenticated ? (
//           <>
//             <Button onClick={handleLogout} ml={4}>Logout</Button>
//             <Button onClick={() => navigate('/product/1')} ml={4}>Product Page</Button>
//           </>
//         ) : (
//           <Button onClick={() => navigate('/signin')} ml={4}>Login</Button>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default App;
