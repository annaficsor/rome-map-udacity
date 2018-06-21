import React, { Component } from 'react';
import PropTypes from 'prop-types'
import arrow from './icons/filter-arrow.svg'

class DropdownSelection extends Component {
  static propTypes = {
    onUpdateType: PropTypes.func.isRequired
  }

  state = {
    showList: false
  }

  showList = () => {
    if (this.state.showList === false) {
    this.setState({ showList: true });
    document.addEventListener('click', this.closeMenu);
  } else {
    this.setState({ showList: false })
  }
  }

  closeMenu = () => {
    this.setState({ showList: false });
    document.removeEventListener('click', this.closeMenu);
  }

  handleClick(type) {
    console.log(type)
    this.props.onUpdateType(type)
  }

  render() {
    return (
      <div className="drop-wrapper">
      <div className="drop-header" onClick={this.showList}>
        <div className="drop-header-title">Filter by type</div>
        <img src={arrow} alt="arrow down" className='arrow-down'/>
      </div>
      {this.state.showList && (
      <ul className="drop-list">
        <li id="Attractions" onClick={(e) => this.handleClick(e.target.id)}>Attractions</li>
        <li id="Coffee" onClick={(e) => this.handleClick(e.target.id)}>Coffee</li>
        <li id="Restaurants" onClick={(e) => this.handleClick(e.target.id)}>Restaurants</li>
        <li id="Parks" onClick={(e) => this.handleClick(e.target.id)}>Parks</li>
        <li id="All" onClick={(e) => this.handleClick(e.target.id)}>All</li>
      </ul>
      )}
    </div>
    )
  }
}

export default DropdownSelection;
