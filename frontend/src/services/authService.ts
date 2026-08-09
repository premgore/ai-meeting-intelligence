import api from "../lib/api";
import { TokenResponse, UserResponse } from "../types";

export const authService = {
  async loginUser(email: string, password: string): Promise<TokenResponse> {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response = await api.post<TokenResponse>("/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  async registerUser(name: string, email: string, password: string): Promise<UserResponse> {
    const response = await api.post<UserResponse>("/users/", {
      name,
      email,
      password,
    });
    return response.data;
  },
};

export default authService;
