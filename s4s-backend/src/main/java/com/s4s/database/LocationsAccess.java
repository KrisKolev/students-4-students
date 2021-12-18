package com.s4s.database;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.s4s.database.model.City;
import com.s4s.database.model.Country;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Access to all country and city relevant data.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
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
                    newCountry.setLatitude(newCountryObject.get("latitude").getAsString());
                    newCountry.setLongitude(newCountryObject.get("longitude").getAsString());
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

    /**
     * Creates the instance of the locations access.
     * @return
     */
    public static LocationsAccess createInstance() {
        if (instance == null) {
            instance = new LocationsAccess();
        }
        return instance;
    }

    /**
     * Returns all countries without cities
     * @return
     */
    public static List<Country> getCountries() {
        return countries;
    }

    /**
     * Returns all data available.
     * @return
     */
    public static List<Country> getCountriesWithCities(){
        return countriesWithCities;
    }

    public static boolean deleteCountry(Country country){
        try {
            DatabaseAccess.deleteDocument("country", country.getUid());
            return true;
        }catch (InterruptedException | ExecutionException iex){
            System.out.println("Error while deleting document rollback is made");
            System.err.println(iex);
            return false;
        }
    }

    /**
     * Returns all cities for a specific country
     * @param id
     * @return
     */
    public static javax.ws.rs.core.Response getCountryWithCity(String id){

        Country countrySearch = countriesWithCities.stream()
                .filter(country -> id.equals(country.getUid()))
                .findAny()
                .orElse(null);

        if(countrySearch == null)
            return new ResponseHelper(Info.FAILURE,"Could not find country with ID "+id).build();
        else{
            return new ResponseHelper(Info.SUCCESS,countrySearch).build();
        }
    }
}

