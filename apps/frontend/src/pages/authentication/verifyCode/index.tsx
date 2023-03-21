import { useState } from "react";
import {
  FormControl,
  useColorModeValue,
  HStack,
  PinInput,
  PinInputField,
  Center,
  Heading,
  Flex,
  Stack,
  Box,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useAuthContext } from "../../../context/AuthProvider";
import Lottie from "lottie-react";
import email from "../../../assets/animations/email.json";
import { userPool } from "../../../context/AuthProvider/cognito";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router";

const VerifyCode = () => {
  const { userProfile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const verifyCode = (code: string) => {
    const userData = {
      Username: userProfile.email,
      Pool: userPool,
    };
    const newCognitoUser = new CognitoUser(userData);
    setLoading(true);
    newCognitoUser.confirmRegistration(code, true, (err, res) => {
      setLoading(false);
      if (err) {
        console.log({ err });
        toast({
          title: "Error Verififying",
          description: err.message,
          status: "error",
        });
      } else {
        toast({
          title: "Email successfully verified!",
          status: "success",
        });
        navigate("Login");
      }
    });
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      minW={"100vw"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} minW={"xl"} py={12} px={6}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={10}
        >
          <Center>
            <Box width={"20%"}>
              <Lottie animationData={email} width={"50px"} height={"50px"} />
            </Box>
          </Center>
          <Center>
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              Verify your Email
            </Heading>
          </Center>
          <Center
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
            mt={2}
          >
            We have sent a code to your email
          </Center>
          <Center
            fontSize={{ base: "sm", sm: "md" }}
            fontWeight="bold"
            color={useColorModeValue("gray.800", "gray.400")}
            mt={2}
          >
            {userProfile.email}
          </Center>
          <Center mt={5}>
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "1xl" }}>
              Enter verification code
            </Heading>
          </Center>
          <FormControl>
            <Center mt={5}>
              <HStack>
                {loading ? (
                  <Spinner />
                ) : (
                  <PinInput
                    otp
                    onComplete={(value: string) => verifyCode(value)}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                )}
              </HStack>
            </Center>
          </FormControl>
        </Box>
      </Stack>
    </Flex>
  );
};

export default VerifyCode;
