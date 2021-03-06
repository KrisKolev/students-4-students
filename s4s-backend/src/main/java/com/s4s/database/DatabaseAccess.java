package com.s4s.database;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.*;
import com.google.common.collect.Lists;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.s4s.database.model.*;
import com.s4s.properties.PropertyAccessor;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ExecutionException;

public class DatabaseAccess {

    public static final String GOOGLE_AUTH_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
    public static final String GOOGLE_AUTH_JSON = PropertyAccessor.getGoogleAuthJson();
    public static final String GOOGLE_FIRESTORM_PROJECT_ID = PropertyAccessor.getGoogleAuthFirestormProject();

    private static Firestore dbInstance;
    public static Map<Class, String> documentMap;
    static {
        documentMap = new HashMap<>();
        documentMap.put(Bookmark.class, "bookmark");
        documentMap.put(Label.class, "label");
        documentMap.put(Rating.class, "rating");
        documentMap.put(Sight.class, "sight");
        documentMap.put(University.class, "university");
        documentMap.put(User.class, "user");

        createInstance();
    }

    /**
     * Must be executed before accessing the database access classes to initialize the connection
     * */
    public static Firestore createInstance() {
        if (dbInstance == null) {
            ArrayList<String> scopes = Lists.newArrayList(GOOGLE_AUTH_SCOPE);

            //Read credentials
            InputStream inputStream = DatabaseAccess.class.getResourceAsStream("../../../" + GOOGLE_AUTH_JSON);

            //Init credentials
            GoogleCredentials credentials = null;
            try {
                credentials = GoogleCredentials.fromStream(Objects.requireNonNull(inputStream)).createScoped(scopes);
            } catch (IOException e) {
                e.printStackTrace();
            }

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(Objects.requireNonNull(credentials))
                    .setProjectId(GOOGLE_FIRESTORM_PROJECT_ID)
                    .build();

            FirebaseApp.initializeApp(options);
            dbInstance = FirestoreClient.getFirestore();
        }

        return dbInstance;
    }

    /**
    * use to store an object as document on firestore if document name can be generic
    * */
    public static DocumentReference saveOrInsertDocument(String collectionName,Object document) throws ExecutionException, InterruptedException {
        return dbInstance.collection(collectionName).add(document).get();
    }

    /**
     * use to store an object as document on firestore if document name can must be specific
     * **/
    public static WriteResult saveOrInsertDocument(String collectionName,Object document,String documentName) throws ExecutionException, InterruptedException {
        return dbInstance.collection(collectionName).document(documentName).set(document).get();
    }

    /**
     * use only if the given document is existing, otherwise exception will be thrown.
     * */
    public static WriteResult updateUidOfDocument(String collectionName,String documentName,String uid) throws ExecutionException, InterruptedException {
        DocumentReference docRef = dbInstance.collection(collectionName).document(documentName);
        return docRef.update("uid",uid).get();
    }

    /**
     * use only if the given document is existing and the attribute field exists, otherwise exception will be thrown.
     * */
    public static WriteResult updateStringAttribute(String collectionName,String documentName,String attributeName,String newValue) throws ExecutionException, InterruptedException {
        DocumentReference docRef = dbInstance.collection(collectionName).document(documentName);
        return docRef.update(attributeName,newValue).get();
    }

    /**
     * use only if the given document is existing and the attribute field exists, otherwise exception will be thrown.
     * */
    public static WriteResult updateStringAttribute(String collectionName,String documentName,String attributeName,List<String> newValue) throws ExecutionException, InterruptedException {
        DocumentReference docRef = dbInstance.collection(collectionName).document(documentName);
        return docRef.update(attributeName,newValue).get();
    }

    /**
     * gets all documents of a specific collection
     * */
    public static <T> List<T> retrieveAllDocuments(Class<T> collectionName)
            throws InterruptedException, ExecutionException {
        ApiFuture<QuerySnapshot> query = dbInstance.collection(documentMap.get(collectionName)).get();

        QuerySnapshot querySnapshot = query.get();
        List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();

        List<T> result = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            result.add(document.toObject(collectionName));
        }

        return result;
    }

    /**
     * use only if the given document is existing, otherwise exception will be thrown.
     * */
    public static ApiFuture<WriteResult> deleteDocument(String documentPath, String documentId)
            throws InterruptedException, ExecutionException {
        DocumentReference document = dbInstance.collection(documentPath).document(documentId);
        return document.delete();
    }
}
