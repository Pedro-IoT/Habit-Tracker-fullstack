package com.habit_tracker_V2.demo.Repository;

import com.habit_tracker_V2.demo.Entities.UserPasskey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPasskeyRepository extends JpaRepository<UserPasskey, byte[]> {
    Optional<UserPasskey> findByCredentialId(byte[] credentialId);
    List<UserPasskey> findAllByUser_Id(UUID userId);
}
