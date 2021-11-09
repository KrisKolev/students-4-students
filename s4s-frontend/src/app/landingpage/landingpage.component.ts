import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {GoogleMap} from "@angular/google-maps";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  animations:[
      trigger('showTopLocationsList', [
        state('open', style({
          opacity: 1
        })),
        state('closed',   style({
          opacity: 0
        })),
        transition('open => closed', animate('750ms ease-out')),
        transition('closed => open', animate('750ms ease-in'))
      ]),
    trigger('extendLocations', [
      state('open', style({
        width: '100%',
        opacity: 1,
      })),
      state('closed', style({
        width: '0px',
        opacity: 0,
      })),
      transition('* => *', [
        animate('0.75s')
      ])
    ]),
    trigger('extendMap', [
      state('open', style({
        width: '100%',
      })),
      state('closed', style({
        width: '75%',
      })),
      transition('* => *', [
        animate('0.75s')
      ])
    ])]
})

export class LandingpageComponent implements OnInit {
  /**
   * HTML element of the google maps object.
   */
  @ViewChild('googleMap', { static: false }) map: GoogleMap
  /**
   * HTML element of the address search bar.
   */
  @ViewChild('addressSearch') public searchElementRef: ElementRef;

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
    zoom:15
  }
  /**
   * Current map markers for the google maps object.
   */
  mapMarkers = []
  /**
   * Defines all markers for existing sights
   */
  mapMarkersSights = []



  title = 'Locations';


  images = [
    {title: 'First Location', short: 'First Locations Short', src:  "./assets/images/1.jpg" },
    {title: 'Second Location', short: 'Second Locations Short', src: "./assets/images/2.jpg"},
    {title: 'Third Location', short: 'Third Locations Short', src: "./assets/images/3.jpg"}
  ];

  toggleTopLocationsText = "";

  isTopLocationsVisible = false;
  initialVisibility = false;

  constructor(config: NgbCarouselConfig) {
    config.interval = 2000;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    this.toggleTopLocationsText = "Show top locations in my area"
    this.initMap();
  }

  /**
   * Resets the map to the user location.
   */
  onGoToLocation() {
    this.initMap();
  }

  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
  }

  /**
   * Initializes the map object.
   */
  initMap(){
    navigator.geolocation.getCurrentPosition((position) => {

      this.mapMarkers.pop();

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
    });
  }

  onToggleTopLocations() {
    if(!this.initialVisibility)
    {
      this.initialVisibility = true;
    }
    this.isTopLocationsVisible = !this.isTopLocationsVisible;

    if(this.isTopLocationsVisible){
      this.toggleTopLocationsText = "Hide Top Locations"
    }
    else{
      this.toggleTopLocationsText = "Show top locations in my area"
    }
  }
}
