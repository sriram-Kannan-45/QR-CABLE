package com.waveinit.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Backend Working Successfully 🚀";
    }

}