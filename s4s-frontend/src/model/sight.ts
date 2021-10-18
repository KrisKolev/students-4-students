import {Label} from "./label";
import {Rating} from "./rating";

/**
 * Model for a sight
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class Sight {
    uid: string;
    name: string;
    address: string;
    country: string;
    city: string;

    latitude: string;
    longitude: string;

    labelList: Label[] = [];
    ratingList: Rating[] = [];

    createdAt:string;
    updatedAt:string;
}
