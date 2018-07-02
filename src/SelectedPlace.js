import React, { Component } from 'react';
import PropTypes from 'prop-types'
import arrow from './icons/arrow-back.svg'
import address from './icons/address.svg'
import closed from './icons/closed.svg'
import open from './icons/open.svg'
import rating from './icons/rating.svg'

class SelectedPlace extends Component {
  static propTypes = {
    onUpdatePlace: PropTypes.func.isRequired,
    name: PropTypes.array.isRequired,
    image: PropTypes.array.isRequired,
    openingHours: PropTypes.array.isRequired,
    url: PropTypes.array.isRequired,
    price: PropTypes.array.isRequired,
    rating: PropTypes.array.isRequired,
    address: PropTypes.array.isRequired
  }

  handleClick() {
    this.props.onUpdatePlace()
  }

  keyEvent = (event) => {
    if (event.key == 'Enter') {
    this.props.onUpdatePlace()
    }
  }

  render() {
    const starTotal = 4;
    const starPercentage = (this.props.price.length / starTotal) * 100;
    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
    const divStyle = {width: starPercentageRounded};

    return (
      <div className="place">
        {this.props.name.length < 1 && (
          <div className="holder">
            <div className="preloader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        )}

        {this.props.name.length > 1 && (
          <div className="place">
            <div className="back" onClick={() => this.handleClick()} onKeyPress={(e) => this.keyEvent(e)} tabIndex='0'>
            <img src={arrow} alt="Go back arrow"/><span className="backtext">BACK</span>
            </div>

            <h1>{this.props.name}</h1>

            <div className="info">
            <img src={address} alt="Address"/><span className="address">{this.props.address}</span>
            </div>

            <div className="info">
            <img src={rating} alt="Rating"/><span className="rating">{this.props.rating}<span className="rating2">/5</span></span>
            </div>

            <div className="info">
              <span>Price: </span>
              <div className="stars-outer">
                <div className="stars-inner" style={divStyle}></div>
              </div>
            </div>

            {this.props.openingHours === true && (
              <div className="info">
                <img src={open} alt="open"/><span className="open">Now open!</span>
              </div>
            )}

            {this.props.openingHours === false && (
              <div className="info">
                <img src={closed} alt="closed"/><span className="closed">Currently closed :(</span>
              </div>
            )}

            <div className="link">
              <a href={this.props.url}>More information >></a>
            </div>

            {this.props.image.map((image, index) => (
              <img key={index} className="placeimage" src={image} alt={this.props.name}/>
            ))}

          </div>
        )}
      </div>
    )
  }
}

export default SelectedPlace;
