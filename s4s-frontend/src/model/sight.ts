import {Label} from "./label";
import {Rating} from "./rating";
import {coerceNumberProperty} from "@angular/cdk/coercion";
import {relativePathBetween} from "@angular/compiler-cli/src/ngtsc/util/src/path";

/**
 * Model for a sight
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class Sight {
    constructor() {
        this.ratingList = [];
        this.labelList = [];
    }

    uid: string;
    name: string;
    address: string;
    country: string;
    city: string;

    latitude: string;
    longitude: string;

    labelList: Label[] = [];
    ratingList: Rating[] = [];

    creator:string;
    createdAt:string;
    updatedAt:string;
}

export class SightTopLocation extends Sight{
    relativeDistance: number;
    showDistanceString: string;
    overallRating: number;
    timeToTarget: string;
    allImageUrl: string[] = [];
    headerExpanded: boolean = false;
    isVisible: boolean = true;

    onInit(distance:number, filterRadius:number,minimumRating:number,maximumRating:number){
        this.relativeDistance = distance;

        if(distance<1){
            this.showDistanceString = (Number(distance.toFixed(3))*1000).toString() + " m away"
        }
        else{
            this.showDistanceString = (Number(distance.toFixed(2))).toString() + " km away"
        }

        var allRatings=0;
        this.ratingList.forEach((rat)=>{
            allRatings += rat.rating;
        })

        if(this.ratingList.length >0){
            this.overallRating = allRatings / this.ratingList.length;
        }

        if(distance>filterRadius || minimumRating>this.overallRating || maximumRating<this.overallRating){
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }

    }
}

export function CreateLocationSight(oldSight:Sight){
    var newSight = new SightTopLocation();

    newSight.uid = oldSight.uid;
    newSight.name = oldSight.name;
    newSight.address = oldSight.address;
    newSight.country = oldSight.country;
    newSight.city = oldSight.city;
    newSight.latitude = oldSight.latitude;
    newSight.longitude = oldSight.longitude;
    newSight.createdAt = oldSight.createdAt;
    newSight.updatedAt = oldSight.updatedAt;

    newSight.labelList = oldSight.labelList;
    newSight.ratingList = oldSight.ratingList;

    return newSight;

}