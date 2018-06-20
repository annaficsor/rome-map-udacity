import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import './App.css';
import locations from './locations.json'
import mapStyle from './map-style.json'
import AllLocations from './AllLocations'
import scriptLoader from 'react-async-script-loader'
import config from './config.json'

class App extends Component {

  state = {
    map: {},
    markers: []
  }

  componentWillReceiveProps({isScriptLoadSucceed}){
      if (isScriptLoadSucceed) {
          var markers = [];

          var map = new window.google.maps.Map(document.getElementById('map'), {
             center: {lat: 41.9027835, lng: 12.496365500000024},
             zoom: 13,
             styles: mapStyle
          });

          this.setState({ map: map })

          locations.map((location) => {
            var position = location.latlng;
            var title = location.name;
            var id = location.id;
            var icon;

            if (location.type === "attractions") {
             icon = {url: 'data:image/svg+xml;utf-8, <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 238 317.33"><defs><style>.cls-1{fill:#e95565;}.cls-2{fill:#fff5e9;}</style></defs><title>attraction</title><g id="Layer_2" data-name="Layer 2"><g id="Assets"><path class="cls-1" d="M119,0A119,119,0,0,0,0,119c0,76.44,85.7,171.82,99.17,186.39,5.57,6,10.23,11.94,19.83,11.94s14.26-5.89,19.83-11.94C152.3,290.82,238,195.44,238,119A119,119,0,0,0,119,0Z"/><path class="cls-2" d="M189.5,88v78.87a13.22,13.22,0,0,1-13.22,13.22H61.72A13.22,13.22,0,0,1,48.5,166.89V88A13.22,13.22,0,0,1,61.72,74.79H86l3.39-8.95a13.2,13.2,0,0,1,12.37-8.46h34.56a13.2,13.2,0,0,1,12.37,8.46L152,74.79h24.23A13.22,13.22,0,0,1,189.5,88Zm-37.64,39.63a33.05,33.05,0,1,0-33.05,33.05A33.08,33.08,0,0,0,151.86,127.64Zm-8.81,0a24.24,24.24,0,1,1-24.24-24.24A24.27,24.27,0,0,1,143,127.64Z"/></g></g></svg>'}
           } else if (location.type === "coffee") {
              icon = {url: 'data:image/svg+xml;utf-8, <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 238 317.33"><defs><style>.cls-1{fill:#e39f40;}.cls-2{fill:#fff5e9;}</style></defs><title>coffee</title><g id="Layer_2" data-name="Layer 2"><g id="Assets"><path class="cls-1" d="M119,0A119,119,0,0,0,0,119c0,76.44,85.7,171.82,99.17,186.39,5.57,6,10.23,11.94,19.83,11.94s14.26-5.89,19.83-11.94C152.3,290.82,238,195.44,238,119A119,119,0,0,0,119,0Z"/><path class="cls-2" d="M86.67,164.33h49.08a24.55,24.55,0,0,0,24.54-24.54h7.08c17.82,0,32.83-14,33.22-31.85A32.61,32.61,0,0,0,168,74.62H68.25a6.14,6.14,0,0,0-6.14,6.14v59A24.56,24.56,0,0,0,86.67,164.33ZM168.54,90.7a16.5,16.5,0,1,1-.22,33h-8v-33Zm12,98.18H49.77c-12.18,0-15.6-16.08-9.21-16.08H189.77C196.16,172.79,192.78,188.88,180.58,188.88Z"/></g></g></svg>'}
            } else if (location.type === "food") {
              icon = {url: 'data:image/svg+xml;utf-8, <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 46.67"><defs><style>.cls-1{fill:#973a45;}.cls-2{fill:#fff5e9;}</style></defs><title>food</title><g id="Layer_2" data-name="Layer 2"><g id="Assets"><path class="cls-1" d="M17.5,0A17.5,17.5,0,0,0,0,17.5C0,28.74,12.6,42.77,14.58,44.91c.82.89,1.5,1.76,2.92,1.76s2.1-.87,2.92-1.76C22.4,42.77,35,28.74,35,17.5A17.5,17.5,0,0,0,17.5,0Z"/><path class="cls-2" d="M16.52,8.84a61.44,61.44,0,0,1,.8,6.42,5.26,5.26,0,0,1-3.4,5.21l.64,11.87a1.19,1.19,0,0,1-1.19,1.26H10.2A1.19,1.19,0,0,1,9,32.34l.64-11.87a5.25,5.25,0,0,1-3.4-5.21A61.26,61.26,0,0,1,7,8.84c.16-1,2.24-1,2.37.05v7c.06.17.75.16.79,0,.07-1.26.39-6.94.4-7.07.16-1,2.21-1,2.37,0,0,.13.33,5.81.4,7.07,0,.16.73.17.79,0v-7C14.28,7.82,16.36,7.83,16.52,8.84Zm6,14.24-.75,9.23A1.2,1.2,0,0,0,23,33.6h2.79a1.2,1.2,0,0,0,1.2-1.2V9.28a1.2,1.2,0,0,0-1.2-1.2C21.68,8.09,14.75,17,22.55,23.08Z"/></g></g></svg>'}
            } else if (location.type === "park") {
                icon = {url: 'data:image/svg+xml;utf-8, <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 238 317.33"><defs><style>.cls-1{fill:#9eaa20;}.cls-2{fill:#fff5e9;}</style></defs><title>park</title><g id="Layer_2" data-name="Layer 2"><g id="Assets"><path class="cls-1" d="M119,0A119,119,0,0,0,0,119c0,76.44,85.7,171.82,99.17,186.39,5.57,6,10.23,11.94,19.83,11.94s14.26-5.89,19.83-11.94C152.3,290.82,238,195.44,238,119A119,119,0,0,0,119,0Z"/><path class="cls-2" d="M189.5,126a56.39,56.39,0,0,1-11.72,33.61c-8.24,10-18.66,15.71-29.94,15.71a38,38,0,0,1-7.38-.87,32.73,32.73,0,0,1-9.48-3.31,4.32,4.32,0,0,0-6.44,4L128.1,238a4.33,4.33,0,0,1-4.32,4.57H110.19a4.33,4.33,0,0,1-4.32-4.56l3.77-70.76a4.33,4.33,0,0,0-5.7-4.33,71.75,71.75,0,0,1-21.64,3.71c-18.63,0-33.8-15.28-33.8-34.48a34,34,0,0,1,14.63-28.34,3.22,3.22,0,0,0,1.4-2.65c0-29.24,20.39-60.23,50.33-60.23,24.4,0,42.27,18.87,46.9,38.72a4.33,4.33,0,0,0,2.09,2.79A49.88,49.88,0,0,1,189.5,126Z"/></g></g></svg>'}
              }

            var marker = new window.google.maps.Marker({
              map: map,
              position: position,
              title: title,
              id: id,
              icon: icon
            })
            markers.push(marker);
            marker.addListener('click', function() {
              console.log(this)
            });
          })

        this.setState({ markers: markers })

      } else {
          alert("script not loaded")
      }
  }





  // filterColor = (filter) => {
  //   console.log(filter)
  //   this.setState(state => ({
  //   markers: state.markers.filter(location => location !== filter).map(loc => loc.icon = {
  //     anchor: new window.google.maps.Point(16, 16),
  //     url: 'data:image/svg+xml;utf-8, \
  //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 238 317.33"><defs><style>.cls-1{fill:#e39f40;}.cls-2{fill:#fff5e9;}</style></defs><title>coffee</title><g id="Layer_2" data-name="Layer 2"><g id="Assets"><path class="cls-1" d="M119,0A119,119,0,0,0,0,119c0,76.44,85.7,171.82,99.17,186.39,5.57,6,10.23,11.94,19.83,11.94s14.26-5.89,19.83-11.94C152.3,290.82,238,195.44,238,119A119,119,0,0,0,119,0Z"/><path class="cls-2" d="M86.67,164.33h49.08a24.55,24.55,0,0,0,24.54-24.54h7.08c17.82,0,32.83-14,33.22-31.85A32.61,32.61,0,0,0,168,74.62H68.25a6.14,6.14,0,0,0-6.14,6.14v59A24.56,24.56,0,0,0,86.67,164.33ZM168.54,90.7a16.5,16.5,0,1,1-.22,33h-8v-33Zm12,98.18H49.77c-12.18,0-15.6-16.08-9.21-16.08H189.77C196.16,172.79,192.78,188.88,180.58,188.88Z"/></g></g></svg>'
  //   })
  // }))
  // }

  render() {
    return (
      <div className="App">
      {console.log(config.googleApi)}
      <Route exact path='/' render={() => (
           <AllLocations
             map = {this.state.map}
             markers = {this.state.markers}
           />
      )}/>
      </div>
    );
  }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key="+config.googleApi]
)(App)
