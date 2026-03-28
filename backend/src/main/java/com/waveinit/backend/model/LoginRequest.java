package com.waveinit.backend.model;

public class LoginRequest {
    private String userId;
    private String password;
    private String loginType; // "admin" or "customer"

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getLoginType() { return loginType; }
    public void setLoginType(String loginType) { this.loginType = loginType; }
}
