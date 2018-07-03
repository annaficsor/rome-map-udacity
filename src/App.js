import React, { Component } from 'react';
import './App.css';
import locations from './locations.json'
import mapStyle from './map-style.json'
import AllLocations from './AllLocations'
import SelectedPlace from './SelectedPlace'
import SelectedPlaceWiki from './SelectedPlaceWiki'
import scriptLoader from 'react-async-script-loader'
import config from './config_helper.json'
import $ from "jquery";
import attraction from './icons/markers/attraction.svg'
import coffee from './icons/markers/coffee.svg'
import food from './icons/markers/food.svg'
import park from './icons/markers/park.svg'
import attraction1c from './icons/markers/attraction-onecolor.svg'
import coffee1c from './icons/markers/coffe-onecolor.svg'
import food1c from './icons/markers/food-onecolor.svg'
import park1c from './icons/markers/parks-onecolor.svg'


class App extends Component {

  state = {
    marker: [],
    map: {},
    markers: [],
    infoWindow: [],
    place: false,
    image: [],
    name:'',
    openingHours: false,
    url: '',
    price: '',
    rating: 0,
    address: '',
    hasError: false,
    wiki: '',
    wikiImage: '',
    wikiUrl: '',
    wikiName: '',
    selectedType: '',
    googleError: false
  }

  /* ** Loads the google map, sets the markers based
  on a separate database, with the help of the
  react-async-script-loader. The map styles data
  are in a separate file. Add event listeners to
  the markers, and also extend the bounds of the map
  based on the markers locations** */

  componentWillReceiveProps({isScriptLoadSucceed}) {
    if (isScriptLoadSucceed) {
      let markers = [];
      let map = new window.google.maps.Map(document.getElementById('map'), {
       center: {lat: 41.9027835, lng: 12.496365500000024},
       zoom: 8,
       styles: mapStyle
      });

      let bounds = new window.google.maps.LatLngBounds();
      let infoWindow = new window.google.maps.InfoWindow();

      this.setState({
        map: map,
        infoWindow: infoWindow
      });

      locations.map((location) => {
        let position = location.latlng;
        let title = location.name;
        let id = location.type;
        let icon;

        if (location.type === "Attractions") {
         icon = {url: `${attraction}`}
        } else if (location.type === "Coffee") {
          icon = {url: `${coffee}`}
        } else if (location.type === "Restaurants") {
          icon = {url: `${food}`}
        } else if (location.type === "Parks") {
          icon = {url: `${park}`}
        }

        let marker = new window.google.maps.Marker({
          map: map,
          position: position,
          title: title,
          id: id,
          icon: icon
        });

        markers.push(marker);

        window.google.maps.event.addListener(marker, 'click', (function(map){
            this.makeInfoWindow(marker, infoWindow, map);
            this.setMarkerIcon(marker, markers);
        }).bind(this));

        bounds.extend(position);
      });

      map.fitBounds(bounds);
      this.setState({ markers: markers });

    } else {
        alert("Script not loaded");
    }

    window.gm_authFailure = function() {
      this.setState({ googleError: true})
      console.log('Yee!');
    }.bind(this);
  }

 /** With this function the selected marker's icon will be
 the original colored version, the rest will change to a
 one colored (brown) version, so that the selected one
 outstands. This function also sets the state of the place true,
 so that the user will see the SelectedPlace component.  ** */

  setMarkerIcon(selectedIcon){
    this.setState({
      marker: selectedIcon,
      place: true,
      image: [],
      name: '',
      openingHours: false,
      url: '',
      price: '',
      rating: 0,
      address:'',
      hasError: false,
      wiki: '',
      wikiImage: '',
      wikiName: '',
      wikiUrl: ''
    });

    if (selectedIcon.id === "Attractions") {
      selectedIcon.setIcon(`${attraction}`);
    } else if (selectedIcon.id === "Coffee") {
      selectedIcon.setIcon(`${coffee}`);
    } else if (selectedIcon.id === "Restaurants") {
      selectedIcon.setIcon(`${food}`);
    } else if (selectedIcon.id === "Parks") {
      selectedIcon.setIcon(`${park}`);
    }

    this.state.markers.filter(marker => marker!==selectedIcon).map((loc) => {
      if (loc.id === "Attractions") {
       loc.setIcon(`${attraction1c}`);
      } else if (loc.id === "Coffee") {
       loc.setIcon(`${coffee1c}`);
      } else if (loc.id === "Restaurants") {
       loc.setIcon(`${food1c}`);
      } else if (loc.id === "Parks") {
       loc.setIcon(`${park1c}`);
     }
    });
  }

  /** This function create the infowindow if the user click
  on a marker or one of the items on the menu list.
  The marker's content will be the streetview image
  based on the selected place position, and the name of it.
  At the end of the function it will call another function
  (based on the type of the selected place) which will
  fetch additinal data from another databases. ** */

  makeInfoWindow(marker) {
    let infowindow = this.state.infoWindow;
    let map = this.state.map;

    /* Zoom into the place when the user click on it */
    map.setZoom(15);
    map.setCenter(marker.getPosition());

    if (infowindow.marker !== marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });

      let streetViewService = new window.google.maps.StreetViewService();
      let radius = 50;

      function getStreetView(data, status) {
        if (status === window.google.maps.StreetViewStatus.OK) {
          let nearStreetViewLocation = data.location.latLng;
          infowindow.setContent('<div id="pano" style="width:200px; height:200px; position:static"></div><h2>' + marker.title + '</h2>');
          let panoramaOptions = {
            position: nearStreetViewLocation,
            disableDefaultUI: true,
            pov: {
              heading: 34,
              pitch: 10
            }
          };
          let panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
          }
      }

      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      infowindow.open(map, marker);
    }

    if ((marker.id === "Attractions") || (marker.id === "Parks")) {
      this.wiki(marker);
    } else if ((marker.id === "Coffee") || (marker.id === "Restaurants")) {
      this.yelp(marker);
    }
  }

  /** When the clicked place type is Coffee or Restaurant
  the app fetches the additional data from Yelp's database.
  Because Yelp's API doesn't support CORS, the app uses
  cors-anywhere.herokuapp.com.
  First step: search in Yelp database based on the selected
  location's position and name.
  If there is a match we fetch more data based on the
  business id, and set the states of this location.
  If there is no match at all: set the stete of
  hasError to true ** */

  yelp(marker) {
    const search = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?';
    const lat = marker.getPosition().lat();
    const lang = marker.getPosition().lng();
    const query = marker.title;

    const params = {
      latitude: lat,
      longitude: lang,
      term: query,
      radius: 50,
      limit: 1
    };

    const headers = {
      'Authorization': `Bearer ${config.yelp_api}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': 'http://localhost:3000'
    };

    fetch(search + new URLSearchParams(params), {
      headers: headers
    }).then((resp) => resp.json()
    ).then((response) => {
        let id = response.businesses[0].id;
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}`, {
        headers: headers
        })
    }).then((resp) => resp.json()
    ).then((response) => {
        this.setState({
          image: response.photos,
          openingHours: response.hours[0].is_open_now,
          url: response.url,
          price: response.price,
          rating: response.rating,
          address: response.location.address1,
          name: response.name,
        })
    }).catch(() => {
          this.setState({ hasError: true });
    })
  }

  /** When the clicked place's type is Attraction or Park
  the app fetches the additional data from Wikipedia's database.
  First step: search in Wikipedia's database based on the selected
  location's name.
  If there is a match we call another function with the
  Wikipedia's title.
  If there is no match at all: set the state of
  hasError to true. ** */

  wiki(marker) {
    $.ajax({
      url: `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${marker.title}`,
      type: 'GET',
      headers: {'X-Requested-With': 'XMLHttpRequest'},
      crossDomain: true,
      dataType: 'jsonp'
    }).done(function(data) {
      let title = data[1][0];
      title = title.replace(/\s+/g, '_');
      this.wikiText(title);
    }.bind(this)
    ).fail(function() {
        this.setState({ hasError: true })
    }.bind(this));
  }

  /** Make another ajax request based on the previously
  fetched title, and set the states with the received data.
  If an error occure the fail function set the hasError
  state to true. ** */

  wikiText(title) {
    $.ajax({
      url: `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages|info&exintro=&explaintext=&piprop=original&inprop=url&titles=${title}`,
      type: 'GET',
      headers: {'X-Requested-With': 'XMLHttpRequest'},
      crossDomain: true,
      dataType: 'jsonp'
    }).done(function(data) {
      let page = data.query.pages;
      let pageId = Object.keys(data.query.pages)[0];
      let text = page[pageId].extract;
      let url = page[pageId].fullurl;
      let image = page[pageId].original.source;
      let title = page[pageId].title;
      this.setState({
        wiki: text,
        wikiImage: image,
        wikiUrl: url,
        wikiName: title
      })
    }.bind(this)
    ).fail(function() {
        this.setState({ hasError: true });
    }.bind(this));
  }

  /** When the user is at the selected place's page,
  they have the option to go back to the main menu.
  Whey they click on the back icon or text the app
  set the place state to false. ** */

  updatePlace() {
    this.setState({ place: false});
  }

  /** When the user selects a type at a
  Dropdown selection menu, this state will filter
  the type and shows the places that match. On the
  map it's also highlight the selected types ** */

  updateType(type) {
    this.setState({ selectedType: type });

    this.state.markers.map((loc) => {
      if (type === "All") {
        if (loc.id === "Attractions") {
          loc.setIcon(`${attraction}`);
          } else if (loc.id === "Coffee") {
             loc.setIcon(`${coffee}`);
          } else if (loc.id === "Restaurants") {
             loc.setIcon(`${food}`);
          } else if (loc.id === "Parks") {
             loc.setIcon(`${park}`);
          }
      } else if ((loc.id === "Attractions") && (loc.id === type)) {
         loc.setIcon(`${attraction}`);
      } else if ((loc.id === "Coffee") && (loc.id === type)) {
         loc.setIcon(`${coffee}`);
      } else if ((loc.id === "Restaurants") && (loc.id === type)) {
         loc.setIcon(`${food}`);
      } else if ((loc.id === "Parks") && (loc.id === type)) {
         loc.setIcon(`${park}`);
      } else if ((loc.id === "Attractions") && (loc.id !== type)) {
         loc.setIcon(`${attraction1c}`);
      } else if ((loc.id === "Coffee") && (loc.id !== type)) {
         loc.setIcon(`${coffee1c}`);
      } else if ((loc.id === "Restaurants") && (loc.id !== type)) {
         loc.setIcon(`${food1c}`);
      } else if ((loc.id === "Parks") && (loc.id !== type)) {
         loc.setIcon(`${park1c}`);
      }
    });
  }

  /** Return components based on the state
  of the place, marker.id  and hasError.
  The state of the place initially false,
  so the user will see the AllLocations component first.
  When the user clicks on a marker or a place's name
  on the list, the state of a place will change
  so that they will see a SelectedPlace component
  or SelectedPlaceWiki component based on the marker's id.
  If the hasError state is true then an error
  message will be returned. ** */

  render() {
    return (
      <div className="App">
      <aside className="information">
        {this.state.place===false && (
          <AllLocations
            markers = {this.state.markers}
            locations = {locations}
            selectedType = {this.state.selectedType}
            onMap = {(marker) => {
              this.setMarkerIcon(marker)
              this.makeInfoWindow(marker)
            }}
            onUpdateType = {(type) => {
              this.updateType(type)
            }}
          />
        )}

        {(this.state.place===true && ((this.state.marker.id === "Coffee") || (this.state.marker.id === "Restaurants"))) && (
          <SelectedPlace
            name = {this.state.name}
            image = {this.state.image}
            openingHours = {this.state.openingHours}
            url = {this.state.url}
            price = {this.state.price}
            rating = {this.state.rating}
            address = {this.state.address}
            onUpdatePlace = {() => {
              this.updatePlace()
            }}
          />
        )}

        {(this.state.place===true && ((this.state.marker.id === "Attractions") || (this.state.marker.id === "Parks"))) && (
          <SelectedPlaceWiki
            wikiName = {this.state.wikiName}
            wikiUrl = {this.state.wikiUrl}
            wiki = {this.state.wiki}
            wikiImage = {this.state.wikiImage}
            onUpdatePlace = {() => {
              this.updatePlace()
            }}
          />
        )}


        {this.state.hasError===true && (
          <h3>Sorry, the database do not have results :( </h3>
        )}



      </aside>

      <section className="map-container">
        {this.state.googleError===true && (
          <div className="googleError">
          <h3>*** Looks like you have an authentication error ***</h3>
          <p> Please put your Google Map API key in the config_helper.json file, or check the console for further information. </p>
          </div>
        )}
        <div id="map"></div>
      </section>

      </div>
    );
  }
}

export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=${config.googleApi}&libraries=geometry`]
)(App)
