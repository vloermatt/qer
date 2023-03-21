export type RouteDetail = {
  path: string;
  element: JSX.Element;
  label: string;
  icon?: JSX.Element;
  allowedGroups?: string[];
};

// cognito
export type UserProfile = {
  sub: string;
  email: string;
  phone_number: string;
  groups: string[];
};
