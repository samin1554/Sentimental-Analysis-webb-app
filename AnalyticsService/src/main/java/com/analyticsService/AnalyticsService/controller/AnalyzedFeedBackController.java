package com.analyticsService.AnalyticsService.controller;

import com.analyticsService.AnalyticsService.model.AnalyzedFeedback;
import com.analyticsService.AnalyticsService.service.AnalyzedFeedBackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyzedFeedBackController {

    private final AnalyzedFeedBackService service;

    @PostMapping
    public ResponseEntity<AnalyzedFeedback> saveFeedback(@RequestBody AnalyzedFeedback feedback) {
        return service.saveFeedback(feedback);
    }

    @GetMapping
    public ResponseEntity<List<AnalyzedFeedback>> getAllFeedback() {
        return service.getAllFeedback();
    }
}
