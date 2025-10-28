package com.analyticsService.AnalyticsService.repository;

import com.analyticsService.AnalyticsService.model.AnalyzedFeedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalyzedFeedbackRepository extends MongoRepository<AnalyzedFeedback,String> {
}
