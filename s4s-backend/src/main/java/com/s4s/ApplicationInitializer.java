package com.s4s;

import com.s4s.database.DatabaseAccess;
import com.s4s.database.UniversityAccess;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;

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
    }
}
