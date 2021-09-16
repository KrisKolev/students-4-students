package com.s4s.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

public class StaticServeServlet extends HttpServlet {
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        PrintWriter writer = response.getWriter();

        String path = request.getRequestURI().substring(request.getContextPath().length());

        path = fixPaths(path);

        addMimeType(response, path);

        InputStream resource = getServletContext().getResourceAsStream(path);
        if(resource == null){
            resource = getServletContext().getResourceAsStream("/web/index.html");
            response.setHeader("Content-Type", "text/html");
        }
        byte[] bytes = resource.readAllBytes();

        writer.write(new String(bytes));
        writer.flush();
    }

    private String fixPaths(String path) {
        if(path == null || path.trim().isEmpty() || "/web".equalsIgnoreCase(path) || "/web/".equalsIgnoreCase(path)){
            path = "/web/index.html";
        } else if(path != null && path.contains("/web/web")){
            path = path.replace("/web/web", "/web");
        }
        return path;
    }

    private void addMimeType(HttpServletResponse response, String path) {
        String contentType = "";
        if(path != null && path.contains(".")){
            String[] fileExtension = path.split("\\.");
            switch (fileExtension[fileExtension.length -1]){
                case "js":
                    contentType = "text/javascript";
                    break;
                case "css":
                    contentType = "text/css";
                    break;
                default:
                    contentType = "text/html";
                    break;
            }
        }
        response.setHeader("Content-Type", contentType);
    }
}
