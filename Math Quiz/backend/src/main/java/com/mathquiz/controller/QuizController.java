package com.mathquiz.controller;

import com.mathquiz.model.Question;
import com.mathquiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @GetMapping("/questions")
    public List<Question> getQuestions(@RequestParam Long categoryId, @RequestParam String difficulty, @RequestParam int count) {
        return quizService.getRandomQuestions(categoryId, difficulty, count);
    }
}