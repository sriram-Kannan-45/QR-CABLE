package com.waveinit.backend.repository;

import com.waveinit.backend.model.Cable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CableRepository extends JpaRepository<Cable, Integer> {
}