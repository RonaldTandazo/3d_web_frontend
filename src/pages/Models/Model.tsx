import { useAuth } from '../../context/AuthContext';
import { Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleAddToFavorites = () => {
        if (!isAuthenticated) {
            // Redirigir a la página de login o mostrar un mensaje
            navigate('/signin');
        } else {
            // Lógica para agregar a favoritos
            console.log('Producto agregado a favoritos');
        }
    };

    return (
        <div>
            <Text>Producto: iPhone 13</Text>
            <Button onClick={handleAddToFavorites}>
                {isAuthenticated ? 'Añadir a Favoritos' : 'Inicia sesión para agregar a Favoritos'}
            </Button>
        </div>
    );
};

export default ProductPage;
