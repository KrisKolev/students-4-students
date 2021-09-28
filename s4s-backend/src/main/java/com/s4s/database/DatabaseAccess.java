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

    public static Firestore createInstance() {
        if (dbInstance == null) {
            ArrayList<String> scopes = Lists.newArrayList(GOOGLE_AUTH_SCOPE);

            //Read credentials
            InputStream inputStream = DatabaseAccess.class.getResourceAsStream("../../../" + GOOGLE_AUTH_JSON);

            //Init credentials
            GoogleCredentials credentials = null;
            try {
                credentials = GoogleCredentials.fromStream(inputStream).createScoped(scopes);
            } catch (IOException e) {
                e.printStackTrace();
            }

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(credentials)
                    .setProjectId(GOOGLE_FIRESTORM_PROJECT_ID)
                    .build();

            FirebaseApp.initializeApp(options);

            dbInstance = FirestoreClient.getFirestore();
        }

        return dbInstance;
    }

    public static <T> void saveOrInsertDocument(Object document) {
        dbInstance.collection(documentMap.get(document.getClass())).add(document);
    }

    public static <T> T retrieveDocument(Class<T> documentType, String documentId)
            throws ExecutionException, InterruptedException {
        DocumentReference docRef = dbInstance.collection(documentMap.get(documentType)).document(documentId);

        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        T obj = document.toObject(documentType);
        return obj;
    }

    public static <T> List<T> retrieveAllDocuments(Class<T> documentType)
            throws InterruptedException, ExecutionException {
        ApiFuture<QuerySnapshot> query = dbInstance.collection(documentMap.get(documentType)).get();

        QuerySnapshot querySnapshot = query.get();
        List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();

        List<T> result = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            result.add(document.toObject(documentType));
        }

        return result;
    }

    public static <T> void deleteDocument(Class<T> documentType, String documentId)
            throws InterruptedException, ExecutionException {
        DocumentReference document = dbInstance.collection(documentMap.get(documentType)).document(documentId);
        ApiFuture<WriteResult> writeResult = document.delete();
    }
}
