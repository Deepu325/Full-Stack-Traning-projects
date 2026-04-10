package com.example.servlet;

import com.example.dao.RegistrationDAO;
import com.example.model.User;
import com.example.model.Registration;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

public class RegistrationServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        if (request.getParameter("cancel") != null) {
            int regId = Integer.parseInt(request.getParameter("regId"));
            RegistrationDAO registrationDAO = new RegistrationDAO();
            registrationDAO.cancelRegistration(regId);
            response.sendRedirect("register");
            return;
        }

        int courseId = Integer.parseInt(request.getParameter("courseId"));
        RegistrationDAO registrationDAO = new RegistrationDAO();
        boolean success = registrationDAO.registerUserForCourse(user.getUserId(), courseId);
        if (success) {
            response.sendRedirect("register");
        } else {
            request.setAttribute("error", "Registration failed");
            request.getRequestDispatcher("courseCatalog.jsp").forward(request, response);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        RegistrationDAO registrationDAO = new RegistrationDAO();
        List<Registration> registrations = registrationDAO.getRegistrationsByUser(user.getUserId());
        request.setAttribute("registrations", registrations);
        request.getRequestDispatcher("myRegistrations.jsp").forward(request, response);
    }
}
