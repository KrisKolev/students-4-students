package com.s4s.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;

        StringBuilder sb = new StringBuilder("CORSFilter: ");
        sb.append(httpServletRequest.getMethod()).append(" ");
        sb.append(httpServletRequest.getRequestURL());
        sb.append(httpServletRequest.getRequestURI());
        System.out.println(sb);

        // Authorize (allow) all domains to consume the content
        ((HttpServletResponse) response).addHeader("Access-Control-Allow-Origin", "*");
        ((HttpServletResponse) response).addHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD, PUT, POST");
        ((HttpServletResponse) response).addHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

        HttpServletResponse resp = (HttpServletResponse) response;

        // For HTTP OPTIONS verb/method reply with ACCEPTED status code -- per CORS handshake
        if (httpServletRequest.getMethod().equals("OPTIONS")) {
            resp.setStatus(HttpServletResponse.SC_ACCEPTED);
            return;
        }

        // pass the request along the filter chain
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
