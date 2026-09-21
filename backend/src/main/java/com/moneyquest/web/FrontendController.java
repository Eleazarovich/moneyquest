package com.moneyquest.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class FrontendController {

    @GetMapping({
        "/financial-health-screen", "/financial-health-screen/",
        "/game-simulation-screen", "/game-simulation-screen/",
        "/replay-quest-screen", "/replay-quest-screen/",
        "/what-if-future-you-screen", "/what-if-future-you-screen/",
        "/year-in-money-screen", "/year-in-money-screen/"
    })
    public String frontendPage(HttpServletRequest request) {
        String path = request.getRequestURI().substring(request.getContextPath().length());
        if (path.endsWith("/")) path = path.substring(0, path.length() - 1);
        return "forward:" + path + "/index.html";
    }
}
