package com.s4s.database;

import com.s4s.database.model.Country;
import com.s4s.database.model.Label;
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
        }
        return instance;
    }

    public static javax.ws.rs.core.Response addSights(Sight sight){

        return new ResponseHelper(Info.SUCCESS,"Added sight").build();
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
            DatabaseAccess.saveOrInsertDocument(label);
            labels.add(label);
        }
        catch (Exception e){
            return new ResponseHelper(Info.FAILURE,"An error occurred! "+e.getMessage()).build();
        }
        return new ResponseHelper(Info.SUCCESS,label).build();
    }

    public static List<Sight> getSights() {
        return sights;
    }

}
