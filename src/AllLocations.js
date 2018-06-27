import React, { Component } from 'react';
import PropTypes from 'prop-types'
import DropdownSelection from './DropdownSelection'



class AllLocations extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    locations: PropTypes.array.isRequired,
  }

  state = {
    listNames: ['Attractions', 'Coffee', 'Restaurants', 'Parks'],
  }

  handleClick(marker) {
    this.props.onMap(marker)
  }


  render() {

    return (
      <div>
          <h1>ROME</h1>

          <DropdownSelection
            onUpdateType = {this.props.onUpdateType}
          />

          {(this.props.selectedType.length < 1 || this.props.selectedType === 'All') &&(
          <div className="list">
          {this.state.listNames.map((title, index) => (
            <div key={title[index]} className='listChild'>
            <h2 className={`listType ${title}`}>{title}</h2>
              <div className="list-items">
                <ul className="list-grid">
                {this.props.markers
                  .filter(type => type.id === title)
                  .map(location => (
                  <li className={`loc${location.id}`} key={location.title} onClick={(e) => this.handleClick(location)}>{location.title}</li>))
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
            <h2 className={`listType ${title}`}>{title}</h2>
              <div className="list-items">
                <ul className="list-grid">
                {this.props.markers
                  .filter(type => type.id === title)
                  .map(location => (
                  <li className={`loc${location.id}`} key={location.title} onClick={(e) => this.handleClick(location)}>{location.title}</li>))
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
