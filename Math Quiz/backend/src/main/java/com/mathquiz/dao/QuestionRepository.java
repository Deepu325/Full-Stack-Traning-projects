package com.mathquiz.dao;

import com.mathquiz.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryIdAndDifficulty(Long categoryId, String difficulty);
}