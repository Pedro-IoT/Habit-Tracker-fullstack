import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';
import { toast } from 'react-toastify';
import {
  getRegistrationOptions,
  verifyRegistration,
  getAuthenticationOptions,
  verifyAuthentication,
  listPasskeys,
  deletePasskey,
  renamePasskey,
} from '../api/passkeyService';
import type { PasskeyError, PasskeyErrorInfo } from '../types/passkey.types';

export function usePasskeySupport(): boolean {
  return browserSupportsWebAuthn();
}

function parsePasskeyError(error: unknown): PasskeyErrorInfo {
  if (error instanceof Error) {
    const name = error.name;

    if (name === 'NotAllowedError') {
      return {
        type: 'CANCELLED_BY_USER',
        message: 'Authentication was cancelled. Please try again.',
        originalError: error,
      };
    }

    if (name === 'InvalidStateError') {
      return {
        type: 'INVALID_STATE',
        message: 'This passkey is already registered on this account.',
        originalError: error,
      };
    }

    if (name === 'NotSupportedError') {
      return {
        type: 'NOT_SUPPORTED',
        message: 'Passkeys are not supported on this device or browser.',
        originalError: error,
      };
    }

    if (name === 'AbortError' || error.message.includes('timeout')) {
      return {
        type: 'TIMEOUT',
        message: 'The request timed out. Please try again.',
        originalError: error,
      };
    }
  }

  return {
    type: 'UNKNOWN',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error instanceof Error ? error : undefined,
  };
}

export function usePasskeyRegistration() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['passkey', 'register'],
    mutationFn: async (credentialName?: string) => {
      const { options } = await getRegistrationOptions();
      const credential = await startRegistration({ optionsJSON: options });
      const result = await verifyRegistration({
        credential,
        credentialName,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passkeys'] });
    },
  });

  const register = async (credentialName?: string) => {
    try {
      await toast.promise(mutation.mutateAsync(credentialName), {
        pending: 'Setting up passkey...',
        success: 'Passkey registered successfully!',
        error: {
          render({ data }) {
            const errorInfo = parsePasskeyError(data);
            return errorInfo.message;
          },
        },
      });
      return { success: true as const };
    } catch (error) {
      const errorInfo = parsePasskeyError(error);
      return { success: false as const, error: errorInfo };
    }
  };

  return {
    register,
    isRegistering: mutation.isPending,
    error: mutation.error ? parsePasskeyError(mutation.error) : null,
  };
}

export function usePasskeyAuthentication() {
  const mutation = useMutation({
    mutationKey: ['passkey', 'authenticate'],
    mutationFn: async (email?: string) => {
      const { options } = await getAuthenticationOptions(email);
      const credential = await startAuthentication({ optionsJSON: options });
      const result = await verifyAuthentication({ credential });
      return result;
    },
  });

  const authenticate = async (email?: string) => {
    try {
      const result = await mutation.mutateAsync(email);
      return { success: true as const, user: result.user };
    } catch (error) {
      const errorInfo = parsePasskeyError(error);
      return { success: false as const, error: errorInfo };
    }
  };

  return {
    authenticate,
    isAuthenticating: mutation.isPending,
    error: mutation.error ? parsePasskeyError(mutation.error) : null,
  };
}

export function usePasskeys() {
  const query = useQuery({
    queryKey: ['passkeys'],
    queryFn: listPasskeys,
  });

  return {
    passkeys: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useDeletePasskey() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['passkey', 'delete'],
    mutationFn: deletePasskey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passkeys'] });
    },
  });

  const handleDelete = async (credentialId: string) => {
    await toast.promise(mutation.mutateAsync(credentialId), {
      pending: 'Removing passkey...',
      success: 'Passkey removed successfully!',
      error: 'Failed to remove passkey',
    });
  };

  return {
    deletePasskey: handleDelete,
    isDeleting: mutation.isPending,
  };
}

export function useRenamePasskey() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['passkey', 'rename'],
    mutationFn: ({
      credentialId,
      name,
    }: {
      credentialId: string;
      name: string;
    }) => renamePasskey(credentialId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passkeys'] });
    },
  });

  return {
    renamePasskey: (credentialId: string, name: string) =>
      mutation.mutateAsync({ credentialId, name }),
    isRenaming: mutation.isPending,
  };
}
