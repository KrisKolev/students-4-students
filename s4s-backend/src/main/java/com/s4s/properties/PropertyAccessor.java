package com.s4s.properties;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertyAccessor {

    private static Properties properties;

    private PropertyAccessor() {
        throw new IllegalStateException("Utility class");
    }

    public static Properties createInstance() {
        if(properties == null){
            properties = new Properties();
            try {
                InputStream applicationProperties = PropertyAccessor.class.getResourceAsStream("../../../application.properties");
                properties.load(applicationProperties);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return properties;
    }

    public static String getGoogleAuthJson(){
        return createInstance().getProperty("google.auth.json");
    }

    public static String getGoogleAuthFirestormProject(){
        return createInstance().getProperty("google.auth.firestorm.project");
    }

    public static String getReload(){
        return createInstance().getProperty("reload.id");
    }
}
