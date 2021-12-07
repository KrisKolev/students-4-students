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
    creator:String;
    updatedAt:string;
    imageUrl: string[] = []
    sightId: string;
    sightName: string;

    public InitRating(rating:any){
        this.uid = rating.uid;
        this.rating = rating.rating;
        this.comment = rating.comment;
        this.sightId = rating.sightId;
        this.sightName = rating.sightName;
        var images = [];
        rating.imageNames.forEach(rat => {
            images.push(rat)
        })
        this.imageNames = images;

        this.creator = rating.creatorNickName;

        if(rating.createdAt!=undefined){
            this.createdAt = rating.createdAtString;
        }
    }
}