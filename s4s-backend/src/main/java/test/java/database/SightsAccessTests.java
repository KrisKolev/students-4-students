package test.java.database;

import com.google.api.client.http.HttpStatusCodes;
import com.s4s.database.SightsAccess;
import com.s4s.database.model.Label;
import com.s4s.database.model.Rating;
import com.s4s.database.model.Sight;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.ws.rs.core.Response;
import java.util.*;
import java.util.concurrent.ExecutionException;

public class SightsAccessTests {

    @BeforeEach
    void SetUp() throws ExecutionException, InterruptedException {
        SightsAccess.createInstance();
    }

    @Test
    public void getSights_ReturnsSights(){
        List<Sight> allSights = SightsAccess.getSights();
        assert(allSights.size() > 0);
    }

    @Test
    public void addSight_WithValidSight_AddsSight(){
        Sight sight = getValidSight();
        List<Sight> before = SightsAccess.getSights();
        int sightNumberBefore = before.size();

        Response response = SightsAccess.addSights(sight, "5MMOO2DKV3R9jXaRts3IKnRnfpm2");

        List<Sight> after = SightsAccess.getSights();
        int sightNumberAfter = after.size();

        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
        assert(sightNumberAfter == sightNumberBefore+1);
    }

    @Test
    public void addLabel_WithValidLabel_AddsLabel(){
        Label label = getValidLabel();
        List<Label> before = SightsAccess.getLabels();
        int labelNumberBefore = before.size();

        Response response = SightsAccess.addLabel(label);

        List<Label> after = SightsAccess.getLabels();
        int labelNumberAfter = after.size();

        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
        assert(labelNumberAfter == labelNumberBefore+1);
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
        sight.setCreator("5MMOO2DKV3R9jXaRts3IKnRnfpm2");
        sight.setCreatedAt(new Date());
        sight.setUpdatedAt(new Date());
        sight.setAddress("MockupAddress MockupStreet, MockupCountry");
        return sight;
    }

    private Label getValidLabel(){
        Label label = new Label();
        label.setUid("5MMOO2DKV3R9jXaRts3IKnRnfpm2");
        label.setName("TestLabelName");
        label.setColor("Blue");
        label.setCreatedAt(new Date());
        label.setUpdatedAt(new Date());
        return label;
    }

}
