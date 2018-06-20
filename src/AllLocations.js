import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'


class AllLocations extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
  }

  render() {

    return (
      <div id="map">

      </div>
    )
  }
}

export default AllLocations;
