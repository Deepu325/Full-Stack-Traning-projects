package com.mathquiz.service;

import com.mathquiz.model.Score;
import com.mathquiz.dao.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ScoreService {
    @Autowired
    private ScoreRepository scoreRepository;

    public Score saveScore(Score score) {
        return scoreRepository.save(score);
    }

    public List<Score> getUserScores(Long userId) {
        return scoreRepository.findByUserId(userId);
    }

    // Additional methods for leaderboard
}