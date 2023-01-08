import axios from "axios";

interface RegistrationData {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  remember: boolean;
}

interface LoginData {
  emailOrPhone: string;
  password: string;
  remember: boolean;
}

export const register = (data: RegistrationData) =>
  axios.post(`/api/user/register`, data);
export const login = (data: LoginData) => axios.post(`/api/user/login`, data);
export const ping = () => axios.get(`/api/protected`);
export const logout = () => axios.post(`/api/user/logout`, {});
