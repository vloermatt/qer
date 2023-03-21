export const AUTH_USER_TOKEN_KEY = "QER.TokenKey";

export const AUTH_RESPONSE_TYPES = {
  NEW_PASSWORD_REQUIRED: "NEW_PASSWORD_REQUIRED",
  OTP_REQUIRED: "OTP_REQUIRED",
};

// cognito user groups
export const USER_GROUPS = {
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  USER: "User",
};

// admin groups
export const ADMIN_GROUPS = [USER_GROUPS.ADMIN, USER_GROUPS.SUPER_ADMIN];

// country codes
export const COUNTRY_CODES_MOBILE: {
  country: string;
  code: string;
}[] = [
  {
    country: "RSA",
    code: "+27",
  },
];
