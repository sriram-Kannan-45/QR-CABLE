package com.waveinit.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cable")
public class Cable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String phone;
    private String stb;
    private double amount;

    // getters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getStb() { return stb; }
    public double getAmount() { return amount; }

    // setters
    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setStb(String stb) { this.stb = stb; }
    public void setAmount(double amount) { this.amount = amount; }
}