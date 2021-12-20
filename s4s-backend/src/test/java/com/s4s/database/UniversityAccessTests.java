package com.s4s.database;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UniversityAccessTests {

    @Test
    public void isValidEmailDomain_WithValidEmailDomain_ReturnsValid(){
        String validEmail = "max.mustermann@technikum-wien.at";
        boolean isValid = UniversityAccess.isValidEmailDomain(validEmail);
        assert(isValid);
    }

    @Test
    public void isValidEmailDomain_With_InTheBeginning_ReturnsValid(){
        String validEmail = "__max.mustermann@technikum-wien.at";
        boolean isValid = UniversityAccess.isValidEmailDomain(validEmail);
        assert(isValid);
    }

    @Test
    public void isValidEmailDomain_WithUppercaseAtTheBeginning_ReturnsInValid(){
        String validEmail = "Max.mustermann@technikum-wien.at";
        boolean isValid = UniversityAccess.isValidEmailDomain(validEmail);
        assert(!isValid);
    }

    @Test
    public void isValidEmailDomain_WithInValidEmailDomain_ReturnsValid(){
        String validEmail = "InvalidEmailAddress";
        boolean isValid = UniversityAccess.isValidEmailDomain(validEmail);
        assert(!isValid);
    }

    @Test
    public void isValidEmailDomain_WithInValidStartOfEmail_ReturnsValid(){
        String validEmail = ".max.mustermann@technikum-wien.at";
        boolean isValid = UniversityAccess.isValidEmailDomain(validEmail);
        assert(!isValid);
    }
}
