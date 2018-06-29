import React, { Component } from 'react';
import PropTypes from 'prop-types'
import arrow from './icons/arrow-back.svg'
import address from './icons/address.svg'
import closed from './icons/closed.svg'
import open from './icons/open.svg'
import rating from './icons/rating.svg'

class SelectedPlaceWiki extends Component {
  // static propTypes = {
  //   onUpdatePlace: PropTypes.func.isRequired
  // }

  handleClick() {
    this.props.onUpdatePlace()
  }

  render() {
    return (
      <div className="place">
      {this.props.wikiName.length < 1 && (
        <div class="holder">
          <div class="preloader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      )}

      {this.props.wikiName.length > 1 && (
      <div>
      <div className="back" onClick={() => this.handleClick()} >
      <img src={arrow} alt="Go back arrow"/><span className="backtext">BACK</span>
      </div>
          <h1>{this.props.wikiName}</h1>
          <div className="wikitext">{this.props.wiki}</div>
          <div className="link"><a href={this.props.wikiUrl}>More information >></a></div>
          <img className="placeimage" src={this.props.wikiImage} alt={this.props.wikiName}/>
          </div>
        )}
      </div>
    )
  }
}

export default SelectedPlaceWiki;
