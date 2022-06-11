import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import AddReview from "./components/AddReview";
import Login from "./components/Login";
import Rental from "./components/Rental";
import RentalList from "./components/RentalList";

import { Box, Flex, HStack, Link as CLink, IconButton, Button, useDisclosure, useColorModeValue, Stack } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mobileColor = useColorModeValue("gray.200", "gray.700");

  const [user, setUser] = useState(null);
  const logout = async () => {
    setUser(null);
  };
  const login = async (user = null) => {
    setUser(user);
  };

  return (
    <div className="App">
      <>
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton size={"md"} icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} aria-label={"Open Menu"} display={{ md: "none" }} onClick={isOpen ? onClose : onOpen} />{" "}
            <HStack spacing={8} alignItems={"center"}>
              <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                <CLink
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                  }}
                  as={Link}
                  to={"/rentals"}
                >
                  Rental Reviews
                </CLink>
                <CLink
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: useColorModeValue("gray.200", "gray.700"),
                  }}
                  as={Link}
                  to={"/rentals"}
                >
                  Rentals
                  {/* <Link to={"/rentals"}>Rentals</Link> */}
                </CLink>
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              {user ? (
                <Button
                  display={{ base: "none", md: "inline-flex" }}
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"white"}
                  bg={"gray.700"}
                  onClick={logout}
                  _hover={{
                    bg: "gray.500",
                  }}
                >
                  Logout {user.name}
                </Button>
              ) : (
                <Button
                  display={{ base: "none", md: "inline-flex" }}
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"gray.700"}
                  bg={"white"}
                  _hover={{
                    bg: "gray.200",
                  }}
                  as={Link}
                  to={"/login"}
                >
                  Login
                  {/* <Link to={"/login"}>Login</Link> */}
                </Button>
              )}
            </Flex>
          </Flex>
        </Box>

        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <CLink
                px={2}
                py={3}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: mobileColor,
                }}
                as={Link}
                to={"/rentals"}
              >
                Rentals
              </CLink>
              <CLink
                px={2}
                py={3}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: mobileColor,
                }}
                as={Link}
                to={user ? null : "/login"}
                onClick={user ? logout : null}
              >
                {!user ? "Login" : "Logout"}
              </CLink>
            </Stack>
          </Box>
        )}

        <Box p={4}>
          <Routes>
            <Route exact path={"/"} element={<RentalList />} />
            <Route exact path={"/rentals"} element={<RentalList />} />
            <Route path="/rental/:id/review" element={<AddReview user={user} />} />
            <Route path="/rental/:id" element={<Rental user={user} />} />
            <Route path="/login" element={<Login login={login} />} />
          </Routes>
        </Box>
      </>
    </div>
  );
}

export default App;
