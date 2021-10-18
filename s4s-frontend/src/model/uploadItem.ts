/**
 * Model for an upload item.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class UploadItem {
    name: string;
    filePath: string;
    file:File;
    progress: number
}

/**
 * Model for an upload response.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class UploadResponse {
    name: string;
    filePath: string;
    finished:boolean;
    hasErrors:boolean;
    response:string
}