package com.s4s.database;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.s4s.database.model.City;
import com.s4s.database.model.Country;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class LocationsAccess {
    private static List<Country> countries;
    private static List<Country> countriesWithCities;
    private static LocationsAccess instance;

    static {
        try {
            InputStream countriesJsonStream = LocationsAccess.class.getResourceAsStream("../../../countries+cities.json");

            JsonArray jsonObjects = (JsonArray) JsonParser.parseReader(
                    new InputStreamReader(countriesJsonStream, StandardCharsets.UTF_8));

            if (jsonObjects != null) {
                countries = new ArrayList<>();
                countriesWithCities = new ArrayList<>();
                jsonObjects.forEach(country -> {
                    JsonObject newCountryObject = (JsonObject) country;
                    Country newCountry = new Country();
                    Country newCountryCity = new Country();

                    String capital="";

                    //load data from JSON
                    newCountry.setName(newCountryObject.get("name").getAsString());
                    newCountry.setUid(newCountryObject.get("id").getAsString());
                    newCountryCity.setName(newCountryObject.get("name").getAsString());
                    newCountryCity.setUid(newCountryObject.get("id").getAsString());

                    //stora capital
                    capital = newCountryObject.get("capital").getAsString();
                    //helper variable
                    String finalCapital = capital;

                    //load cities
                    JsonArray cities = newCountryObject.get("cities").getAsJsonArray();
                    cities.forEach(city->{
                        JsonObject newCityObject = city.getAsJsonObject();
                        City newCity = new City();

                        //load JSON data
                        newCity.setName(newCityObject.get("name").getAsString());
                        newCity.setUid(newCityObject.get("id").getAsString());
                        newCity.setCenterLatitude(newCityObject.get("latitude").getAsString());
                        newCity.setCenterLongitude(newCityObject.get("longitude").getAsString());

                        //add city to country
                        newCountryCity.getCities().add(newCity);
                        if(newCity.getName() == finalCapital){
                            newCountryCity.setCapital(newCity);
                            newCountry.setCapital(newCity);
                        }
                    });

                    countries.add(newCountry);
                    countriesWithCities.add(newCountryCity);
                });
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static LocationsAccess createInstance() {
        if (instance == null) {
            instance = new LocationsAccess();
        }
        return instance;
    }

    public static List<Country> getCountries() {
        return countries;
    }

    public static List<Country> getCountriesWithCities(){
        return countriesWithCities;
    }
}

