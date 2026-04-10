package com.example.dao;

import com.example.model.Course;
import com.example.util.DBUtil;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CourseDAO {

    public List<Course> getAllCourses() {
        List<Course> courses = new ArrayList<>();
        String sql = "SELECT * FROM courses";
        try (Connection conn = DBUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                courses.add(new Course(rs.getInt("course_id"), rs.getString("course_name"), rs.getString("description"), rs.getString("category"), rs.getString("instructor"), rs.getString("prerequisites"), rs.getInt("max_capacity"), rs.getInt("current_enrollment"), rs.getString("schedule"), rs.getTimestamp("created_at")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return courses;
    }

    public Course getCourseById(int courseId) {
        String sql = "SELECT * FROM courses WHERE course_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, courseId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Course(rs.getInt("course_id"), rs.getString("course_name"), rs.getString("description"), rs.getString("category"), rs.getString("instructor"), rs.getString("prerequisites"), rs.getInt("max_capacity"), rs.getInt("current_enrollment"), rs.getString("schedule"), rs.getTimestamp("created_at"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Add save, update, delete methods as needed
}