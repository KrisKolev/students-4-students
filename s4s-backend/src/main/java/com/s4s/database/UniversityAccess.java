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

public class UniversityAccess {
    private static List<University> universities;
    private static List<String> uniqueDomains;
    private static UniversityAccess instance;

    static {
        try {
            InputStream universityJsonStream = UniversityAccess.class.getResourceAsStream("../../../universities.json");
            //TODO Exception

            JsonArray jsonObjects = (JsonArray) JsonParser.parseReader(
                    new InputStreamReader(universityJsonStream, StandardCharsets.UTF_8));

            if (jsonObjects != null) {
                universities = new ArrayList<>();
                uniqueDomains = new ArrayList<>();
                jsonObjects.forEach(university -> {
                    JsonObject newUniversityObject = (JsonObject) university;
                    University newUniversity = new University();

                    //load data from JSON
                    newUniversity.setName(newUniversityObject.get("name").getAsString());
                    newUniversity.setCountry(newUniversityObject.get("country").getAsString());

                    JsonArray domains = newUniversityObject.get("domains").getAsJsonArray();
                    domains.forEach(domain -> newUniversity.getDomains().add(domain.getAsString()));

                    JsonArray websites = newUniversityObject.get("web_pages").getAsJsonArray();
                    websites.forEach(webpage -> newUniversity.getWebsites().add(webpage.getAsString()));

                    universities.add(newUniversity);

                    for (String domain : newUniversity.getDomains()) {
                        uniqueDomains.add(domain);
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static UniversityAccess createInstance() {
        if (instance == null) {
            instance = new UniversityAccess();
        }
        return instance;
    }

    public static boolean isValidEmailDomain(String email) {
        if (email == null || "".equals(email) || !email.contains("@"))
            return false;

        String emailDomain = email.substring(email.indexOf('@')).replace("@", "");
        return UniversityAccess.uniqueDomains.contains(emailDomain);
    }
}
