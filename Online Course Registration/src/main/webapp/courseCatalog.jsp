<%@ page import="java.util.List, com.example.model.Course" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Course Catalog - Online Course Registration</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h1>Course Catalog</h1>
        <%
            List<Course> courses = (List<Course>) request.getAttribute("courses");
            if (courses != null) {
                for (Course course : courses) {
        %>
        <div class="course">
            <h2><%= course.getCourseName() %></h2>
            <p><%= course.getDescription() %></p>
            <p>Instructor: <%= course.getInstructor() %></p>
            <p>Schedule: <%= course.getSchedule() %></p>
            <p>Enrolled: <%= course.getCurrentEnrollment() %> / <%= course.getMaxCapacity() %></p>
            <form action="register" method="post">
                <input type="hidden" name="courseId" value="<%= course.getCourseId() %>">
                <button type="submit">Register</button>
            </form>
        </div>
        <%
                }
            }
        %>
        <a href="studentDashboard.html">Back to Dashboard</a>
    </div>
</body>
</html>