package com.s4s.database.model;

public class SortedSight {
    private final double averageRating;
    private Sight sight;

    public SortedSight(Sight sight) {

        double allRatings = 0;

        for (String rating : sight.getRatingAssigned()) {
            allRatings += Double.parseDouble(rating);
        }

        averageRating = allRatings / sight.getRatingList().size();
    }

    public double getAverageRating() {
        return averageRating;
    }
}