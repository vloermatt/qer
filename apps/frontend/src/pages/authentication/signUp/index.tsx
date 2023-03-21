import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
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
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "../../../context/AuthProvider/cognito";
import { BiShow, BiHide } from "react-icons/bi";
import colors from "../../../theme/colors";
import { useState } from "react";
import Lottie from "lottie-react";
import infoScan from "../../../assets/animations/info-scan.json";
import { useNavigate, useNavigation } from "react-router";

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required("Please enter your last name"),
  email: Yup.string()
    .email("A Valid Email is Required!")
    .required("Please enter your email address"),
  phoneNumber: Yup.string().required("Please enter your phone number"),
  password: Yup.string().required("Please enter your password"),
});

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUserProfile } = useAuthContext();

  const handleSignup = (data: SignUpFormValues) => {
    console.log({ data });
    setLoading(true);
    // create cognito attributes from form data
    const emailAtt = new CognitoUserAttribute({
      Name: "email",
      Value: data.email,
    });
    const phoneNumberAtt = new CognitoUserAttribute({
      Name: "phone_number",
      Value: data.phoneNumber,
    });
    const firstNameAtt = new CognitoUserAttribute({
      Name: "name",
      Value: data.firstName,
    });
    const lastNameAtt = new CognitoUserAttribute({
      Name: "family_name",
      Value: data.lastName,
    });
    const attributeList = [emailAtt, phoneNumberAtt, firstNameAtt, lastNameAtt];
    userPool.signUp(
      data.email,
      data.password,
      attributeList,
      attributeList,
      (err, res) => {
        setLoading(false);
        if (err) {
          toast({
            title: "Error Signing Up",
            description: err.message,
            status: "error",
          });
        } else if (res?.user) {
          // set user context to use in verify code page
          setUserProfile({
            email: data.email,
            phone_number: data.phoneNumber,
            sub: "",
            groups: [],
          });
          toast({
            title: "Successfully signed up!",
            status: "success",
          });
          navigate("/verifyCode");
        }
      }
    );
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
        <Stack align={"center"}>
          <Lottie animationData={infoScan} loop={false} />
          <Heading lineHeight={1.1} fontSize={"5xl"}>
            Q-ER
          </Heading>
          <Heading fontSize={"4xl"}>Create your account</Heading>
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
                phoneNumber: "",
                firstName: "",
                lastName: "",
              }}
              onSubmit={(values) => handleSignup(values)}
              validationSchema={SignUpSchema}
            >
              {({ handleSubmit, errors, touched, setFieldValue }) => (
                <>
                  <FormControl id="firstName" isInvalid={!!errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Field
                      as={Input}
                      type="texxt"
                      name="firstName"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("firstName", e.target.value);
                      }}
                    />
                    {errors.firstName && touched.firstName ? (
                      <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl id="lastName" isInvalid={!!errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Field
                      as={Input}
                      type="text"
                      name="lastName"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("lastName", e.target.value);
                      }}
                    />
                    {errors.lastName && touched.lastName ? (
                      <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl id="email" isInvalid={!!errors.email}>
                    <FormLabel>Email address</FormLabel>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("email", e.target.value);
                      }}
                    />
                    {errors.email && touched.email ? (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl
                    id="phoneNumber"
                    isInvalid={!!errors.phoneNumber}
                  >
                    <FormLabel>Mobile Number</FormLabel>
                    <Field
                      as={Input}
                      type="text"
                      name="phoneNumber"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("phoneNumber", e.target.value);
                      }}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
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
                      align={"center"}
                      justify={"center"}
                    >
                      <Text>
                        Already have an account?{" "}
                        <Link color={colors.primary.blue} href="/signup">
                          Login
                        </Link>
                      </Text>
                    </Stack>
                    <Button
                      variant="solid"
                      onClick={() => handleSubmit()}
                      isLoading={loading}
                    >
                      Sign Up
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

export default SignUp;
