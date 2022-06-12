import React, { useState } from "react";
import RentalDataService from "../services/Rental";
import { Link, useParams, useLocation } from "react-router-dom";
import { Box, Heading, FormControl, Textarea, FormLabel, Container, InputGroup, Input, VStack, InputLeftElement, Text, Button, Stack, Icon, useColorModeValue, createIcon } from "@chakra-ui/react";

const AddReview = (props) => {
  let initialReviewState = "";
  let initialStars = 0;
  let editing = false;
  const { id, status } = useParams();
  const location = useLocation();

  if (status === "edit") {
    editing = true;
    initialReviewState = location.state.currentReview.text;
    initialStars = location.state.currentReview.stars ? location.state.currentReview.stars : 0;
  }

  const [review, setReview] = useState(initialReviewState);
  const [stars, setStars] = useState(initialStars);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setReview(e.target.value);
  };
  const handleStarsChange = (e) => {
    setStars(e.target.value);
    console.log(stars);
  };

  const saveReview = () => {
    var data = {
      text: review,
      stars: stars,
      name: props.user.name,
      user_id: props.user.id,
      rental_id: id,
    };

    if (editing) {
      data.review_id = location.state.currentReview._id;
      RentalDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      RentalDataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="App">
      {props.user ? (
        <>
          {submitted ? (
            <Container maxW={"3xl"}>
              <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
                <Heading fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
                  Thank you!
                </Heading>
                <Stack direction={"column"} spacing={3} align={"center"} alignSelf={"center"} position={"relative"}>
                  <Button
                    colorScheme={"teal"}
                    bg={"teal.400"}
                    rounded={"full"}
                    px={6}
                    _hover={{
                      bg: "teal.500",
                    }}
                    as={Link}
                    to={`/rental/${id}`}
                  >
                    Back to rental
                  </Button>
                </Stack>
              </Stack>
            </Container>
          ) : (
            <Box bg={"white"} p={8}>
              <Heading fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"} textAlign="center">
                {editing ? "Edit" : "Add"} your Review
              </Heading>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Stars</FormLabel>

                  <InputGroup>
                    <Input type="number" name="stars" placeholder="Number of Stars" min={0} max={5} value={stars} onChange={handleStarsChange} />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Review</FormLabel>

                  <Textarea name="review" placeholder="Your Review" rows={8} resize="none" value={review} onChange={handleInputChange} />
                </FormControl>

                <Button
                  colorScheme="teal"
                  bg="teal.400"
                  color="white"
                  _hover={{
                    bg: "teal.500",
                  }}
                  onClick={saveReview}
                >
                  {editing ? "Edit" : "Add"} Review
                </Button>
              </VStack>
            </Box>
          )}
        </>
      ) : (
        <Container maxW={"3xl"}>
          <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
            <Heading fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
              Please login <br />
              <Text as={"span"} color={"teal.400"}>
                to leave your review
              </Text>
            </Heading>
            <Stack direction={"column"} spacing={3} align={"center"} alignSelf={"center"} position={"relative"}>
              <Button
                colorScheme={"teal"}
                bg={"teal.400"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "teal.500",
                }}
                as={Link}
                to={"/login"}
              >
                Login Here
              </Button>
            </Stack>
          </Stack>
        </Container>
      )}
    </div>
  );
};

export default AddReview;
