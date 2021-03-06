import React, { Component } from 'react';
import PropTypes from 'prop-types'
import arrow from './icons/arrow-back.svg'

class SelectedPlaceWiki extends Component {
  static propTypes = {
    onUpdatePlace: PropTypes.func.isRequired,
    wikiName: PropTypes.string.isRequired,
    wiki: PropTypes.string.isRequired,
    wikiImage: PropTypes.string.isRequired,
    wikiUrl: PropTypes.string.isRequired,
    wikiLat: PropTypes.number.isRequired,
    wikiLong: PropTypes.number.isRequired
  }

  /* ** When the user clicks on the back div
  this function will call the onUpdatePlace,
  which will set the state of the place to false,
  so that the user will see the main page ** */

  handleClick() {
    this.props.onUpdatePlace()
  }

  /* ** This keyEvent function helps users who
  use tab for navigation ** */

  keyEvent = (event) => {
    if (event.key === 'Enter') {
    this.props.onUpdatePlace()
    }
  }

  /* ** Until the state doesn't receive
  the fetched data the page return loader
  animation. When the data arrive the
  page will return the content.  ** */

  render() {
    return (
      <div className="place">
        {this.props.wikiName.length < 1 && (
          <div className="holder" role="progressbar">
            <div className="preloader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        )}

        {this.props.wikiName.length > 1 && (
          <article className="place">
            <div className="back" onClick={() => this.handleClick()} onKeyPress={(e) => this.keyEvent(e)} tabIndex='0' role="navigation">
              <img src={arrow} alt="Go back arrow"/><span className="backtext">BACK</span>
            </div>
            <h1>{this.props.wikiName}</h1>
            <h3 className="linkDirections">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${this.props.wikiLat},${this.props.wikiLong}&travelmode=walking`}>Get directions >></a>
            </h3>
            <div className="wikitext">{this.props.wiki}</div>
            <div className="link">
              <a href={this.props.wikiUrl}>More information >></a>
            </div>
            <img className="placeimage" src={this.props.wikiImage} alt={this.props.wikiName}/>
          </article>
        )}
      </div>
    )
  }
}

export default SelectedPlaceWiki;
