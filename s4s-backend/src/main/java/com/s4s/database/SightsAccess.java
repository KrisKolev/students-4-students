package com.s4s.database;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.WriteResult;
import com.s4s.database.model.*;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import java.util.*;
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
     * instance for access the functions
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
     * All users.
     * */
    private static List<User> users = new ArrayList<>();

    /**
     * Must be executed before accessing the sights access classes to initialize the connection
     */
    public static SightsAccess createInstance() throws ExecutionException, InterruptedException {
        if (instance == null) {
            instance = new SightsAccess();
            loadSights();
        }
        return instance;
    }

    /**
     * Adds a sight to database only if name is unique and address is unique. Otherwise, it will be refused.
     */
    public static javax.ws.rs.core.Response addSights(Sight sight, String user) {
        try {
            loadSights();
            List<Sight> sightSearch = sights.stream().filter(x -> x.getName().equals(sight.getName()))
                    .collect(Collectors.toList());
            List<Sight> sightsAddressSearch = sights.stream().filter(x -> x.getAddress().equals(sight.getAddress()))
                    .collect(Collectors.toList());

            if (!sightSearch.isEmpty()) {
                return new ResponseHelper(Info.FAILURE, "Sight '" + sight.getName() + "' already exists!").build();
            }

            if (!sightsAddressSearch.isEmpty()) {
                return new ResponseHelper(Info.FAILURE, "Sight already added on address '" + sight.getAddress() + "'!").build();
            }
            List<User> existingUser = DatabaseAccess.retrieveAllDocuments(User.class).stream().filter(x -> x.getUid().equals(user)).collect(Collectors.toList());

            if (existingUser.isEmpty()) {
                return new ResponseHelper(Info.FAILURE, "User could not be verified!").build();
            }

            sight.setCreator(user);

            //check labels
            labels = loadLabels();
            for (Label x : sight.getLabelList()) {
                Label found = labels.stream()
                        .filter(y -> y.getName().equals(x.getName()))
                        .findAny()
                        .orElse(null);
                if (found == null) {
                    addLabel(x);
                }
            }

            //assign labels
            sight.setLabelsAssigned(new ArrayList<>());
            for (Label label : sight.getLabelList()) {
                sight.getLabelsAssigned().add(label.getUid());
            }

            List<Rating> tempRatings = sight.getRatingList();

            sight.setLabelList(new ArrayList<>());
            sight.setRatingList(new ArrayList<>());

            DocumentReference writeResult = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(sight.getClass()), sight);
            sight.setUid(writeResult.getId());
            WriteResult result = DatabaseAccess.updateUidOfDocument("sight", sight.getUid(), sight.getUid());
            System.out.println(result);

            //write ratings
            for (Rating rating : tempRatings) {
                rating.setCreator(user);
                rating.setSightId(sight.getUid());
                addRating(rating,false);
            }

            sights.add(sight);
            mapElements();

        } catch (Exception e) {
            return new ResponseHelper(Info.FAILURE, "Sight could not be added! " + e.getMessage(), sight).build();
        }
        return new ResponseHelper(Info.SUCCESS, "Added sight", sight).build();
    }

    /***
     *Updates a sight only if it exists. Otherwise, it will be refused.
     */
    public static javax.ws.rs.core.Response updateSights(Sight sight){
        try {
            loadSights();
            List<Sight> sightSearch = sights.stream().filter(x -> x.getName().equals(sight.getName()) && !x.getUid().equals(sight.getUid()))
                    .collect(Collectors.toList());
            List<Sight> sightsAddressSearch = sights.stream().filter(x -> x.getAddress().equals(sight.getAddress()) && !x.getUid().equals(sight.getUid()))
                    .collect(Collectors.toList());

            if (!sightSearch.isEmpty()) {
                return new ResponseHelper(Info.FAILURE, "Sight '" + sight.getName() + "' already exists!").build();
            }

            if (!sightsAddressSearch.isEmpty()) {
                return new ResponseHelper(Info.FAILURE, "Sight already added on address '" + sight.getAddress() + "'!").build();
            }

            Optional<Sight> searchedSightOptional = sights.stream().filter(x->x.getUid().equals(sight.getUid())).findFirst();
            if(!searchedSightOptional.isPresent()){
                return new ResponseHelper(Info.FAILURE, "Sight '" + sight.getName() + "' can´t be found!").build();
            }
            Sight searchedSight;
            searchedSight = sights.stream().filter(x->x.getUid().equals(sight.getUid())).findFirst().get();

            //check labels
            labels = loadLabels();
            for (Label x : sight.getLabelList()) {
                Label found = labels.stream()
                        .filter(y -> y.getName().equals(x.getName()))
                        .findAny()
                        .orElse(null);
                if (found == null) {
                    addLabel(x);
                }
            }

            searchedSight.setName(sight.getName());
            searchedSight.setAddress(sight.getAddress());
            searchedSight.setLongitude(sight.getLongitude());
            searchedSight.setLatitude(sight.getLatitude());
            searchedSight.setRatingList(sight.getRatingList());

            //assign labels
            searchedSight.setLabelsAssigned(new ArrayList<>());
            for (Label label : sight.getLabelList()) {
                searchedSight.getLabelsAssigned().add(label.getUid());
            }

             DatabaseAccess.updateStringAttribute("sight",searchedSight.getUid(),"name",searchedSight.getName());
             DatabaseAccess.updateStringAttribute("sight",searchedSight.getUid(),"address",searchedSight.getAddress());
             DatabaseAccess.updateStringAttribute("sight",searchedSight.getUid(),"latitude",searchedSight.getLatitude());
             DatabaseAccess.updateStringAttribute("sight",searchedSight.getUid(),"longitude",searchedSight.getLongitude());
             DatabaseAccess.updateStringAttribute("sight",searchedSight.getUid(),"labelsAssigned",searchedSight.getLabelsAssigned());

            mapElements();

        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE, "Sight could not be updated! " + e.getMessage(), sight).build();
        }

        return new ResponseHelper(Info.SUCCESS, "Updated sight", sight).build();
    }

    /**
     * Returns all currently existing labels from cache. A new database pull will not be done!
     */
    public static List<Label> getLabels() {
        return labels;
    }

    /**
     * Adds a label to database only if its name is unique and not an empty string or whitespaces.
     */
    public static javax.ws.rs.core.Response addLabel(Label label) {
        try {
            labels = loadLabels();

            if(label.getName().equals("") || label.getName().equals(" ")){
                return new ResponseHelper(Info.FAILURE, "Label name must not be empty or whitespace!").build();
            }

            List<Label> labelSearch = labels.stream().filter(x -> x.getName().equals(label.getName()))
                    .collect(Collectors.toList());
            if (!labelSearch.isEmpty())
                return new ResponseHelper(Info.FAILURE, "Label already exists!").build();

            DocumentReference ref = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(label.getClass()), label);
            label.setUid(ref.getId());
            DatabaseAccess.updateUidOfDocument("label", label.getUid(), label.getUid());
            labels = loadLabels();
        } catch (Exception e) {
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS, label).build();
    }

    /***
     * Deletes a label only if its present in the database. Otherwise, returns an error.
     */
    public static javax.ws.rs.core.Response deleteLabel(Label label){
        try {
            labels = loadLabels();
            Optional<Label> deleteLabel = SightsAccess.getLabels().stream().filter(x->x.getUid().equals(label.getUid())).findFirst();
            if(deleteLabel.isPresent()){
                DatabaseAccess.deleteDocument("label",label.getUid());
            }
            labels = loadLabels();
        } catch (Exception e) {
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS, label).build();
    }

    /**
     * Gets all sights from cache. A new database pull will not be done!.
     */
    public static List<Sight> getSights() {
        return sights;
    }

    /**
     * Loads all labels from database with a new fetch and overwrites the cache.
     */
    private static List<Label> loadLabels() throws ExecutionException, InterruptedException {
        return DatabaseAccess.retrieveAllDocuments(Label.class);
    }

    /**
     * Loads all sights from database with a new fetch and overwrites the cache.
     */
    public static void loadSights() throws ExecutionException, InterruptedException {
        users = DatabaseAccess.retrieveAllDocuments(User.class);
        labels = loadLabels();
        ratings = DatabaseAccess.retrieveAllDocuments(Rating.class);
        sights = DatabaseAccess.retrieveAllDocuments(Sight.class);
        mapElements();
    }

    /**
     * Maps ratings and labels to their corresponding sights.
     * */
    private static void mapElements(){
        try {
            //load sights
            for (Sight sight : sights) {

                //load labels for sight
                sight.setLabelList(new ArrayList<>());
                for (String label : sight.getLabelsAssigned()) {
                    labels.stream().filter(x -> x.getUid().equals(label))
                            .findAny().ifPresent(found -> sight.getLabelList().add(found));
                }

                //load ratings for sight
                sight.setRatingList(new ArrayList<>());
                List<Rating> assignedRatings = ratings.stream().filter(x->x.getSightId().equals(sight.getUid())).collect(Collectors.toList());
                sight.setRatingList(assignedRatings);

                for (Rating rating:sight.getRatingList()) {
                    Optional<User> user = users.stream().filter(x->x.getUid().equals(rating.getCreator())).findFirst();
                    if(user.isPresent()){
                        User userAct = user.get();
                        rating.setCreatorNickName(userAct.getNickname());
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Adds a new rating for a sight. If the sight does not exist it will be refused.
     */
    public static javax.ws.rs.core.Response addRating(Rating rating,boolean addToSight) {
        try {
            rating.setCreatedAtString(new Date().toString());
            DocumentReference ref = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(rating.getClass()), rating);
            rating.setUid(ref.getId());
            DatabaseAccess.updateUidOfDocument("rating", rating.getUid(), rating.getUid());
            ratings.add(rating);

            if(addToSight){
                Sight sight = null;

                Optional<Sight> sightOptional =  sights.stream().filter(x->x.getUid().equals(rating.getSightId())).findFirst();
                if(sightOptional.isPresent()){
                    sight = sights.stream().filter(x->x.getUid().equals(rating.getSightId())).findFirst().get();
                }

                if(sight!=null){
                    sight.getRatingList().add(rating);
                    mapElements();
                }
            }
        } catch (Exception e) {
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS, "Rating added", rating).build();
    }

    /**
     * Deletes a rating only if it exists. Otherwise, it will be refused.
     */
    public static javax.ws.rs.core.Response deleteRating(String ratingId){
        try {
            WriteResult t = DatabaseAccess.deleteDocument("rating", ratingId).get();
            System.out.println(t);
            Rating deleteRating = ratings.stream().filter(x->x.getUid().equals(ratingId)).findFirst().isPresent()
                    ? ratings.stream().filter(x->x.getUid().equals(ratingId)).findFirst().get() : null;
            ratings.remove(deleteRating);

            List<Sight> sight = sights.stream().filter(x->x.getRatingList().stream().anyMatch(y->y.getSightId().equals(ratingId))).collect(Collectors.toList());
            if(!sight.isEmpty()){
                Rating rating = sight.get(0).getRatingList().stream().filter(x->x.getSightId().equals(sight.get(0).getUid())).findFirst().get();
                sight.get(0).getRatingList().remove(rating);
            }

            mapElements();

        } catch (Exception e) {
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS, "Rating deleted", ratingId).build();
    }

    /**
     * Gets all topsights sorted by rating from database cache.
     */
    public static javax.ws.rs.core.Response getTopSights(double lon, double lat, double radius){

        try{
            List<SortedSight> sortedSights = new ArrayList<>();

            for (Sight sight : sights) {

                //check if parsing of long and lat is possible
                boolean canParse = true;
                try{
                    Double.parseDouble(sight.getLatitude());
                    Double.parseDouble(sight.getLongitude());
                }
                catch (Exception e){
                    canParse = false;
                }

                //if parsing fails continue
                if(!canParse)
                    continue;

                double sightLat = Double.parseDouble(sight.getLatitude());
                double sightLon = Double.parseDouble(sight.getLongitude());
                double distance = SightsAccess.getDistanceFromLatLonInKm(sightLat, sightLon, lat, lon);

                if (distance <= radius) {
                    sortedSights.add(new SortedSight(sight));
                }
            }
            sortedSights.sort(Comparator.comparing(SortedSight::getAverageRating));
            return new ResponseHelper(Info.SUCCESS, "TopSights sorted", sortedSights).build();
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage()).build();
        }
    }

    /**
     * Gets a sight by its id. If id is not present in database, it will return an error.
     * */
    public static javax.ws.rs.core.Response getSightById(String id) {
        try{
            List<Sight> sightList = sights.stream().filter(x->x.getUid().equals(id)).collect(Collectors.toList());
            if(sightList.isEmpty())
            {
                return new ResponseHelper(Info.FAILURE, "No sight found with id " + id,null).build();
            }
            return new ResponseHelper(Info.SUCCESS, "Sight found", sightList.get(0)).build();
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage(),null).build();
        }
    }

    /**
     * Gets all sights that a user has created by his id. If the user id is not found or the user has no sights, it returns null.
     * */
    public static javax.ws.rs.core.Response getSightsForUser(String userId){
        try{
            List<Sight> sightList = sights.stream().filter(x->x.getCreator().equals(userId)).collect(Collectors.toList());
            if(sightList.isEmpty())
            {
                return new ResponseHelper(Info.FAILURE, "No sights found for user " + userId,null).build();
            }
            return new ResponseHelper(Info.SUCCESS, "Sights found", sightList).build();
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage(),null).build();
        }
    }

    /**
     * Get all ratings for users. If the user id is not found or the user has no ratings, it returns null.
     * */
    public static javax.ws.rs.core.Response getRatingsForUser(String userId){
        try{
            List<Rating> ratingList = new ArrayList<>();
            for (Sight sight: sights) {
                List<Rating> ratings = sight.getRatingList().stream().filter(x->x.getCreator().equals(userId)).collect(Collectors.toList());

                for (Rating sightRating: ratings) {
                    sightRating.setSightId(sight.getUid());
                    sightRating.sightName = sight.getName();
                }
                ratingList.addAll(ratings);
            }
            return new ResponseHelper(Info.SUCCESS, "Ratings found", ratingList).build();
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage(),null).build();
        }
    }

    /**
     * Deletes a sight only if it exists. Otherwise, it will be refused.
     */
    public static javax.ws.rs.core.Response deleteSight(String sightId){
        try {
            WriteResult t = DatabaseAccess.deleteDocument("sight", sightId).get();
            Sight sightSearch = sights.stream().filter(x->x.getUid().equals(sightId)).collect(Collectors.toList()).stream().findFirst().get();

            if(sightSearch.equals(null)){
                return new ResponseHelper(Info.FAILURE, "Sight not found!").build();
            }
            for (Rating rating: sightSearch.getRatingList()) {
                deleteRating(rating.getUid());
            }
            sights.remove(sightSearch);
        } catch (Exception e) {
            return new ResponseHelper(Info.FAILURE, "An error occurred! " + e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS, "Sight deleted", sightId).build();
    }

    /***
     * Calculates the direct distance of two points via longitude and latitude.
     */
    public static double getDistanceFromLatLonInKm(double lat1, double lon1, double lat2, double lon2) {
        final double earthRadius = 6371;
        double dLat = deg2rad(lat2 - lat1);
        double dLon = deg2rad(lon2 - lon1);

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) *
                        Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    public static double deg2rad(double deg) {
        return Math.toRadians(deg);
    }
}
