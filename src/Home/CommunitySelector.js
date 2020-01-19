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
    community: this.props.selectedCommunity === '' ? 'Please select a community' : this.props.communities.filter(c => c.id === this.props.selectedCommunity)[0].name
  };

  handleChange = event => {
    this.props.setCommunity(this.props.communities.filter(c => c.name === event.target.value)[0].id)
    this.setState({
      community: event.target.value
    });
  };

  render() {
    const { classes, communities } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl variant="standard" className={classes.formControl}>
          <Select
            disabled={communities.length < 2 ? true : false}
            value={this.state.community}
            onChange={this.handleChange}
            input={<BootstrapInput name="community" id="select-community" />}
            classes={communities.length > 1 ?
              {
                icon: classes.icon
              } :
              {
                icon: classes.iconDisabled
              }
            }
          >
            <MenuItem key='Please select a community' value='Please select a community'>Please select a community</MenuItem>
            {communities.sort((a, b) => {
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
  const { communities, selectedCommunity } = state.app;
  return {
    communities,
    selectedCommunity
  };
}

const mapDispatchToProps = (dispatch) => ({
  setCommunity: (id) => {
    dispatch({ type: 'set_community', id })
    dispatch({ type: 'get_units_request' })
    appService.getUnits(id)
      .then(json => {
        dispatch({ type: 'get_units_success', json })
      }, error => {
        dispatch({ type: 'get_units_failure', error })
      })
  },
})

const connectedSimpleSelect = withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SimpleSelect));
export { connectedSimpleSelect as SearchBar }; 