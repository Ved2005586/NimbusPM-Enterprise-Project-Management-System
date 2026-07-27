package com.pms.repository;

import com.pms.entity.Task;
import com.pms.entity.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
    List<TaskHistory> findByTaskOrderByCreatedAtDesc(Task task);
}
