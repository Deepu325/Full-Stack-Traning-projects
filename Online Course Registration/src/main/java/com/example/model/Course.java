package com.example.model;

import java.sql.Timestamp;

public class Course {
    private int courseId;
    private String courseName;
    private String description;
    private String category;
    private String instructor;
    private String prerequisites;
    private int maxCapacity;
    private int currentEnrollment;
    private String schedule;
    private Timestamp createdAt;

    public Course() {}

    public Course(int courseId, String courseName, String description, String category, String instructor, String prerequisites, int maxCapacity, int currentEnrollment, String schedule, Timestamp createdAt) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.description = description;
        this.category = category;
        this.instructor = instructor;
        this.prerequisites = prerequisites;
        this.maxCapacity = maxCapacity;
        this.currentEnrollment = currentEnrollment;
        this.schedule = schedule;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }
    public int getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(int maxCapacity) { this.maxCapacity = maxCapacity; }
    public int getCurrentEnrollment() { return currentEnrollment; }
    public void setCurrentEnrollment(int currentEnrollment) { this.currentEnrollment = currentEnrollment; }
    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}