package test.java.controller;

import com.google.api.client.http.HttpStatusCodes;
import com.s4s.database.model.Label;
import com.s4s.endpoint.SightsEndpoint;
import org.junit.jupiter.api.Test;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Date;

public class SightsEndpointTests {

    private SightsEndpoint _sut = new SightsEndpoint();

    @Test
    public void getLabels_ReturnsNoLabels(){
        Response response = _sut.getLabels();
        assert(1 == 2);
    }

    @Test
    public void addLabels_AddsLabel(){
        _sut.addLabel(getValidLabel());
        Response response = _sut.getLabels();

        Object abc = response.getEntity();

        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
        ArrayList<String> responseEntity = (ArrayList<String>) response.getEntity();
        assert(responseEntity.size() > 0);
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
