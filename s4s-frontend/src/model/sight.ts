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

    public InitSight(sight:any){
        this.uid = sight.uid;
        this.name = sight.name;
        this.longitude = sight.longitude;
        this.latitude = sight.latitude;
        this.address = sight.address;

        sight.ratingList.forEach(rating => {
            const newRating = new Rating();
            try {
                newRating.InitRating(rating);
            } catch {
            }
            this.ratingList.push(newRating);
        })

        sight.labelList.forEach(label => {
            const newLabel = new Label();
            try {
                newLabel.uid = label.uid;
                newLabel.name = label.name;
                newLabel.color = label.color;
            } catch {
            }
            this.labelList.push(newLabel)
        })
    }

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

        this.onInitBase();

        if(distance>filterRadius || minimumRating>this.overallRating || maximumRating<this.overallRating){
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }

    }

    onInitBase(){

        var allRatings=0;
        this.ratingList.forEach((rat)=>{
            allRatings = allRatings + Number.parseFloat(rat.rating.toString());
        })

        if(this.ratingList.length >0){
            this.overallRating = allRatings / this.ratingList.length;
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