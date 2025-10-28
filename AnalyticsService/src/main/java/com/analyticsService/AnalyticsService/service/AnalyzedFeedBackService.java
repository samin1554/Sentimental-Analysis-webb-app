package com.analyticsService.AnalyticsService.service;

import com.analyticsService.AnalyticsService.model.AnalyzedFeedback;
import com.analyticsService.AnalyticsService.repository.AnalyzedFeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyzedFeedBackService {
    private final AnalyzedFeedbackRepository repository;

    public ResponseEntity<AnalyzedFeedback> saveFeedback(AnalyzedFeedback feedback) {
        return ResponseEntity.ok(repository.save(feedback));
    }

    public ResponseEntity<List<AnalyzedFeedback>> getAllFeedback() {
        return ResponseEntity.ok(repository.findAll());
    }
}
