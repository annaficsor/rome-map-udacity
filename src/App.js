import React, { Component } from 'react';
import './App.css';
import locations from './locations.json'
import mapStyle from './map-style.json'
import AllLocations from './AllLocations'
import SelectedPlace from './SelectedPlace'
import SelectedPlaceWiki from './SelectedPlaceWiki'
import scriptLoader from 'react-async-script-loader'
import config from './config.json'
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
    name:[],
    openingHours:[],
    url: [],
    price:[],
    rating:[],
    address:[],
    hasError: false,
    wiki: '',
    wikiImage: '',
    wikiUrl: '',
    wikiName: '',
    selectedType: ''
  }

  componentWillReceiveProps({isScriptLoadSucceed}){
    if (isScriptLoadSucceed) {
      let markers = [];
      let map = new window.google.maps.Map(document.getElementById('map'), {
       center: {lat: 41.9027835, lng: 12.496365500000024},
       zoom: 8,
       styles: mapStyle
      });

      let bounds = new window.google.maps.LatLngBounds();
      let infoWindow = new window.google.maps.InfoWindow({
        maxWidth: 200
      });

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
        })

        markers.push(marker);

        window.google.maps.event.addListener(marker, 'click', (function(map){
            this.makeInfoWindow(marker, infoWindow, map);
            this.setMarkerIcon(marker, markers);
        }).bind(this));

        bounds.extend(position);
      })

      map.fitBounds(bounds);
      this.setState({ markers: markers });

    } else {
        alert("Script not loaded");
    }
  }

  setMarkerIcon(selectedIcon){
    this.setState({
      marker: selectedIcon,
      place: true,
      image: [],
      name:[],
      openingHours:[],
      url: [],
      price:[],
      rating:[],
      address:[],
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

  makeInfoWindow(marker) {
    let infowindow = this.state.infoWindow;
    let map = this.state.map;

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
          this.setState({ hasError: true })
    })
  }

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
        this.setState({ hasError: true })
    }.bind(this));
  }

  updatePlace() {
    this.setState({ place: false})
  }

  updateType(type) {
    this.setState({ selectedType:type })
  }

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
        <div id="map"></div>
      </section>

      </div>
    );
  }
}

export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=${config.googleApi}&libraries=geometry`]
)(App)
