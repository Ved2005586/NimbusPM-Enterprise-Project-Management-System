package com.pms.repository;

import com.pms.entity.Project;
import com.pms.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjectOrderByStartDateDesc(Project project);
}
