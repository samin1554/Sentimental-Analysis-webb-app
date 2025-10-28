package com.feedBackService.feedBackService.repository;

import com.feedBackService.feedBackService.model.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface feedBackRepository extends JpaRepository<FeedBack,Long> {
    Optional<FeedBack> findById(Long Id);


}