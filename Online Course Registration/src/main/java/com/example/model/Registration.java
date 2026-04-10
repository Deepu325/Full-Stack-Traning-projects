package com.example.model;

import java.sql.Timestamp;

public class Registration {
    private int registrationId;
    private int userId;
    private int courseId;
    private Timestamp registrationDate;
    private String status;

    public Registration() {}

    public Registration(int registrationId, int userId, int courseId, Timestamp registrationDate, String status) {
        this.registrationId = registrationId;
        this.userId = userId;
        this.courseId = courseId;
        this.registrationDate = registrationDate;
        this.status = status;
    }

    // Getters and setters
    public int getRegistrationId() { return registrationId; }
    public void setRegistrationId(int registrationId) { this.registrationId = registrationId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }
    public Timestamp getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(Timestamp registrationDate) { this.registrationDate = registrationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}