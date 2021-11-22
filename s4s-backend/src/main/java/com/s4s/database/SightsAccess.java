package com.s4s.database;

import com.google.cloud.firestore.DocumentReference;
import com.s4s.database.model.Label;
import com.s4s.database.model.Rating;
import com.s4s.database.model.Sight;
import com.s4s.database.model.User;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Access all sight relevant functions
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
public class SightsAccess {

    /**
     * Sight instance for access
     */
    private static SightsAccess instance;
    /**
     * All available sights
     */
    private static List<Sight> sights = new ArrayList<>();
    /**
     * All available labels
     */
    private static List<Label> labels = new ArrayList<>();
    /**
     * All available ratings
     */
    private static List<Rating> ratings = new ArrayList<>();

    /**
     * Top sights
     */
    private static List<Sight>topSight = new ArrayList<>();


    /**
     * Creates the sight instance
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public static SightsAccess createInstance() throws ExecutionException, InterruptedException {
        if (instance == null) {
            instance = new SightsAccess();
            labels = loadLabels();
            sights = loadSights();
        }
        return instance;
    }

    /**
     * Adds a sight to database
     * @param sight
     * @return
     */
    public static javax.ws.rs.core.Response addSights(Sight sight, String user){
        try{
            sights = loadSights();
            List<Sight> sightSearch = sights.stream().filter(x->x.getName().equals(sight.getName()))
                    .collect(Collectors.toList());
            List<Sight> sightsAddressSearch = sights.stream().filter(x->x.getAddress().equals(sight.getAddress()))
                    .collect(Collectors.toList());

            if(!sightSearch.isEmpty()){
                return new ResponseHelper(Info.FAILURE,"Sight '" + sight.getName() + "' already exists!").build();
            }

            if(!sightsAddressSearch.isEmpty()){
                return new ResponseHelper(Info.FAILURE,"Sight already added on address '" + sight.getAddress() + "'!").build();
            }
            List<User> existingUser = DatabaseAccess.retrieveAllDocuments(User.class).stream().filter(x->x.getUid().equals(user)).collect(Collectors.toList());

            if(existingUser.isEmpty()){
                return new ResponseHelper(Info.FAILURE,"User could not be verified!").build();
            }

            sight.setCreator(user);

            //check labels
            labels = loadLabels();
            for (Label x : sight.getLabelList()) {
                Label found = labels.stream()
                        .filter(y->y.getName().equals(x.getName()))
                        .findAny()
                        .orElse(null);
                if (found==null) {
                    addLabel(x);
                }
            }

            //write ratings
            for (Rating rating:sight.getRatingList()) {
                rating.setCreator(user);
                addRating(rating);
            }

            //assign labels
            sight.setLabelsAssigned(new ArrayList<>());
            for (Label label:sight.getLabelList()) {
                sight.getLabelsAssigned().add(label.getUid());
            }

            //assign ratings
            sight.setRatingAssigned(new ArrayList<>());
            for (Rating rating:sight.getRatingList()) {
                sight.getRatingAssigned().add(rating.getUid());
            }

            sight.setLabelList(new ArrayList<>());
            sight.setRatingList(new ArrayList<>());

            DocumentReference writeResult = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(sight.getClass()),sight);
            sight.setUid(writeResult.getId());
            DatabaseAccess.updateUidOfDocument("sight",sight.getUid(),sight.getUid());
            sights = loadSights();
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE,"Sight could not be added! "+e.getMessage(),sight).build();
        }
        return new ResponseHelper(Info.SUCCESS,"Added sight",sight).build();
    }

    /**
     * Get all labels
     * @return
     */
    public static List<Label> getLabels(){
        return labels;
    }

    /**
     * Adds a label to database.
     * @param label
     * @return
     */
    public static javax.ws.rs.core.Response addLabel(Label label){
        try{
            labels = loadLabels();
            List<Label> labelSearch = labels.stream().filter(x->x.getName().equals(label.getName()))
                    .collect(Collectors.toList());
            if(!labelSearch.isEmpty())
                return new ResponseHelper(Info.FAILURE,"Label already exists!").build();

            DocumentReference ref = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(label.getClass()),label);
            label.setUid(ref.getId());
            DatabaseAccess.updateUidOfDocument("label",label.getUid(),label.getUid());
            labels = loadLabels();
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE,"An error occurred! "+e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS,label).build();
    }

    /**
     * Gets all sights from database.
     * @return
     */
    public static List<Sight> getSights() {
        return sights;
    }



    /**
     * Loads all labels from database
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    private static List<Label> loadLabels() throws ExecutionException, InterruptedException {
        return DatabaseAccess.retrieveAllDocuments(Label.class);
    }

    /**
     * Loads all sights from database
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    private static List<Sight> loadSights() throws ExecutionException, InterruptedException {
        labels = loadLabels();
        ratings = DatabaseAccess.retrieveAllDocuments(Rating.class);
        List<Sight> loadedSights = DatabaseAccess.retrieveAllDocuments(Sight.class);

        try{
            //load sights
            for (Sight sight:loadedSights) {

                //load labels for sight
                sight.setLabelList(new ArrayList<>());
                for (String label:sight.getLabelsAssigned()) {
                    Label found = labels.stream().filter(x->x.getUid().equals(label))
                            .findAny()
                            .orElse(null);
                    if(found!=null)
                        sight.getLabelList().add(found);
                }

                //load ratings for sight
                sight.setRatingList(new ArrayList<>());
                for (String rating: sight.getRatingAssigned()) {

                    Rating found = ratings.stream()
                            .filter(x->x.getUid().equals(rating))
                            .findAny()
                            .orElse(null);
                    if(found!=null)
                        sight.getRatingList().add(found);
                }
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }

        return loadedSights;
    }

        /**
         * Adds a rating for a sight
         * @param rating
         * @return
         */
    public static javax.ws.rs.core.Response addRating(Rating rating){
        try{
            DocumentReference ref = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(rating.getClass()),rating);
            rating.setUid(ref.getId());
            DatabaseAccess.updateUidOfDocument("rating",rating.getUid(),rating.getUid());
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE,"An error occurred! "+e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS,"Rating added",rating).build();
    }

    public static double getDistanceFromLatLonInKm(double lat1, double lon1, double lat2, double lon2){
        final double earthRadius = 6371;
        double dLat = deg2rad(lat2 - lat1);
       double dLon = deg2rad(lon2 - lon1);

       double a =
               Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) *
                       Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);

       double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    public static double deg2rad(double deg){
        return Math.toRadians(deg);
    }

    public static List<Sight>getTopSight(double lon, double lat, double radius){
        List<Sight> sightDistances = new ArrayList<>();

        for (Sight sight : sights) {
            double averageRating;
            double allRatings = 0;

            double sightLat = Double.parseDouble(sight.getLatitude());
            double sightLon = Double.parseDouble(sight.getLongitude());

            double distance = SightsAccess.getDistanceFromLatLonInKm(
                    sightLat,sightLon,lat, lon);
            if (distance <= radius){
                for (String rating : sight.getRatingAssigned()){
                    allRatings += Double.parseDouble(rating);
                }
                averageRating = allRatings / ratings.size();
                sightDistances.add(sight);
                if (averageRating >= 4){
                    sightDistances.add(sight);
                }
            }
        }
        return  sightDistances;
    }
}
