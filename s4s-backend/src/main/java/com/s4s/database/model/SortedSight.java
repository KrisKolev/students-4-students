package com.s4s.database.model;

public class SortedSight {
    private final double averageRating;
    private Sight sight;

    public SortedSight(Sight sight) {

        double allRatings = 0;

        for (Rating rating : sight.getRatingList()) {
            allRatings += Double.parseDouble(rating.getRating());
        }
        this.sight = sight;
        averageRating = allRatings / sight.getRatingList().size();
    }

    public double getAverageRating() {
        return averageRating;
    }

    public Sight getSight(){
        return sight;
    }
}