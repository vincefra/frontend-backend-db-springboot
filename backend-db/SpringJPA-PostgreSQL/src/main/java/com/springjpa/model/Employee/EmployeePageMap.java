package com.springjpa.model.Employee;

import com.springjpa.model.Project.ProjectEmployeeMap;
import java.util.HashMap;
import java.util.List;

public class EmployeePageMap {
    
    private long id;
    private String firstName;
    private String lastName;
    private List<String> role;
    private String description;
    private List<String> location;
    private HashMap<String, List<String>> technologies;
    private List<ProjectEmployeeMap> projects;
    

    public EmployeePageMap(long id, String firstName, String lastName, List<String> role, String description, List<String> location, HashMap<String, List<String>> technologies, List<ProjectEmployeeMap> projects) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.description = description;
        this.location = location;
        this.technologies = technologies;
        this.projects = projects;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<String> getRole() {
        return role;
    }

    public void setRole(List<String> role) {
        this.role = role;
    }

    public List<String> getLocation() {
        return location;
    }

    public void setLocation(List<String> location) {
        this.location = location;
    }

    public HashMap<String, List<String>> getTechnologies() {
        return technologies;
    }

    public void setTechnologies(HashMap<String, List<String>> technologies) {
        this.technologies = technologies;
    } 

    public List<ProjectEmployeeMap> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectEmployeeMap> projects) {
        this.projects = projects;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
