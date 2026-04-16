import { useState } from 'react';
import { BsKey, BsTrash, BsPencil, BsPlus } from 'react-icons/bs';
import {
  usePasskeySupport,
  usePasskeys,
  usePasskeyRegistration,
  useDeletePasskey,
  useRenamePasskey,
} from '@/features/auth/hooks/usePasskey';
import styles from './PasskeySettings.module.css';

export default function PasskeySettings() {
  const isSupported = usePasskeySupport();
  const { passkeys, isLoading } = usePasskeys();
  const { register, isRegistering } = usePasskeyRegistration();
  const { deletePasskey, isDeleting } = useDeletePasskey();
  const { renamePasskey, isRenaming } = useRenamePasskey();

  const [newPasskeyName, setNewPasskeyName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddPasskey = async () => {
    const name = newPasskeyName.trim() || `Passkey ${passkeys.length + 1}`;
    const result = await register(name);
    if (result.success) {
      setNewPasskeyName('');
    }
  };

  const handleRename = async (credentialId: string) => {
    if (editName.trim()) {
      await renamePasskey(credentialId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>
          <BsKey className={styles.icon} />
          Passkeys
        </h3>
        <p className={styles.unsupported}>
          Your browser or device doesn't support passkeys. Try using a modern
          browser like Chrome, Safari, or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <BsKey className={styles.icon} />
        Passkeys
      </h3>
      <p className={styles.description}>
        Passkeys let you sign in securely without a password using your device's
        biometrics or security key.
      </p>

      <div className={styles.addSection}>
        <input
          type="text"
          placeholder="Passkey name (optional)"
          value={newPasskeyName}
          onChange={e => setNewPasskeyName(e.target.value)}
          className={styles.input}
          disabled={isRegistering}
        />
        <button
          onClick={handleAddPasskey}
          disabled={isRegistering}
          className={styles.addButton}
        >
          <BsPlus />
          {isRegistering ? 'Adding...' : 'Add Passkey'}
        </button>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <p className={styles.loading}>Loading passkeys...</p>
        ) : passkeys.length === 0 ? (
          <p className={styles.empty}>
            No passkeys registered yet. Add one to enable passwordless sign-in.
          </p>
        ) : (
          passkeys.map(passkey => (
            <div key={passkey.id} className={styles.passkeyItem}>
              <div className={styles.passkeyInfo}>
                <BsKey className={styles.passkeyIcon} />
                {editingId === passkey.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className={styles.editInput}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRename(passkey.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                ) : (
                  <div className={styles.passkeyDetails}>
                    <span className={styles.passkeyName}>{passkey.name}</span>
                    <span className={styles.passkeyDate}>
                      Added {new Date(passkey.createdAt).toLocaleDateString()}
                      {passkey.lastUsedAt && (
                        <>
                          {' '}
                          · Last used{' '}
                          {new Date(passkey.lastUsedAt).toLocaleDateString()}
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.passkeyActions}>
                {editingId === passkey.id ? (
                  <button
                    onClick={() => handleRename(passkey.id)}
                    disabled={isRenaming}
                    className={styles.saveButton}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(passkey.id);
                      setEditName(passkey.name);
                    }}
                    className={styles.iconButton}
                    title="Rename passkey"
                  >
                    <BsPencil />
                  </button>
                )}
                <button
                  onClick={() => deletePasskey(passkey.id)}
                  disabled={isDeleting}
                  className={`${styles.iconButton} ${styles.deleteButton}`}
                  title="Delete passkey"
                >
                  <BsTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
