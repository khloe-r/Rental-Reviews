import React, { useState, useEffect } from "react";
import RentalDataService from "../services/Rental";
import { Link } from "react-router-dom";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { useParams } from "react-router";
import { Box, Avatar, Center, Link as CLink, Container, ButtonGroup, Stack, Text, Image, Flex, VStack, Button, Heading, SimpleGrid, StackDivider, useColorModeValue, VisuallyHidden, List, ListItem } from "@chakra-ui/react";

const Rental = (props) => {
  const { id } = useParams();
  const initialRentalState = {
    id: null,
    name: "",
    property_type: "",
    beds: "",
    bathrooms: "",
    price: "",
    reviews: [],
  };

  const [rental, setRental] = useState(initialRentalState);

  const getRental = (id) => {
    RentalDataService.get(id)
      .then((response) => {
        console.log(response.data);
        setRental(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getRental(id);
  }, [rental, id]);

  const deleteReview = (reviewId, index) => {
    RentalDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setRental((prevState) => {
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (rental === initialRentalState) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="App">
      {rental ? (
        <Container maxW={"7xl"}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }} py={{ base: 18, md: 20 }}>
            <Stack spacing={{ base: 6, md: 10 }} divider={<StackDivider borderColor={"gray.200"} />}>
              <Flex>{rental.images.picture_url && <Image rounded={"md"} alt={"product image"} src={rental.images.picture_url} fit={"cover"} align={"center"} w={"100%"} h={{ base: "100%", sm: "400px", lg: "500px" }} />}</Flex>
              <Stack spacing={{ base: 6, md: 10 }}>
                <Center>
                  <Box w={"full"} bg={"white"} rounded={"lg"} px={6} textAlign={"center"}>
                    {rental.host.host_has_profile_pic && <Avatar size={"xl"} src={rental.host.host_picture_url} alt={"Avatar Alt"} mb={4} pos={"relative"} />}
                    <Heading fontSize={"2xl"} fontFamily={"body"}>
                      {rental.host.host_name}
                    </Heading>
                    <Text fontWeight={600} color={"gray.500"} mb={4}>
                      {rental.host.host_location}
                    </Text>
                  </Box>
                  <Box w={"full"} bg={"white"} rounded={"lg"} px={6} textAlign={"center"} noOfLines={6}>
                    <Text textAlign={"center"} color={"teal.500"} px={3}>
                      About your host
                    </Text>
                    <Text textAlign={"center"} color={"gray.700"} px={3}>
                      {rental.host.host_about ? rental.host.host_about : "No info available"}
                    </Text>
                  </Box>
                </Center>
              </Stack>
              <Stack spacing={{ base: 6, md: 10 }}>
                <Text fontSize={{ base: "16px", lg: "18px" }} color={"teal.500"} fontWeight={"500"} textTransform={"uppercase"} mb="2">
                  Our Rental Reviews
                </Text>
                {rental.our_reviews.length === 0 && (
                  <Text fontSize={{ base: "12px" }} color={"gray.500"} fontWeight={"500"} textTransform={"uppercase"} mb="2">
                    No Reviews Available
                  </Text>
                )}
                {rental.our_reviews.slice(0, 5).map((review, index) => {
                  return (
                    <Box maxW="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" mt="0">
                      <Box p="6">
                        <Box display="flex" alignItems="baseline">
                          <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase">
                            From {review.name}
                          </Box>
                        </Box>

                        <Box mt="1" fontWeight="semibold" as="h4" mb="3" lineHeight="tight" noOfLines={4}>
                          {review.text}
                        </Box>

                        <Box>Posted on {review.date}</Box>
                        {props.user && props.user.id === review.user_id && (
                          <Stack mt={8} direction={"row"} spacing={4}>
                            <Button
                              flex={1}
                              fontSize={"sm"}
                              rounded={"full"}
                              _focus={{
                                bg: "gray.200",
                              }}
                              as={Link}
                              to={{
                                pathname: `/rental/${id}/review`,
                                state: {
                                  currentReview: review,
                                },
                              }}
                            >
                              Edit Review
                            </Button>
                            <Button
                              flex={1}
                              fontSize={"sm"}
                              rounded={"full"}
                              bg={"teal.400"}
                              color={"white"}
                              _hover={{
                                bg: "teal.500",
                              }}
                              _focus={{
                                bg: "teal.500",
                              }}
                              onClick={() => {
                                deleteReview(review._id, index);
                              }}
                            >
                              Delete Review
                            </Button>
                          </Stack>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Box as={"header"}>
                <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}>
                  {rental.name}
                </Heading>
                <Text color={"gray.900"} fontWeight={300} fontSize={"2xl"}>
                  ${rental.price["$numberDecimal"]} / night
                </Text>
              </Box>

              <Stack spacing={{ base: 0, sm: 6 }} direction={"column"} divider={<StackDivider borderColor={"gray.200"} />}>
                <VStack spacing={{ base: 4, sm: 6 }}>
                  <Text color={"gray.500"} fontSize={"2xl"} fontWeight={"300"}>
                    {rental.summary}
                  </Text>
                  <Text fontSize={"lg"}>{rental.interaction}</Text>
                </VStack>
                <Box>
                  <Text fontSize={{ base: "16px", lg: "18px" }} color={"teal.500"} fontWeight={"500"} textTransform={"uppercase"} mb={"4"}>
                    Features
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                    <List spacing={2}>
                      {rental.amenities.slice(0, 3).map((l) => (
                        <ListItem>{l}</ListItem>
                      ))}
                    </List>
                    <List spacing={2}>
                      {rental.amenities.slice(4, 7).map((l) => (
                        <ListItem>{l}</ListItem>
                      ))}
                    </List>
                  </SimpleGrid>
                </Box>
                <Box>
                  <Text fontSize={{ base: "16px", lg: "18px" }} color={"teal.500"} fontWeight={"500"} textTransform={"uppercase"} mb={"4"}>
                    Accomodation Details
                  </Text>

                  <List spacing={2}>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Property Type:
                      </Text>{" "}
                      {rental.property_type}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Beds:
                      </Text>{" "}
                      {rental.beds}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Bathrooms:
                      </Text>{" "}
                      {rental.bathrooms["$numberDecimal"]}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Minimum Nights:
                      </Text>{" "}
                      {rental.minimum_nights}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Cleaning Fee:
                      </Text>{" "}
                      ${rental.cleaning_fee["$numberDecimal"]}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Extra People Fee:
                      </Text>{" "}
                      ${rental.extra_people["$numberDecimal"]}{" "}
                    </ListItem>
                  </List>
                </Box>
              </Stack>
              <ButtonGroup variant="outline" spacing="6">
                <Button
                  rounded={"none"}
                  w={"full"}
                  size={"lg"}
                  py={"7"}
                  bg={"teal.700"}
                  color={"white"}
                  textTransform={"uppercase"}
                  _hover={{
                    transform: "translateY(2px)",
                    boxShadow: "lg",
                    textDecoration: "none",
                  }}
                  as={CLink}
                  href={rental?.listing_url}
                  isExternal
                >
                  View Listing
                </Button>
                <Button
                  rounded={"none"}
                  w={"full"}
                  size={"lg"}
                  py={"7"}
                  bg={"white"}
                  color={"teal.700"}
                  textTransform={"uppercase"}
                  _hover={{
                    transform: "translateY(2px)",
                    boxShadow: "lg",
                    textDecoration: "none",
                  }}
                  as={Link}
                  to={`/rental/${id}/review`}
                >
                  Add Review
                </Button>
              </ButtonGroup>

              <Stack direction="row" alignItems="center" justifyContent={"center"}>
                <Text>Last updated at: {rental.last_scraped}</Text>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Container>
      ) : (
        <Alert status="error">
          <AlertIcon />
          Listing does not exist!
        </Alert>
      )}
    </div>
  );
};

export default Rental;
