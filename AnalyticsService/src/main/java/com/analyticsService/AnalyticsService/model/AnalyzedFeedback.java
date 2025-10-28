package com.analyticsService.AnalyticsService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "analyzed_feedback")
public class AnalyzedFeedback {
    @Id
    private String id;

    private String userName;
    private String email;
    private String message;

    private String sentimentLabel;
    private double sentimentScore;
    private String source;

    private String createdAt;

}
