import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import DropdownSelection from './DropdownSelection'


class AllLocations extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    locations: PropTypes.array.isRequired,
  }

  state = {
    listNames: ['Attractions', 'Coffee', 'Restaurants', 'Parks'],
    selectedType: []
  }

  updateType(type) {
    this.setState({ selectedType:type })
  }


  render() {

    return (
      <div>
      {console.log(this.state.selectedType)}
        <aside className="information">
          <h1>ROME</h1>
          <DropdownSelection
            onUpdateType = {(type) => {
              this.updateType(type);
            }}
          />
          {(this.state.selectedType.length < 1 || this.state.selectedType === 'All') &&(
          <div className="list">
          {this.state.listNames.map((title, index) => (
            <div key={title[index]} className='listChild'>
            <h2 className={`listType ${title}`}>{title}</h2>
              <div className="list-items">
                <ul className="list-grid">
                {this.props.locations
                  .filter(type => type.type === title)
                  .map(location => (
                  <li className={`loc${location.type}`} key={location.id}>{location.name}</li>))
                }
                </ul>
                </div>
              </div>
            ))}
          </div>
          )}

          {this.state.selectedType.length > 1 && (
          <div className="list">
          {this.state.listNames
            .filter(type => type === this.state.selectedType)
            .map((title, index) => (
            <div key={title[index]} className='listChild'>
            <h2 className={`listType ${title}`}>{title}</h2>
              <div className="list-items">
                <ul className="list-grid">
                {this.props.locations
                  .filter(type => type.type === title)
                  .map(location => (
                  <li className={`loc${location.type}`} key={location.id}>{location.name}</li>))
                }
                </ul>
                </div>
              </div>
            ))}
          </div>
          )}
        </aside>
        <section className="map-container">
          <div id="map"></div>
        </section>
      </div>
    )
  }
}

export default AllLocations;
