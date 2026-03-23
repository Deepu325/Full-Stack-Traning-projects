package com.mathquiz.controller;

import com.mathquiz.model.Score;
import com.mathquiz.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {
    @Autowired
    private ScoreService scoreService;

    @PostMapping
    public Score submitScore(@RequestBody Score score) {
        return scoreService.saveScore(score);
    }

    @GetMapping("/user/{userId}")
    public List<Score> getUserScores(@PathVariable Long userId) {
        return scoreService.getUserScores(userId);
    }
}