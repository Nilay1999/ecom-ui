/** Mirrors Gender enum */
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

/** Mirrors AddressResponseDto */
export interface AddressResponse {
  addressId: string;
  addressLine1: string;
  addressLine2: string | null;
  addressLine3: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

/** Mirrors User entity */
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string | null;
  username: string;
  age: number;
  gender: Gender | null;
  addresses: AddressResponse[];
  createdAt: string;
  updatedAt: string;
}

/** Mirrors CreateUserRequestDto */
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName?: string;
  username: string;
  age?: number;
  gender?: Gender;
}

/** Mirrors UpdateUserProfileDto */
export interface UpdateUserProfileRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: Gender;
}

/** Mirrors AddressRequestDto */
export interface AddressRequest {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault?: boolean;
}
