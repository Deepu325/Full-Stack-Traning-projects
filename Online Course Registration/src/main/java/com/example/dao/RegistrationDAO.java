package com.example.dao;

import com.example.model.Registration;
import com.example.model.Course;
import com.example.util.DBUtil;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RegistrationDAO {

    public boolean registerUserForCourse(int userId, int courseId) {
        CourseDAO courseDAO = new CourseDAO();
        Course course = courseDAO.getCourseById(courseId);
        if (course == null || course.getCurrentEnrollment() >= course.getMaxCapacity()) {
            return false;
        }
        String sql = "INSERT INTO registrations (user_id, course_id) VALUES (?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, courseId);
            int rows = stmt.executeUpdate();
            if (rows > 0) {
                updateEnrollment(courseId, course.getCurrentEnrollment() + 1);
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private void updateEnrollment(int courseId, int newEnrollment) {
        String sql = "UPDATE courses SET current_enrollment = ? WHERE course_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, newEnrollment);
            stmt.setInt(2, courseId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Registration> getRegistrationsByUser(int userId) {
        List<Registration> registrations = new ArrayList<>();
        String sql = "SELECT * FROM registrations WHERE user_id = ? AND status = 'active'";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                registrations.add(new Registration(rs.getInt("registration_id"), rs.getInt("user_id"), rs.getInt("course_id"), rs.getTimestamp("registration_date"), rs.getString("status")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return registrations;
    }

    public boolean cancelRegistration(int registrationId) {
        // Get courseId to decrease enrollment
        String getSql = "SELECT course_id FROM registrations WHERE registration_id = ?";
        String updateSql = "UPDATE registrations SET status = 'cancelled' WHERE registration_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement getStmt = conn.prepareStatement(getSql);
             PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
            getStmt.setInt(1, registrationId);
            ResultSet rs = getStmt.executeQuery();
            if (rs.next()) {
                int courseId = rs.getInt("course_id");
                updateStmt.setInt(1, registrationId);
                int rows = updateStmt.executeUpdate();
                if (rows > 0) {
                    CourseDAO courseDAO = new CourseDAO();
                    Course course = courseDAO.getCourseById(courseId);
                    if (course != null) {
                        updateEnrollment(courseId, course.getCurrentEnrollment() - 1);
                    }
                    return true;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}