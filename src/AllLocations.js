import React, { Component } from 'react';
import PropTypes from 'prop-types'
import DropdownSelection from './DropdownSelection'


class AllLocations extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    onUpdateType: PropTypes.func.isRequired,
    onMap: PropTypes.func.isRequired,
    selectedType: PropTypes.string.isRequired,
    markers: PropTypes.array.isRequired,
  }

  state = {
    listNames: ['Attractions', 'Coffee', 'Restaurants', 'Parks'],
  }

  handleClick(marker) {
    this.props.onMap(marker)
  }

  keyEvent(event, location) {
    if (event.key == 'Enter') {
    this.props.onMap(location)
    }
  }

  render() {

    return (
      <div className="allLoc">
        <h1>ROME</h1>
        <DropdownSelection
          onUpdateType = {this.props.onUpdateType}
        />

        {(this.props.selectedType.length < 1 || this.props.selectedType === 'All') && (
          <div className="list">
            {this.state.listNames.map((title, index) => (
              <div key={title[index]} className='listChild'>
                <h2 id={`${title}`}>{title}</h2>
                <div className="list-items">
                  <ul className="list-grid">
                    {this.props.markers
                      .filter(type => type.id === title)
                      .map(location => (
                      <li className={`loc${location.id}`} key={location.title} onClick={(e) => this.handleClick(location)} onKeyPress={(e) => this.keyEvent(e, location)} tabIndex="0">{location.title}</li>))
                    }
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {this.props.selectedType.length > 1 && (
          <div className="list">
            {this.state.listNames
              .filter(type => type === this.props.selectedType)
              .map((title, index) => (
              <div key={title[index]} className='listChild'>
                <h2 id={`${title}`}>{title}</h2>
                <div className="list-items">
                  <ul className="list-grid">
                    {this.props.markers
                      .filter(type => type.id === title)
                      .map(location => (
                      <li className={`loc${location.id}`} key={location.title} onClick={(e) => this.handleClick(location)} tabIndex="0">{location.title}</li>))
                    }
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default AllLocations;
