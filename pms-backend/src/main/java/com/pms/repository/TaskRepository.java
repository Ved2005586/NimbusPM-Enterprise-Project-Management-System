package com.pms.repository;

import com.pms.entity.Project;
import com.pms.entity.Sprint;
import com.pms.entity.Task;
import com.pms.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByProjectOrderByPositionAsc(Project project);

    List<Task> findByProjectAndStatusOrderByPositionAsc(Project project, TaskStatus status);

    List<Task> findBySprint(Sprint sprint);

    long countByProjectAndStatus(Project project, TaskStatus status);

    @Query("SELECT COALESCE(MAX(t.position), 0) FROM Task t WHERE t.project = :project AND t.status = :status")
    Integer findMaxPositionInColumn(@Param("project") Project project, @Param("status") TaskStatus status);

    @Query("SELECT t FROM Task t WHERE " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.taskKey) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Task> search(@Param("query") String query);

    Optional<Task> findByTaskKey(String taskKey);
}
