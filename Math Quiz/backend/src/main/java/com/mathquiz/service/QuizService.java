package com.mathquiz.service;

import com.mathquiz.model.Question;
import com.mathquiz.dao.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;

@Service
public class QuizService {
    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getRandomQuestions(Long categoryId, String difficulty, int count) {
        List<Question> questions = questionRepository.findByCategoryIdAndDifficulty(categoryId, difficulty);
        Random random = new Random();
        // Simple random selection
        List<Question> selected = new java.util.ArrayList<>();
        for (int i = 0; i < Math.min(count, questions.size()); i++) {
            selected.add(questions.get(random.nextInt(questions.size())));
        }
        return selected;
    }
}