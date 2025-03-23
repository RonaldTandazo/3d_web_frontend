import { Box, Grid, Image, Text, Button } from '@chakra-ui/react';

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
}

const ArtVerse = () => {
  const products: Product[] = [
    { id: 1, name: "Producto 1", image: "/product1.jpg", price: "$10" },
    { id: 2, name: "Producto 2", image: "/product2.jpg", price: "$20" },
    { id: 3, name: "Producto 3", image: "/product3.jpg", price: "$30" }
  ];

  return (
    <Box p={5}>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {products.map((product) => (
          <Box key={product.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image src={product.image} alt={product.name} />
            <Box p={5}>
              <Text fontSize="xl">{product.name}</Text>
              <Text color="gray.500">{product.price}</Text>
              <Button mt={2} variant="outline">Ver Producto</Button>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default ArtVerse;
