import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/browser';

// Re-export for convenience
export type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
};

// Registration types
export interface RegistrationOptionsResponse {
  options: PublicKeyCredentialCreationOptionsJSON;
}

export interface RegistrationVerifyRequest {
  credential: RegistrationResponseJSON;
  credentialName?: string | undefined;
}

export interface RegistrationVerifyResponse {
  verified: boolean;
  credentialId: string;
}

// Authentication types
export interface AuthenticationOptionsResponse {
  options: PublicKeyCredentialRequestOptionsJSON;
}

export interface AuthenticationVerifyRequest {
  credential: AuthenticationResponseJSON;
}

export interface AuthenticationVerifyResponse {
  verified: boolean;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// Credential management types
export interface PasskeyCredential {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
}

// Error types
export type PasskeyError =
  | 'NOT_SUPPORTED'
  | 'CANCELLED_BY_USER'
  | 'INVALID_STATE'
  | 'TIMEOUT'
  | 'UNKNOWN';

export interface PasskeyErrorInfo {
  type: PasskeyError;
  message: string;
  originalError?: Error | undefined;
}
