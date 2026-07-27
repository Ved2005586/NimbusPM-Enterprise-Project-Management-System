package com.pms.repository;

import com.pms.entity.ChatRoom;
import com.pms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT c FROM ChatRoom c JOIN c.participants p WHERE p = :user")
    List<ChatRoom> findByParticipant(@Param("user") User user);
}
