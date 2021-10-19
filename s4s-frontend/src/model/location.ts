/**
 * Model for a country
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class Country {
    uid: string;
    name: string;
    longitude:string;
    latitude:string;
    cities:any[];
}

/**
 * Model for a city
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class City {
    uid: string;
    name: string;
    centerLongitude: string;
    centerLatitude: string;
}

