package com.s4s.database;

import com.google.cloud.firestore.DocumentReference;
import com.s4s.database.model.Country;
import com.s4s.database.model.Label;
import com.s4s.database.model.Rating;
import com.s4s.database.model.Sight;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

public class SightsAccess {

    private static SightsAccess instance;
    private static List<Sight> sights = new ArrayList<>();
    private static List<Label> labels = new ArrayList<>();


    public static SightsAccess createInstance() throws ExecutionException, InterruptedException {
        if (instance == null) {
            instance = new SightsAccess();
            labels = DatabaseAccess.retrieveAllDocuments(Label.class);
            sights = DatabaseAccess.retrieveAllDocuments(Sight.class);
        }
        return instance;
    }

    public static javax.ws.rs.core.Response addSights(Sight sight){
        try{
            sights = SightsAccess.getSights();

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

            labels = getLabels();
            for (Label x : labels) {
                if (!labels.contains(x)) {
                    addLabel(x);
                }
            }

            for (Rating rating:sight.getRatingList()) {
                addRating(rating);
            }

            DocumentReference writeResult = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(sight.getClass()),sight);
            sight.setUid(writeResult.getId());
            DatabaseAccess.UpdateUidOfDocument("sight",sight.getUid(),sight.getUid());
            sights = DatabaseAccess.retrieveAllDocuments(Sight.class);
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE,"Sight could not be added! "+e.getMessage(),sight).build();
        }
        return new ResponseHelper(Info.SUCCESS,"Added sight",sight).build();
    }

    public static List<Label> getLabels(){
        return labels;
    }

    public static javax.ws.rs.core.Response addLabel(Label label){
        List<Label> labelSearch = labels.stream().filter(x->x.getName().equals(label.getName()))
                .collect(Collectors.toList());
        if(!labelSearch.isEmpty())
            return new ResponseHelper(Info.FAILURE,"Label already exists!").build();

        try{
            DocumentReference ref = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(label.getClass()),label);
            label.setUid(ref.getId());
            DatabaseAccess.UpdateUidOfDocument("label",label.getUid(),label.getUid());
            labels = DatabaseAccess.retrieveAllDocuments(Label.class);
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE,"An error occurred! "+e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS,label).build();
    }

    public static List<Sight> getSights() {
        return sights;
    }

    public static javax.ws.rs.core.Response addRating(Rating rating){
        try{
            DocumentReference ref = DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(rating.getClass()),rating);
            rating.setUid(ref.getId());
            DatabaseAccess.UpdateUidOfDocument("rating",rating.getUid(),rating.getUid());
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE,"An error occurred! "+e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS,"Rating added",rating).build();
    }
}
