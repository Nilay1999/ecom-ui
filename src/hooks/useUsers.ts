import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserById,
  createUser,
  updateProfile,
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../api/userService';
import type { CreateUserRequest, UpdateUserProfileRequest, AddressRequest } from '../types/user';

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateUserRequest) => createUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateUserProfileRequest) => updateProfile(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users', data.data.userId] });
    },
  });
}

export function useUserAddresses(userId: string | undefined) {
  return useQuery({
    queryKey: ['users', userId, 'addresses'],
    queryFn: () => getUserAddresses(userId!),
    enabled: !!userId,
  });
}

export function useAddAddress(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddressRequest) => addAddress(userId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'addresses'] });
    },
  });
}

export function useUpdateAddress(userId: string, addressId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddressRequest) => updateAddress(userId, addressId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'addresses'] });
    },
  });
}

export function useDeleteAddress(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(userId, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'addresses'] });
    },
  });
}

export function useSetDefaultAddress(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => setDefaultAddress(userId, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'addresses'] });
    },
  });
}
