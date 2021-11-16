/**
 * Model for a rating
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class Rating {
    uid: string;
    rating: number;
    comment: string = "";
    imageNames: string[] = []
    createdAt:string;
    updatedAt:string;
    imageUrl: string[] = []
}