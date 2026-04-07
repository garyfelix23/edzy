package com.revature.edzybackend.model;
import lombok.Data;

import java.util.UUID;

@Data
public class Module {
    private String moduleId = UUID.randomUUID().toString();
    private String title;
    private String type;
    private String videoLink;
    private String textContent;
    private String duration;
    private int order;
}
