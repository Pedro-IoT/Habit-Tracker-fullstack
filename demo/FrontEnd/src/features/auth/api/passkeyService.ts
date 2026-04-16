import { apiFetch } from '@/lib/apiClient';
import type {
  RegistrationOptionsResponse,
  RegistrationVerifyRequest,
  RegistrationVerifyResponse,
  AuthenticationOptionsResponse,
  AuthenticationVerifyRequest,
  AuthenticationVerifyResponse,
  PasskeyCredential,
} from '../types/passkey.types';

// Registration (requires logged-in user)

export async function getRegistrationOptions(): Promise<RegistrationOptionsResponse> {
  return apiFetch<RegistrationOptionsResponse>('/webauthn/register/options', {
    method: 'GET',
  });
}

export async function verifyRegistration(
  data: RegistrationVerifyRequest
): Promise<RegistrationVerifyResponse> {
  return apiFetch<RegistrationVerifyResponse>('/webauthn/register/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Authentication (passwordless login)

export async function getAuthenticationOptions(
  email?: string
): Promise<AuthenticationOptionsResponse> {
  const params = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiFetch<AuthenticationOptionsResponse>(
    `/webauthn/authenticate/options${params}`,
    { method: 'GET' }
  );
}

export async function verifyAuthentication(
  data: AuthenticationVerifyRequest
): Promise<AuthenticationVerifyResponse> {
  return apiFetch<AuthenticationVerifyResponse>(
    '/webauthn/authenticate/verify',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// Credential management

export async function listPasskeys(): Promise<PasskeyCredential[]> {
  return apiFetch<PasskeyCredential[]>('/webauthn/credentials', {
    method: 'GET',
  });
}

export async function deletePasskey(credentialId: string): Promise<void> {
  return apiFetch<void>(
    `/webauthn/credentials/${encodeURIComponent(credentialId)}`,
    {
      method: 'DELETE',
    }
  );
}

export async function renamePasskey(
  credentialId: string,
  name: string
): Promise<void> {
  return apiFetch<void>(
    `/webauthn/credentials/${encodeURIComponent(credentialId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }
  );
}
