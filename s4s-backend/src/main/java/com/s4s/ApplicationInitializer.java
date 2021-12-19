package com.s4s;
import com.s4s.database.*;
import java.util.concurrent.ExecutionException;

public class ApplicationInitializer {
    public static void Initialize() throws ExecutionException, InterruptedException {
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

        //Sights
        System.out.println("S4S Backend - creating sights instance.");
        SightsAccess.createInstance();
        System.out.println("S4S Backend - creating sights instance done.");
    }
}
