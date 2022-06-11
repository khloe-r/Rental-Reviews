import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Link, Button, Heading, Text, useColorModeValue } from "@chakra-ui/react";

const Login = (props) => {
  let navigate = useNavigate();

  const [userID, setUserID] = useState("");
  const [name, setName] = useState("");

  const login = () => {
    console.log({ name: name, id: userID });
    props.login({ name: name, id: userID });
    navigate("/");
  };

  const onChangeID = (e) => {
    const userID = e.target.value;
    setUserID(userID);
  };
  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  return (
    <Flex>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to share your opinion with the world!
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormLabel>Name</FormLabel>
            <Input type="text" value={name} onChange={onChangeName} />
            <FormLabel>User ID</FormLabel>
            <Input type="text" value={userID} onChange={onChangeID} />
            <Stack spacing={10}>
              <Button
                bg={"teal.500"}
                color={"white"}
                _hover={{
                  bg: "teal.700",
                }}
                onClick={login}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
