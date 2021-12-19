package com.s4s.controller;

import com.google.api.client.http.HttpStatusCodes;
import com.s4s.database.DatabaseAccess;
import com.s4s.database.SightsAccess;
import com.s4s.database.model.Label;
import com.s4s.database.model.Rating;
import com.s4s.endpoint.SightsEndpoint;
import javax.ws.rs.core.Response;
import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SightsEndpointTests {

    private SightsEndpoint _sut = new SightsEndpoint();

    @BeforeEach
    void SetUp() throws ExecutionException, InterruptedException {
        DatabaseAccess.createInstance();
        SightsAccess.createInstance();
    }

    @Test
    public void getLabels_ReturnsNoLabels(){
        Response response = _sut.getLabels();
        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
    }

    @Test
    public void addLabels_AddsLabel(){

        Optional<Label> deleteLabel = SightsAccess.getLabels().stream().filter(x->x.getName().equals(getValidLabel().getName())).findFirst();
        if (deleteLabel.isPresent()){
            SightsAccess.deleteLabel(deleteLabel.get());
        }
        Response response = _sut.addLabel(getValidLabel());
        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);

        Optional<Label> cleanupLabel = SightsAccess.getLabels().stream().filter(x->x.getName().equals(getValidLabel().getName())).findFirst();
        if (deleteLabel.isPresent()){
            SightsAccess.deleteLabel(cleanupLabel.get());
        }

    }

    private Label getValidLabel(){
        Label label =  new Label();
        label.setUid("UserID");
        label.setName("Max Mustermann");
        label.setColor("Grey");
        label.setCreatedAt(new Date());
        label.setCreatedAt(new Date());
        return label;
    }
}
