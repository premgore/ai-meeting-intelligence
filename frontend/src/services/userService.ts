import api from "../lib/api";
import { UserResponse } from "../types";

export const userService = {
  async getAllUsers(): Promise<UserResponse[]> {
    const response = await api.get<UserResponse[]>("/users/");
    return response.data;
  },

  async getUserById(id: number): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },
};

export default userService;
