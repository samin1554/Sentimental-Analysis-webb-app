package com.feedBackService.feedBackService.controller;

import com.feedBackService.feedBackService.model.FeedBack;
import com.feedBackService.feedBackService.service.FeedBackService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/feedback")
@AllArgsConstructor
public class FeedbackController {

    private final FeedBackService feedBackService;

    @PostMapping
    public ResponseEntity<FeedBack> submitFeedback(@RequestBody FeedBack feedBack) {
        FeedBack savedFeedback = feedBackService.saveFeedBack(feedBack);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    // GET /api/v1/feedback
    @GetMapping
    public ResponseEntity<List<FeedBack>> getAllFeedback() {
        List<FeedBack> feedbackList = feedBackService.getAllFeedback();
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FeedBack> getFeedbackById(@PathVariable Long id) {
        return feedBackService.getFeedbackById(id)
                .map(feedback -> new ResponseEntity<>(feedback, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}