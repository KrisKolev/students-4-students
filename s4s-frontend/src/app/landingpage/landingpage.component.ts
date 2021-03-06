import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {GoogleMap} from "@angular/google-maps";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {LocationService} from "../../service/http/backend/locations";
import {UserAuthService} from "../../service/userAuthService";
import {GeoLocationService} from "../../service/http/external/geoLocation.service";
import {SightsService} from "../../service/http/backend/sights";
import {MatDialog} from "@angular/material/dialog";
import {FirebaseService} from "../../service/http/external/firebase.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Label} from "../../model/label";
import {map, startWith} from "rxjs/operators";
import {CreateLocationSight, Sight, SightTopLocation} from "../../model/sight";
import {Rating} from "../../model/rating";
import {Observable} from "rxjs";
import {SightDetailComponent} from "./components/sight-detail/sight-detail.component";
import TravelMode = google.maps.TravelMode;
import {resolve} from "path";

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss'],
    animations: [
        trigger('extendLocations', [
            state('open', style({
                left: '0',
                opacity: 1
            })),
            state('closed', style({
                left: '-100%',
                opacity: 0
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]),
        trigger('extendMap', [
            state('open', style({
                left: '0',
            })),
            state('closed', style({
                left: '500px',
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]),
        trigger('moveMapButtons', [
            state('open', style({
                left: '550px',
            })),
            state('closed', style({
                left: '20px',
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]), trigger('moveLocationButton', [
            state('open', style({
                opacity: 0,
                zIndex: '-1'
            })),
            state('closed', style({
                opacity: 1,
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]), trigger('moveSightsDetailsContainer', [
            state('open', style({
                left: '0',
                opacity: 1
            })),
            state('closed', style({
                left: '-100%',
                opacity: 0
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]), trigger('moveFilterButtonContainer', [
            state('open', style({
                left: '550px',
                top: '200px',
                zIndex: 10
            })),
            state('closed', style({
                opacity: 0,
                left: '0px'
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]), trigger('visibilityAnimationContainer', [
            state('open', style({
                opacity: 1,
                zIndex: 9
            })),
            state('closed', style({
                opacity: 0,
                zIndex: -1
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]), trigger('routeContainerVisibility', [
            state('open', style({
                opacity: 1,
                right: '80px'
            })),
            state('closed', style({
                opacity: 0,
                right: '-300px'
            })),
            transition('* => *', [
                animate('0.25s')
            ])
        ]),]
})

export class LandingpageComponent implements OnInit {
    /**
     * HTML element of the google maps object.
     */
    @ViewChild('googleMap', {static: false}) map: GoogleMap
    /**
     * HTML element of the address search bar and then for the sight search of the same bar.
     */
    @ViewChild('addressSearch') public searchElementRef: ElementRef;
    @ViewChild('sightSearch') sightSearch: ElementRef<HTMLInputElement>;
    @ViewChild('sightDetail') sightDetail: SightDetailComponent;

    /**
     * Sight form with all data.
     */
    addSightForm: FormGroup;

    /**
     * Zoom value for the map object
     */
    zoom = 15
    /**
     * Center to be displayed on the map object.
     */
    center: google.maps.LatLngLiteral
    /**
     * Options for the google maps control
     */
    options: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        maxZoom: 20,
        minZoom: 1,
        zoom: 15
    }
    /**
     * Current map markers for the google maps object.
     */
    mapMarkers = []
    /**
     * Defines all markers for existing sights
     */
    mapMarkersSights = []

    /**
     * Geocoder defined by the places API
     * @private
     */
    private geoCoder;

    /**
     * Longitude of the new sight
     */
    customLongitude: any;
    /**
     * Latitude of the new sight
     */
    customLatitude: any;
    /**
     * Address of the sight
     */
    addressValue: string = "";
    title = 'Locations';

    /**
     * All available labels.
     */
    allLabels: Label[] = [];
    /**
     * All available sights to be displayed.
     */
    allSights: Sight[] = [];

    /*sights which return on searching*/
    searchedSights: Observable<SightTopLocation[]>;
    /*formcontrol for the sight search*/
    sightSearchCtrl = new FormControl();


    allSightsSortedByDistance: SightTopLocation[] = [];

    isTopLocationsVisible = false;
    isAddSightVisible = false;
    initialVisibility = true;
    showSightsLocationLongitude: number;
    showSightsLocationLatitude: number;

    currentLocationAddress: string
    isSightDetailVisible: boolean = false;

    detailedSight: Sight = new Sight();

    myDirectionsRenderer: google.maps.DirectionsRenderer;
    directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();

    routeEnabled: boolean = false;

    isFilterVisible: boolean = false;

    filterDistanceValue: number = 20;
    filterModeValue: any;
    filterRatingSliderMinimumValue: any;
    filterRatingSliderMaximumValue: any;
    sightsDistanceCalculation: any;
    sightsDistanceCalculationMode: google.maps.TravelMode;


    routeMode: any;
    routeTravelMode: google.maps.TravelMode;

    routeStart: string;
    routeTarget: string;
    routeDistance: string;
    routeDuration: string

    constructor(config: NgbCarouselConfig,
                private locService: LocationService,
                private authService: UserAuthService,
                private geolocService: GeoLocationService,
                private ngZone: NgZone,
                private sightService: SightsService,
                private dialog: MatDialog,
                private firebaseService: FirebaseService) {
        config.interval = 2000;
        config.pauseOnHover = true
        this.filterRatingSliderMinimumValue = 1
        this.filterRatingSliderMaximumValue = 5
        this.filterModeValue = "distancedescending";
        this.routeMode = "walking"
        this.routeTravelMode = TravelMode.WALKING
        this.sightsDistanceCalculation = "walking"
        this.sightsDistanceCalculationMode = TravelMode.WALKING;
    }

    ngOnInit(): void {
        this.onLoadLabels();
        this.onLoadSights();
        this.initMap();
    }

    /**
     * Fired when the view is initialized. Sets the autocomplete object and initializes google places.
     */
    ngAfterViewInit() {

        this.myDirectionsRenderer = new google.maps.DirectionsRenderer();

        try {
            this.myDirectionsRenderer.setMap(this.map.googleMap);
        } catch (e) {
            var m = e;
        }

        this.geoCoder = new google.maps.Geocoder;
        //this.directionsRenderer.setMap(this.map.control.getGMap());

        //var myMap = (document.getElementById('landingPage_Map')) as google.maps.Map

        try {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.placeCustomMarker(place.geometry.location.lat(), place.geometry.location.lng())
                    this.zoom = 19;
                    this.center = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    }

                    this.showSightsLocationLongitude = place.geometry.location.lng()
                    this.showSightsLocationLatitude = place.geometry.location.lat()


                    this.isTopLocationsVisible = true;
                    this.onToggleTopLocations(true)

                    this.onFilterTopLocations();
                });
            });

        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Places a custom marker on the given coordinates.
     * @param latitude
     * @param longitude
     */
    placeCustomMarker(latitude: number, longitude: number) {
        if (this.mapMarkers.length > 1) {
            this.mapMarkers.splice(1, this.mapMarkers.length - 1)
        }

        const marker = new google.maps.Marker({
            position: {
                lat: latitude,
                lng: longitude,
            },
            title: ``,
            label: ``,
            optimized: false
        });

        this.customLatitude = latitude;
        this.customLongitude = longitude;
        this.getAddress(latitude, longitude);
        this.mapMarkers.push(marker);
    }

    /**
     * Calculates an address by longitude and latitude.
     * @param latitude
     * @param longitude
     */
    getAddress(latitude, longitude) {
        this.geoCoder.geocode({'location': {lat: latitude, lng: longitude}}, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 16;
                    this.addressValue = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    /**
     * Resets the map to the user location.
     */
    onGoToLocation() {
        if (this.isTopLocationsVisible) {
            this.isTopLocationsVisible = false;
        }
        this.initMap();
    }

    onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    }

    /**
     * Initializes the map and sets the current position
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    initMap() {
        navigator.geolocation.getCurrentPosition((position) => {

            this.mapMarkers.pop();

            this.showSightsLocationLongitude = position.coords.longitude
            this.showSightsLocationLatitude = position.coords.latitude

            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }
            const marker = new google.maps.Marker({
                position: {
                    lat: this.center.lat,
                    lng: this.center.lng,
                },
                title: `Your position`,
                label: `P`,
                optimized: false
            });

            this.mapMarkers.push(marker)
            this.onToggleTopLocations(false);
        });
    }

    /**
     * Centers at the current reference point
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    goToSelectedReferencePoint() {
        this.center = {
            lat: this.showSightsLocationLatitude,
            lng: this.showSightsLocationLongitude,
        }
    }

    /**
     * Shows or hides the top location container
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    onToggleTopLocations(keepVisibility: boolean) {
        if (!this.initialVisibility) {
            this.initialVisibility = false;
        }
        if (!keepVisibility) {
            this.isTopLocationsVisible = !this.isTopLocationsVisible;
        }
        this.onFilterTopLocations();

        if (this.isTopLocationsVisible) {
        } else {
            this.isFilterVisible = false;
        }
    }

    /**
     * Loads all labels from the database.
     */
    onLoadLabels() {
        this.sightService.getLabels().subscribe((val) => {
            const pulledLabels = [];
            // @ts-ignore
            const lab = val.data as Array;
            lab.forEach(ob => {
                const newLabel = new Label();
                newLabel.name = ob.name;
                newLabel.uid = ob.uid;
                newLabel.color = ob.color;
                pulledLabels.push(newLabel)
            })
            this.allLabels = pulledLabels;
            //this.allLabelsObjects = pulledLabels;

        });

    }

    /**
     * Loads all sights from the database
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    onLoadSights() {
        this.sightService.getSights().subscribe((val) => {
            const pulledSights = [];
            // @ts-ignore
            const sights = val.data as Array;
            sights.forEach(sight => {
                const newSight = new Sight();
                newSight.InitSight(sight);
                pulledSights.push(newSight);
            })

            this.allSights = pulledSights;
            this.allSights.forEach((sight) => {

                const svgMarker = {
                    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                    fillColor: "blue",
                    fillOpacity: 0.6,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 2,
                    anchor: new google.maps.Point(15, 30),
                };

                const existingMarker = new google.maps.Marker({
                    position: {
                        lat: Number.parseFloat(sight.latitude),
                        lng: Number.parseFloat(sight.longitude),
                    },
                    title: sight.address,
                    label: {
                        text: sight.name,
                        color: "blue",
                        fontSize: "20px"
                    },
                    icon: svgMarker,
                    optimized: false,

                })
                this.mapMarkersSights.push(existingMarker)
            })

            this.onFilterTopLocations();

            this.searchedSights = this.sightSearchCtrl.valueChanges.pipe(
                startWith(null),
                map((val: String | null) => val ? this._filterSights(val) : []));
        })
    }

    /**
     * Filters sights based on the data set from filter.
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    private _filterSights(value: String): SightTopLocation[] {
        if (typeof value === 'string' || value instanceof String) {

            if (value == '')
                return [];

            const filterValue = value.toLowerCase();

            return this.allSightsSortedByDistance.filter(sight => sight.name.toLowerCase().includes(filterValue) || sight.labelList.some(label => label.name.toLowerCase().includes(filterValue)));
        }
    }

    /**
     * Filters and calculates distances for sights.
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    async onFilterTopLocations() {
        this.allSightsSortedByDistance = [];
        this.myDirectionsRenderer.setDirections(new class implements google.maps.DirectionsResult {
            geocoded_waypoints: google.maps.DirectionsGeocodedWaypoint[] = [];
            routes: google.maps.DirectionsRoute[] = [];
        })
        this.routeEnabled = false;
        this.goToSelectedReferencePoint();

        var tempSightList = [];

        if (this.showSightsLocationLatitude == undefined || this.showSightsLocationLongitude == undefined)
            return;

        this.allSights.forEach((sight) => {
            tempSightList.push(CreateLocationSight(sight))
        })

        const matrix = new google.maps.DistanceMatrixService();
        var destinationList = [];
        tempSightList.forEach(sight => {
            destinationList.push({lat: Number.parseFloat(sight.latitude), lng: Number.parseFloat(sight.longitude)})
        })


        let request = {
            origins: [{lat: this.showSightsLocationLatitude, lng: this.showSightsLocationLongitude}],
            destinations: destinationList,
            travelMode: this.sightsDistanceCalculationMode,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        }
    matrix.getDistanceMatrix(request,response => {
      for(var i = 0;i<tempSightList.length;i++){
        try {
          tempSightList[i].timeToTarget = response.rows[0].elements[i].duration.text;
          tempSightList[i].onInit(response.rows[0].elements[i].distance.value/1000,
              this.filterDistanceValue,this.filterRatingSliderMinimumValue,this.filterRatingSliderMaximumValue)
            this.firebaseService.getSightImageUrls(tempSightList[i]).then(async ()=>{
                //necessary to update bindings and show images in frontend
                let htmlElement: HTMLElement = document.getElementById("addressElement");
                htmlElement.click();
            });

        }
        catch (e) {
          tempSightList[i].timeToTarget = "no route found";
          var distance = getDistanceFromLatLonInKm(this.showSightsLocationLatitude,this.showSightsLocationLongitude,Number.parseFloat(tempSightList[i].latitude),Number.parseFloat(tempSightList[i].longitude))
          tempSightList[i].onInit(distance,
              this.filterDistanceValue,this.filterRatingSliderMinimumValue,this.filterRatingSliderMaximumValue)
        }

      }

      if(this.filterModeValue === "distancedescending"){
        this.allSightsSortedByDistance = tempSightList.filter(x=>x.isVisible).sort((first, second) => (first.relativeDistance > second.relativeDistance ? 1 : -1))
      }
      if(this.filterModeValue === "distanceascending"){
        this.allSightsSortedByDistance = tempSightList.filter(x=>x.isVisible).sort((first, second) => (first.relativeDistance < second.relativeDistance ? 1 : -1))
      }
      if(this.filterModeValue === "ratingsdescending"){
        this.allSightsSortedByDistance = tempSightList.filter(x=>x.isVisible).sort((first, second) => (first.overallRating < second.overallRating ? 1 : -1))
      }
      if(this.filterModeValue === "ratingsascending"){
        this.allSightsSortedByDistance = tempSightList.filter(x=>x.isVisible).sort((first, second) => (first.overallRating > second.overallRating ? 1 : -1))
      }

            this.mapMarkersSights = [];
            this.allSightsSortedByDistance.forEach((sight) => {

                sight.headerExpanded = true;
                const svgMarker = {
                    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                    fillColor: "blue",
                    fillOpacity: 0.6,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 2,
                    anchor: new google.maps.Point(15, 30),
                };

                const existingMarker = new google.maps.Marker({
                    position: {
                        lat: Number.parseFloat(sight.latitude),
                        lng: Number.parseFloat(sight.longitude),
                    },
                    title: sight.address,
                    label: {
                        text: sight.name,
                        color: "blue",
                        fontSize: "20px"
                    },
                    icon: svgMarker,
                    optimized: false,

                })
                this.mapMarkersSights.push(existingMarker)
            })

        })
    }

    /**
     * Centers a sight on the map and opens its details
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    onGoToSight(sight: SightTopLocation) {
        this.detailedSight = sight as Sight;
        this.sightDetail.sight = sight;
        this.sightDetail.onInitDetails();
        this.initMapWithPosition(Number.parseFloat(sight.latitude), Number.parseFloat(sight.longitude), this.zoom)
        this.onOpenSightDetails();
    }

    /**
     * Inits the map location with specific coordinates and map zoom.
     * @param latidute
     * @param longitude
     * @param zoom
     */
    initMapWithPosition(latidute: number, longitude: number, zoom: number) {
        this.center = {
            lat: latidute,
            lng: longitude,
        }
        this.zoom = zoom;
    }

    onCloseSightDetail() {
        this.isSightDetailVisible = false;
    }

    /**
     * opens the sight details small card
     * **/
    onOpenSightDetails() {
        this.isSightDetailVisible = true;
    }

    showDetailsOfMarker(marker: any) {
        const sight = this.allSightsSortedByDistance.find(x => x.name == marker.getLabel().text && x.address == marker.getTitle())
        this.onGoToSight(sight);
    }

    onSearchSelectItem(sight: SightTopLocation) {
        this.onGoToSight(sight);
        this.addressValue = "";
        this.sightSearchCtrl.setValue("");
        this.searchedSights = this.sightSearchCtrl.valueChanges.pipe(
            startWith(null),
            map((val: String | null) => val ? this._filterSights(val) : []));

        let htmlElement: HTMLElement = document.getElementById("landingPage_Map");
        htmlElement.click();
    }

    /**
     * Calculates a route from the reference point to a selected sight.
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    calcRoute(sight: SightTopLocation) {
        this.lastRouteTopSight = sight;
        var request = {
            origin: new google.maps.LatLng({
                lat: this.showSightsLocationLatitude,
                lng: this.showSightsLocationLongitude
            }),
            destination: new google.maps.LatLng({
                lat: Number.parseFloat(sight.latitude),
                lng: Number.parseFloat(sight.longitude)
            }),
            travelMode: this.routeTravelMode
        };

        this.geoCoder.geocode({
            'location': {
                lat: this.showSightsLocationLatitude,
                lng: this.showSightsLocationLongitude
            }
        }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.routeStart = results[0].formatted_address;
                } else {
                    this.routeStart = "no address found"
                }
            } else {
                this.routeStart = "no address found"
            }
        });
        this.geoCoder.geocode({
            'location': {
                lat: Number.parseFloat(sight.latitude),
                lng: Number.parseFloat(sight.longitude)
            }
        }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.routeTarget = results[0].formatted_address;
                } else {
                    this.routeTarget = "no address found"
                }
            } else {
                this.routeTarget = "no address found"
            }
        });

        //this.myDirectionsRenderer.setMap(this.map.control.getGMap());
        this.directionsService.route(request, (result, status) => {
            if (status == 'OK') {
                try {
                    this.myDirectionsRenderer.setDirections(result);

                    let matrix = new google.maps.DistanceMatrixService();
                    let requestDist = {
                        origins: [{lat: this.showSightsLocationLatitude, lng: this.showSightsLocationLongitude}],
                        destinations: [{
                            lat: Number.parseFloat(sight.latitude),
                            lng: Number.parseFloat(sight.longitude)
                        }],
                        travelMode: this.routeTravelMode,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false,
                    };

                    matrix.getDistanceMatrix(requestDist, response => {
                        try {
                            this.routeDuration = response.rows[0].elements[0].duration.text;
                            let dist = "";
                            if (response.rows[0].elements[0].distance.value / 1000 < 1) {
                                dist = (Number((response.rows[0].elements[0].distance.value / 1000).toFixed(3)) * 1000).toString() + " m away"
                            } else {
                                dist = (Number((response.rows[0].elements[0].distance.value / 1000).toFixed(2))).toString() + " km away"
                            }
                            this.routeDistance = dist;
                        } catch (e) {
                            this.routeDuration = "no route found";
                            this.routeDistance = (getDistanceFromLatLonInKm(this.showSightsLocationLatitude, this.showSightsLocationLongitude,
                                Number.parseFloat(sight.latitude), Number.parseFloat(sight.longitude))).toString()
                        }
                    })


                    this.routeEnabled = true;
                } catch (e) {
                    var t = e;
                }
            } else {
            }
        });
    }

    lastRouteTopSight: SightTopLocation;

    /**
     * Clears the current route.
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    onClearRoutes() {

        this.myDirectionsRenderer.setDirections(new class implements google.maps.DirectionsResult {
            geocoded_waypoints: google.maps.DirectionsGeocodedWaypoint[] = [];
            routes: google.maps.DirectionsRoute[] = [];
        })

        this.goToSelectedReferencePoint();

        this.routeEnabled = false;
    }

    /**
     * Opens the filter options
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    onShowFilter() {
        this.isFilterVisible = !this.isFilterVisible;
    }

    /**
     * Applies the filter values and sorts the sights accordingly
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    onApplyFilter(radiusInput: HTMLInputElement) {
        this.filterDistanceValue = Number.parseFloat(radiusInput.value)

        if (this.sightsDistanceCalculation === "walking") {
            this.sightsDistanceCalculationMode = TravelMode.WALKING;
        }
        if (this.sightsDistanceCalculation === "bicycle") {
            this.sightsDistanceCalculationMode = TravelMode.BICYCLING;
        }
        if (this.sightsDistanceCalculation === "transit") {
            this.sightsDistanceCalculationMode = TravelMode.TRANSIT;
        }
        if (this.sightsDistanceCalculation === "driving") {
            this.sightsDistanceCalculationMode = TravelMode.DRIVING;
        }

        this.onFilterTopLocations().then();
    }

    formatLabel(value: number) {
        return value;
    }

    /**
     * Applies the route mode selected by the user
     * Component written by Michael Fahrafellner
     * creation date: 07.12.2021
     * last change done by: Michael Fahrafellner
     */
    onApplyRouteMode() {
        if (this.routeMode === "walking") {
            this.routeTravelMode = TravelMode.WALKING;
        }
        if (this.routeMode === "bicycle") {
            this.routeTravelMode = TravelMode.BICYCLING;
        }
        if (this.routeMode === "transit") {
            this.routeTravelMode = TravelMode.TRANSIT;
        }
        if (this.routeMode === "driving") {
            this.routeTravelMode = TravelMode.DRIVING;
        }

        this.calcRoute(this.lastRouteTopSight);
    }

    onCloseDialog() {
        this.onLoadSights()
    }
}

/**
 * Calculates the distance between 2 points  using the ???Haversine??? formula.
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * Function written by Michael Fahrafellner
 * creation date: 10.11.2021
 * last change done by: Michael Fahrafellner
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  } );
}