package com.s4s.database;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.s4s.database.model.Country;
import com.s4s.database.model.Sight;
import com.s4s.database.model.University;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class UniversityAccess {
    private static List<University> universities;
    private static List<String> uniqueDomains;
    private static UniversityAccess instance;
    private static String VALID_EMAIL_REGEX = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";


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

    public static boolean deleteUniversity(University university){
        try {
            DatabaseAccess.deleteDocument("university", university.getUid());
            return true;
        }catch (InterruptedException | ExecutionException iex){
            System.out.println("Error while deleting document rollback is made");
            System.err.println(iex);
            return false;
        }
    }

    public static boolean isValidEmailDomain(String email) {

        if (!email.matches(VALID_EMAIL_REGEX))
            return false;

        String emailDomain = email.substring(email.indexOf('@')).replace("@", "");
        return UniversityAccess.uniqueDomains.contains(emailDomain);
    }
}
