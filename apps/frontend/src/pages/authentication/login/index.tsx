import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import { useAuthContext } from "../../../context/AuthProvider";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../../context/AuthProvider/cognito";
import {
  ADMIN_GROUPS,
  AUTH_RESPONSE_TYPES,
  AUTH_USER_TOKEN_KEY,
} from "../../../utils/constants";
import jwtDecode from "jwt-decode";
import { BiShow, BiHide } from "react-icons/bi";
import colors from "../../../theme/colors";
import { useState } from "react";
import Lottie from "lottie-react";
import infoScan from "../../../assets/animations/info-scan.json";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("A Valid Email is Required!")
    .required("Please enter your email address"),
  password: Yup.string().required("Please enter your password"),
});

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();
  const {
    setIsAuthenticated,
    setIsAuthenticating,
    isAuthenticating,
    setAuthResponseType,
    setCognitoUser,
    cognitoUser,
    setUserProfile,
  } = useAuthContext();

  const handleLogin = async (email: string, password: string) => {
    setIsAuthenticating(true);
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    if (cognitoUser) {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (res) => {
          if (res.isValid()) {
            localStorage.setItem(
              AUTH_USER_TOKEN_KEY,
              res.getIdToken().getJwtToken()
            );
            // get user profile from token and set auth contexts
            const userData = jwtDecode(res.getIdToken()?.getJwtToken()) as any;
            if (
              userData &&
              userData["cognito:groups"] &&
              Object.values(ADMIN_GROUPS).some((group) =>
                userData["cognito:groups"].includes(group)
              )
            ) {
              setUserProfile({
                email: userData.email,
                phone_number: userData.phone_number,
                sub: userData.sub,
                groups: userData["cognito:groups"],
              });
              toast({
                title: "Successful Authentication",
                status: "success",
              });
              setIsAuthenticating(false);
              setIsAuthenticated(true);
              navigate("/dashboard");
            } else {
              toast({
                title: "Access Denied",
                description: "Invalid User Group",
                status: "error",
              });
              setIsAuthenticating(false);
              setIsAuthenticated(true);
              navigate("/logout");
            }
          }
        },
        onFailure: (res) => {
          setIsAuthenticating(false);
          toast({
            title: res.message,
            status: "error",
          });
          setIsAuthenticating(false);
          setIsAuthenticated(false);
        },
        newPasswordRequired: () => {
          setIsAuthenticating(false);
          setAuthResponseType(AUTH_RESPONSE_TYPES.NEW_PASSWORD_REQUIRED);
          navigate("/password/reset");
        },
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      minW={"100vw"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Lottie animationData={infoScan} loop={false} />
          <Heading lineHeight={1.1} fontSize={"5xl"}>
            Q-ER
          </Heading>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values) => handleLogin(values.email, values.password)}
              validationSchema={LoginSchema}
            >
              {({ handleSubmit, errors, touched, setFieldValue }) => (
                <>
                  <FormControl id="email" isInvalid={!!errors.email}>
                    <FormLabel>Email address</FormLabel>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("email", e.target.value);
                        setCognitoUser(
                          new CognitoUser({
                            Username: e.target.value,
                            Pool: userPool,
                          })
                        );
                      }}
                    />
                    {errors.email && touched.email ? (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl id="password" isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Field
                        as={Input}
                        type={show ? "text" : "password"}
                        name="password"
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? <BiShow /> : <BiHide />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {errors.password && touched.password ? (
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"space-between"}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Link color={colors.primary.blue} href="/password/reset">
                        Forgot password?
                      </Link>
                    </Stack>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"center"}
                      justify={"center"}
                    >
                      <Text>
                        Don't have an account yet?{" "}
                        <Link color={colors.primary.blue} href="/signup">
                          Sign Up
                        </Link>
                      </Text>
                    </Stack>
                    <Button
                      variant="solid"
                      onClick={() => handleSubmit()}
                      isLoading={isAuthenticating}
                    >
                      Sign in
                    </Button>
                  </Stack>
                </>
              )}
            </Formik>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
