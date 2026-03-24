/**
 * userService — maps 1:1 to UserController (/api/users)
 */
import { api } from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/common';
import type {
  User,
  CreateUserRequest,
  UpdateUserProfileRequest,
  AddressRequest,
  AddressResponse,
} from '../types/user';

/** GET /api/users?page=0&size=5 */
export async function getUsers(
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<User>>> {
  const res = await api.get<ApiResponse<PageResponse<User>>>('/users', { params: { page, size } });
  return res.data;
}

/** GET /api/users/{id} */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  const res = await api.get<ApiResponse<User>>(`/users/${id}`);
  return res.data;
}

/** POST /api/users */
export async function createUser(request: CreateUserRequest): Promise<ApiResponse<User>> {
  const res = await api.post<ApiResponse<User>>('/users', request);
  return res.data;
}

/** DELETE /api/users/{id} */
export async function deleteUser(id: string): Promise<ApiResponse<boolean>> {
  const res = await api.delete<ApiResponse<boolean>>(`/users/${id}`);
  return res.data;
}

/** PATCH /api/users/profile */
export async function updateProfile(
  request: UpdateUserProfileRequest,
): Promise<ApiResponse<User>> {
  const res = await api.patch<ApiResponse<User>>('/users/profile', request);
  return res.data;
}

// ── Address endpoints ──────────────────────────────────────────────────────

/** POST /api/users/{userId}/addresses */
export async function addAddress(
  userId: string,
  request: AddressRequest,
): Promise<ApiResponse<AddressResponse>> {
  const res = await api.post<ApiResponse<AddressResponse>>(
    `/users/${userId}/addresses`,
    request,
  );
  return res.data;
}

/** GET /api/users/{userId}/addresses */
export async function getUserAddresses(userId: string): Promise<ApiResponse<AddressResponse[]>> {
  const res = await api.get<ApiResponse<AddressResponse[]>>(`/users/${userId}/addresses`);
  return res.data;
}

/** GET /api/users/{userId}/addresses/{addressId} */
export async function getAddressById(
  userId: string,
  addressId: string,
): Promise<ApiResponse<AddressResponse>> {
  const res = await api.get<ApiResponse<AddressResponse>>(
    `/users/${userId}/addresses/${addressId}`,
  );
  return res.data;
}

/** PATCH /api/users/{userId}/addresses/{addressId} */
export async function updateAddress(
  userId: string,
  addressId: string,
  request: AddressRequest,
): Promise<ApiResponse<AddressResponse>> {
  const res = await api.patch<ApiResponse<AddressResponse>>(
    `/users/${userId}/addresses/${addressId}`,
    request,
  );
  return res.data;
}

/** DELETE /api/users/{userId}/addresses/{addressId} */
export async function deleteAddress(
  userId: string,
  addressId: string,
): Promise<ApiResponse<void>> {
  const res = await api.delete<ApiResponse<void>>(
    `/users/${userId}/addresses/${addressId}`,
  );
  return res.data;
}

/** PATCH /api/users/{userId}/addresses/{addressId}/set-default */
export async function setDefaultAddress(
  userId: string,
  addressId: string,
): Promise<ApiResponse<AddressResponse>> {
  const res = await api.patch<ApiResponse<AddressResponse>>(
    `/users/${userId}/addresses/${addressId}/set-default`,
  );
  return res.data;
}
