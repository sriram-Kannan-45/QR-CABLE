// package com.waveinit.backend.controller;

// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api")
// @CrossOrigin
// public class AuthController {
//     @GetMapping("/login")
//     public String loginTest(){
//         return "Login API working";
//     }
//     @PostMapping("/login")
//     public String login(@RequestBody LoginRequest req) {

//         if ("kannan".equals(req.getUsername()) && "sri".equals(req.getPassword())) {
//             return "Login Success";
//         }

//         return "Invalid Login";
//     }
// }

// class LoginRequest {
//     private String username;
//     private String password;

//     public String getUsername() { return username; }
//     public String getPassword() { return password; }

//     public void setUsername(String username) { this.username = username; }
//     public void setPassword(String password) { this.password = password; }
// }