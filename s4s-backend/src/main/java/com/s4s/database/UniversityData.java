package com.s4s.database;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.s4s.database.model.University;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class UniversityData {
    public static List<University> universities = new ArrayList<>();

    public static void extractUniversities() {
        try {
            InputStream universityJsonStream = UniversityData.class.getResourceAsStream("../../../universities.json");

            if(universityJsonStream==null)
                return;

            JsonArray jsonObjects = (JsonArray)JsonParser.parseReader(
                    new InputStreamReader(universityJsonStream , StandardCharsets.UTF_8));

            if(jsonObjects!=null){
                jsonObjects.forEach(university->{
                    JsonObject newUniversityObject = (JsonObject) university;
                    University newUniversity = new University();

                    //load data from JSON
                    newUniversity.setName(newUniversityObject.get("name").getAsString());
                    newUniversity.setCountry(newUniversityObject.get("country").getAsString());

                    JsonArray domains = newUniversityObject.get("domains").getAsJsonArray();
                    domains.forEach(domain-> newUniversity.getDomains().add(domain.getAsString()));

                    JsonArray websites = newUniversityObject.get("web_pages").getAsJsonArray();
                    websites.forEach(webpage-> newUniversity.getWebsites().add(webpage.getAsString()));

                    universities.add(newUniversity);
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
