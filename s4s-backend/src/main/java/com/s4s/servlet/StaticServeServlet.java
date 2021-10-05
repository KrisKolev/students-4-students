package com.s4s.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;

public class StaticServeServlet extends HttpServlet {
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        OutputStream writer = response.getOutputStream();

        String path = request.getRequestURI().substring(request.getContextPath().length());
        path = fixPaths(path);

        addMimeType(response, path);

        InputStream resource = getServletContext().getResourceAsStream(path);
        if(resource == null){
            resource = getServletContext().getResourceAsStream("/app/index.html");
            response.setHeader("Content-Type", "text/html");
        }
        byte[] bytes = resource.readAllBytes();

        writer.write(bytes);
        writer.flush();
    }

    private String fixPaths(String path) {
        String input = path.replace("web", "").replace("//", "");
        String result = "/app/";

        if(input == null || input.trim().isEmpty() || input.endsWith("/")) {
            result += "index.html";
        } else{
            result += input;
        }

        return result;
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
                case "jpeg":
                case "jpg":
                    contentType = "image/jpeg";
                    break;
                case "png":
                    contentType = "image/png";
                    break;
                default:
                    contentType = "text/html";
                    break;
            }
        }
        response.setHeader("Content-Type", contentType);
    }
}
