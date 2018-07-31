# Udacity FEND project: Udacity Neighbourhood React Project

8th and final project in Google-Udacity Scholarship 2018.

## Project Overview

Develop a single page application featuring a map of my neighborhood or a neighborhood I would like to visit. Add functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content. Display at least 5 locations that I'm interested in and these should display by default when the pages loaded. No starter code provided by Udacity.

## App functionality

The main page displays a map and a list view of the locations with a filter option. Display all location markers by default.
When the user filters locations at the list view, the map displays the filtered locations too.
When the user selects a location from the list view or from the map, the app displays additional information from third-party API (non-Google).


## Main requirements for this project:

- Responsive design
- Location filter - text input or Dropdown
- List view - displays all locations by default, and displays the filtered subset when filter applied
- Map with markers displays by default, and displays the filtered subset when filter applied
- Clicking location (on the list view or on the map) displays additional information about the location, and animates the selected place's marker (e.g. bounce, or color)
- Asynchronous API Requests with error handling
- Fetch the additional data from third-party API
- Focus management (a11y)
- Semantically defined site elements, or using ARIA roles
- Accessible images
- Service worker
- Proper use of React

## Third-party APIs

I used for this project two APIs for fetching additional data:
- with Wikipedia's API fetched text information and images about attractions and parks in Rome
- with Yelp's API fetched information about restaurants and coffee bars, like price, rates, images

## How to open this app

- Fork this repository, and/or clone it to your local environment
- Install all project dependencies with `npm install`
- At the provided config_helper.json file insert your Google API key (you will need Maps JavaScript and Street View API), and your [Yelp API key](https://www.yelp.com/developers/v3/manage_app)
- Then run this lines in npm for **production mode** (it's needed if you want to check the service worker):
  - `npm run build`
  - `npm install -g serve`
  - `serve -s build`
  - Open in browser: http://localhost:5000
- Or run `npm start` for **developer mode**
  - Open in browser: http://localhost:3000


## Design

I downloaded icons from [Fontawesome](https://fontawesome.com/icons?d=gallery) and from [Iconscout](https://iconscout.com/), the rest of the page was designed by me.



## Built with

[React](https://reactjs.org/)

[Downshift](https://www.npmjs.com/package/downshift#itemtostring)

[CSS loader](https://codepen.io/animatedcreativity/pen/OjBPQJ)

[Yelp API](https://www.yelp.com/fusion)

[CORS Anywhere](https://cors-anywhere.herokuapp.com/)

[Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)

[Wikipedia helper video](https://www.youtube.com/watch?v=RPz75gcHj18&)
