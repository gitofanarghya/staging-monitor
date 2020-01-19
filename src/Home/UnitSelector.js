import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { InputBase } from '@material-ui/core';
import { appService } from '../app.service';


const BootstrapInput = withStyles(theme => ({
  input: {
    fontWeight: 500,
    color: 'white',
    fontSize: '22px'
  }
}))(InputBase);

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  icon: {
    color: "white",
    top: 'calc(50% - 15px)'
  },
  iconDisabled: {
    display: 'none'
  }
});

class SimpleSelect extends React.Component {
  state = {
    unit: this.props.selectedUnit === '' ? 'Please select a unit' : this.props.units.filter(c => c.id === this.props.selectedUnit)[0].name
  };

  handleChange = event => {
    this.props.setUnit(this.props.units.filter(c => c.name === event.target.value)[0].id)
    this.setState({
      unit: event.target.value
    });
  };

  render() {
    const { classes, units } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl variant="standard" className={classes.formControl}>
          <Select
            disabled={units.length < 2 ? true : false}
            value={this.state.unit}
            onChange={this.handleChange}
            input={<BootstrapInput name="unit" id="select-unit" />}
            classes={units.length > 1 ?
              {
                icon: classes.icon
              } :
              {
                icon: classes.iconDisabled
              }
            }
          >
            <MenuItem key='Please select a unit' value='Please select a unit' style={{ pointerEvents: 'none' }}>Please select a unit</MenuItem>
            {units.sort((a, b) => {
              if (a.name < b.name) { return -1 }
              if (a.name > b.name) { return 1 }
              return 0
            }).map(c => {
              return (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </form>
    );
  }
}

SimpleSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { units, selectedCommunity, selectedUnit } = state.app;
  return {
    units: units.filter(u => u.community_id === selectedCommunity),
    selectedUnit
  };
}

const mapDispatchToProps = (dispatch) => ({
  setUnit: (id) => {
    dispatch({ type: 'set_unit', id })
    dispatch({ type: 'get_devices_request' })
    appService.getDevices(id)
      .then(json => {
        dispatch({ type: 'get_devices_success', json })
      }, error => {
        dispatch({ type: 'get_devices_failure', error })
      })
    dispatch({ type: 'get_zones_request' })
    appService.getZones(id)
      .then(json => {
        dispatch({ type: 'get_zones_success', json })
      }, error => {
        dispatch({ type: 'get_zones_failure', error })
      })
    dispatch({ type: 'get_graph_events_request' })
    appService.getGraphEvents(id)
      .then(json => {
        dispatch({ type: 'get_graph_events_success', json })
      }, error => {
        dispatch({ type: 'get_graph_events_failure', error })
      })
  },
})

const connectedSimpleSelect = withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SimpleSelect));
export { connectedSimpleSelect as UnitSelector }; 