package com.habit_tracker_V2.demo.Services;

import com.habit_tracker_V2.demo.Entities.User;
import com.habit_tracker_V2.demo.Entities.UserPasskey;
import com.habit_tracker_V2.demo.Repository.UserPasskeyRepository;
import com.habit_tracker_V2.demo.Repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WebAuthnCredentialService implements UserCredentialRepository {

    private final UserPasskeyRepository userPasskeyRepository;
    private final UserRepository userRepository;

    public WebAuthnCredentialService(UserPasskeyRepository userPasskeyRepository, UserRepository userRepository) {
        this.userPasskeyRepository = userPasskeyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CredentialRecord findByCredentialId(Bytes credentialId) {
        Optional<UserPasskey> passkeyOpt = userPasskeyRepository.findByCredentialId(credentialId.getBytes());

        if (passkeyOpt.isEmpty()) {
            return null;
        }

        UserPasskey passkey = passkeyOpt.get();

        return ImmutableCredentialRecord.builder()
                .credentialId(new Bytes(passkey.getCredentialId()))
                .userEntityUserId(new Bytes(passkey.getUser().getId().toString().getBytes()))
                .publicKey(new ImmutablePublicKeyCose(passkey.getPublicKeyCose()))
                .signatureCount(passkey.getSignatureCount())
                .uvInitialized(passkey.isUvInitialized())
                .transports(Set.of())
                .credentialType(PublicKeyCredentialType.PUBLIC_KEY)
                .build();
    }

    @Override
    public void save(CredentialRecord credentialRecord) {
        String userIdString = new String(credentialRecord.getUserEntityUserId().getBytes());
        UUID userId = UUID.fromString(userIdString);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found during passkey registration"));

        UserPasskey passkey = new UserPasskey();
        passkey.setCredentialId(credentialRecord.getCredentialId().getBytes());
        passkey.setPublicKeyCose(credentialRecord.getPublicKey().getBytes());
        passkey.setSignatureCount(credentialRecord.getSignatureCount());
        passkey.setUvInitialized(credentialRecord.isUvInitialized());
        passkey.setUser(user);

        userPasskeyRepository.save(passkey);
    }

    @Override
    public void delete(Bytes credentialId) {
        userPasskeyRepository.findByCredentialId(credentialId.getBytes())
                .ifPresent(userPasskeyRepository::delete);
    }

    @Override
    public @NonNull List<CredentialRecord> findByUserId(Bytes userId) {
        String userIdString = new String(userId.getBytes());
        UUID uuid = UUID.fromString(userIdString);

        List<UserPasskey> passkeys = userPasskeyRepository.findAllByUser_Id(uuid);

        return passkeys.stream()
                .map(passkey -> (CredentialRecord) ImmutableCredentialRecord.builder()
                        .credentialId(new Bytes(passkey.getCredentialId()))
                        .userEntityUserId(new Bytes(passkey.getUser().getId().toString().getBytes()))
                        .publicKey(new ImmutablePublicKeyCose(passkey.getPublicKeyCose()))
                        .signatureCount(passkey.getSignatureCount())
                        .uvInitialized(passkey.isUvInitialized())
                        .transports(Set.of())
                        .credentialType(PublicKeyCredentialType.PUBLIC_KEY)
                        .build())
                .collect(Collectors.toList());
    }
}