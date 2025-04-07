import {
  Card,
  CardBody,
  VStack,
  Skeleton,
  SkeletonText,
  useColorModeValue,
  SlideFade
} from '@chakra-ui/react';

interface LoadingSkeletonProps {
  isVisible: boolean;
}

export const LoadingSkeleton = ({ isVisible }: LoadingSkeletonProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const startColor = useColorModeValue('red.100', 'red.900');
  const endColor = useColorModeValue('red.300', 'red.700');
  
  return (
    <SlideFade in={isVisible} offsetY="20px">
      <Card w="full" bg={cardBg} boxShadow="xl" borderRadius="2xl">
        <CardBody>
          <VStack spacing={6} align="start">
            <Skeleton 
              height="250px" 
              w="full" 
              startColor={startColor} 
              endColor={endColor} 
              borderRadius="xl" 
              fadeDuration={1}
            />
            
            <Skeleton 
              height="30px" 
              width="70%" 
              startColor={startColor} 
              endColor={endColor} 
              borderRadius="lg"
              fadeDuration={1.2}
            />
            
            <VStack spacing={3} w="full" align="start">
              <Skeleton 
                height="20px" 
                width="30%" 
                startColor={startColor} 
                endColor={endColor} 
                borderRadius="md"
                fadeDuration={1.4}
              />
              
              <SkeletonText 
                noOfLines={4} 
                spacing="4" 
                skeletonHeight="4"
                startColor={startColor} 
                endColor={endColor} 
                fadeDuration={1.6}
                w="full"
              />
            </VStack>
            
            <Skeleton 
              height="1px" 
              width="100%" 
              startColor={startColor} 
              endColor={endColor}
              fadeDuration={1.8}
            />
            
            <SkeletonText 
              noOfLines={8} 
              spacing="4" 
              skeletonHeight="4"
              startColor={startColor} 
              endColor={endColor}
              fadeDuration={2}
              w="full"
            />
          </VStack>
        </CardBody>
      </Card>
    </SlideFade>
  );
};

export default LoadingSkeleton; 