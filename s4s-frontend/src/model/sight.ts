import {Label} from "./label";
import {Rating} from "./rating";

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
