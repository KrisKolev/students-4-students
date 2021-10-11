package com.s4s.database.model;

import java.util.ArrayList;
import java.util.List;

public class Country {
    private List<City> Cities = new ArrayList<>();
    private String Uid;
    private City Capital;
    private String Name;

    public List<City> getCities() {
        return Cities;
    }

    public void setCities(List<City> cities) {
        Cities = cities;
    }

    public String getUid() {
        return Uid;
    }

    public void setUid(String uid) {
        Uid = uid;
    }

    public City getCapital() {
        return Capital;
    }

    public void setCapital(City capital) {
        Capital = capital;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }
}
