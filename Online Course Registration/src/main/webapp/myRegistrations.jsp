<%@ page import="java.util.List, com.example.model.Registration, com.example.dao.CourseDAO, com.example.model.Course" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Registrations - Online Course Registration</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h1>My Registrations</h1>
        <%
            List<Registration> registrations = (List<Registration>) request.getAttribute("registrations");
            if (registrations != null) {
                CourseDAO courseDAO = new CourseDAO();
                for (Registration reg : registrations) {
                    Course course = courseDAO.getCourseById(reg.getCourseId());
                    if (course != null) {
        %>
        <div class="registration">
            <h2><%= course.getCourseName() %></h2>
            <p><%= course.getDescription() %></p>
            <p>Registered on: <%= reg.getRegistrationDate() %></p>
            <form action="register" method="post">
                <input type="hidden" name="cancel" value="true">
                <input type="hidden" name="regId" value="<%= reg.getRegistrationId() %>">
                <button type="submit">Cancel Registration</button>
            </form>
        </div>
        <%
                    }
                }
            }
        %>
        <a href="studentDashboard.html">Back to Dashboard</a>
    </div>
</body>
</html>