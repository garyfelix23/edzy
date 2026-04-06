package com.revature.edzybackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class DashboardResponse {
    private String courseId;
    private String title;
    private int progress;
    private boolean completed;
}
