package com.s4s.database;

import com.google.api.client.http.HttpStatusCodes;
import com.s4s.database.model.Label;
import com.s4s.database.model.Rating;
import com.s4s.database.model.Sight;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;

import javax.ws.rs.core.Response;
import java.io.Console;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@SpringBootTest
public class SightsAccessTests {

    private String USER_ID = "TestUserDoNotDeletexCP3QCAGe1IqO";

    @BeforeEach
    void SetUp() throws ExecutionException, InterruptedException {
        DatabaseAccess.createInstance();
        SightsAccess.createInstance();
    }


    @Test
    public void getSights_ReturnsSights() throws ExecutionException, InterruptedException {
        List<Sight> allSights = SightsAccess.getSights();
        assert(allSights.size() > 0);
    }

    @Test
    public void addSight_WithValidSight_AddsSight(){

        Optional<Sight> sight = SightsAccess.getSights().stream().filter(x->x.getName().equals("NewSight")).findFirst();

        if(sight.isPresent()){
            Sight deleteSight = sight.get();
            deleteSight(deleteSight);
        }

        Sight sightToAdd = getValidSight();
        List<Sight> before = SightsAccess.getSights();
        int sightNumberBefore = before.size();

        Response response = SightsAccess.addSights(sightToAdd, USER_ID);

        List<Sight> after = SightsAccess.getSights();
        int sightNumberAfter = after.size();

        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
        assert(sightNumberAfter == sightNumberBefore+1);

        deleteSight(sightToAdd);
    }

    @Test
    public void deleteSight_WithValidSight_DeletesSight(){
        int sightNumberBefore = CreateSightAndDeleteAfterwards();
        List<Sight> afterDelete = SightsAccess.getSights();
        int sightNumberAfterDelete = afterDelete.size();

        assert(sightNumberAfterDelete == sightNumberBefore);
    }

    private int CreateSightAndDeleteAfterwards() {
        Sight sightToAddAndDelete = getValidSight();
        List<Sight> before = SightsAccess.getSights();
        int sightNumberBefore = before.size();

        Response response = SightsAccess.addSights(sightToAddAndDelete, USER_ID);

        List<Sight> after = SightsAccess.getSights();
        int sightNumberAfter = after.size();

        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
        assert(sightNumberAfter == sightNumberBefore+1);

        SightsAccess.deleteSight(sightToAddAndDelete.getUid());
        return sightNumberBefore;
    }

    @Test
    public void addLabel_WithValidLabel_AddsLabel(){
        Label label = getValidLabel();
        Optional<Label> deleteLabel = SightsAccess.getLabels().stream().filter(x->x.getName().equals(getValidLabel().getName())).findFirst();
        if (deleteLabel.isPresent()){
            SightsAccess.deleteLabel(deleteLabel.get());
        }

        Response response = SightsAccess.addLabel(label);
        Optional writtenValueAfter = SightsAccess.getLabels().stream().filter(x->x.getName().equals(label.getName())).findFirst();

        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
        assert(writtenValueAfter.isPresent());

        Optional<Label> cleanupLabel = SightsAccess.getLabels().stream().filter(x->x.getName().equals(getValidLabel().getName())).findFirst();
        if (deleteLabel.isPresent()){
            SightsAccess.deleteLabel(cleanupLabel.get());
        }

    }

    private Sight getValidSight(){
        Sight sight = new Sight();
        sight.setUid("UserID");
        sight.setName("NewSight");
        sight.setLatitude("MockupLatitude");
        sight.setLongitude("MockupLongitude");
        List<Label> labelList = new ArrayList<Label>();
        labelList.add(getValidLabel());
        sight.setLabelList(labelList);
        List<Rating> ratingList = new ArrayList<Rating>();
        sight.setRatingList(ratingList);
        sight.setCreator(USER_ID);
        sight.setCreatedAt(new Date());
        sight.setUpdatedAt(new Date());
        sight.setAddress("MockupAddress MockupStreet, MockupCountry");
        return sight;
    }

    private Label getValidLabel(){
        Label label = new Label();
        label.setUid(USER_ID);
        label.setName("TestLabelName");
        label.setColor("Blue");
        label.setCreatedAt(new Date());
        label.setUpdatedAt(new Date());
        return label;
    }

    private void deleteSight(Sight sight){
        SightsAccess.deleteSight(sight.getUid());
    }

}
