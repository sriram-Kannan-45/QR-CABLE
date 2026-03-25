package com.waveinit.backend.controller;

import com.waveinit.backend.model.Cable;
import com.waveinit.backend.repository.CableRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cable")
@CrossOrigin
public class CableController {

    private final CableRepository repo;

    public CableController(CableRepository repo) {
        this.repo = repo;
    }

    // ADD
    @PostMapping
    public Cable addCable(@RequestBody Cable cable) {
        return repo.save(cable);
    }

    // GET ALL
    @GetMapping
    public List<Cable> getAll() {
        return repo.findAll();
    }
}