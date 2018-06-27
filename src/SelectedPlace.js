import React, { Component } from 'react';
import PropTypes from 'prop-types'
import arrow from './icons/arrow-back.svg'

class SelectedPlace extends Component {
  // static propTypes = {
  //   onUpdatePlace: PropTypes.func.isRequired
  // }

  handleClick() {
    this.props.onUpdatePlace()
  }

  render() {

    return (
      <div className="place">
      <img onClick={() => this.handleClick()} className="back" src={arrow} alt="Go back arrow"/>


        <h1>{this.props.name}</h1>
        <p>{this.props.address}</p>
        {this.props.url.length > 1 && (
        <a href={this.props.url}>More information</a>
        )}
        <p>{this.props.rating}</p>
        <p>{this.props.price}</p>
        <p>{this.props.wiki}</p>
        {this.props.wikiImage.length > 1 && (
        <img className="placeimage" src={this.props.wikiImage} alt={this.props.name}/>
          )}



        {this.props.image.map((image, index) => (
          <img key={index} className="placeimage" src={image} alt={this.props.name}/>
        ))}
      </div>
    )
  }
}

export default SelectedPlace;
