package com.feedBackService.feedBackService.service;

import com.feedBackService.feedBackService.model.FeedBack;
import com.feedBackService.feedBackService.repository.feedBackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeedBackService {
    private final feedBackRepository feedBackRepository;

    //Save FeedBack
    public FeedBack saveFeedBack(FeedBack feedBack){
        return feedBackRepository.save(feedBack);
    }

    //find all things from user
    public List<FeedBack> getAllFeedback(){
        return feedBackRepository.findAll();

    }
    
    // Fixed to return Optional
    public Optional<FeedBack> getFeedbackById(Long id){
        return feedBackRepository.findById(id);
    }
}