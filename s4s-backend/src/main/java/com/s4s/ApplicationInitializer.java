package com.s4s;

import com.s4s.database.DatabaseAccess;
import com.s4s.database.LocationsAccess;
import com.s4s.database.UniversityAccess;
import com.s4s.database.model.Country;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import java.util.List;

@Singleton
@Startup
public class ApplicationInitializer {

    @PostConstruct
    public void initialize() {
        //Database
        System.out.println("S4S Backend - creating database instance.");
        DatabaseAccess.createInstance();
        System.out.println("S4S Backend - creating database instance done.");

        //University
        System.out.println("S4S Backend - creating university instance.");
        UniversityAccess.createInstance();
        System.out.println("S4S Backend - creating university instance done.");

        //Locations
        System.out.println("S4S Backend - creating locations instance.");
        LocationsAccess.createInstance();
        System.out.println("S4S Backend - creating locations instance done.");
    }
}
