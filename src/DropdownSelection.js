import React, { Component } from 'react';
import PropTypes from 'prop-types'
import arrow from './icons/filter-arrow.svg'
import Downshift from 'downshift';

class DropdownSelection extends Component {
  constructor(props) {
    super(props);
    this.type = [
      { name: "Attractions" },
      { name: "Coffee" },
      { name: "Restaurants" },
      { name: "Parks" },
      { name: "All" }
    ];

    this.state = {
      selectedType: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(selectedType) {
    this.setState({ selectedType: selectedType.name });
    this.props.onUpdateType(selectedType.name)
  }

  render() {
    return (
      <Downshift
        onChange={this.onChange}
        selectedItem={this.state.selectedType}
        itemToString={type => (type ? type.name : "")}
      >
        {({
          isOpen,
          getToggleButtonProps,
          getItemProps,
          highlightedIndex,
          selectedItem: dsSelectedItem,
          getLabelProps
        }) => (
          <div>
            <button className="dropdown-button" {...getToggleButtonProps()}>
              {this.state.selectedType !== ""
                ? this.state.selectedType
                : 'Filter by type'}
               <img src={arrow} alt="arrow down" className='arrow-down'/>
            </button>
            <div style={{ position: "relative" }}>
              {isOpen ? (
                <div className="downshift-dropdown">
                  {this.type.map((item, index) => (
                    <div
                      className={`dropdown-item ${item.name}`}
                      {...getItemProps({ key: index, index, item })}
                      style={{
                        fontWeight: highlightedIndex === index ? "bold" : "normal"
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Downshift>
    );
  }
}

export default DropdownSelection;
