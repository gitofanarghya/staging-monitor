import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import { withStyles } from '@material-ui/core/styles'
import { ZoneList } from './ZoneList';
import { Paper, LinearProgress } from '@material-ui/core';
import { DeviceList } from './DeviceList';
import { DeviceDetails } from './DeviceDetails';
import { ActivityGraph } from './ActivityGraphNew';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
    root: {
    },
    activityGraph: {
        width: '100%'
    },
    unitList: {
        width: '49%',
        marginRight: '1%',
        [theme.breakpoints.down('md')]: {
            width: '100%',
            margin: 0
        }
    },
    graph: {
        width: '49%',
        marginLeft: '1%',
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginTop: 20,
            margin: 0
        }
    },
    tabsIndicator: {
        backgroundColor: '#179fec',
    },
    selected: {
        color: '#179fec',
        fontWeight: 600,
        fontSize: 14
    }
})


class Unit extends React.Component {

    state = {
        value: 0
    }

    handleChange = (event, value) => {
        this.setState({ value: value });
    };

    render() {
        const { classes, fetchingGraphEvents } = this.props

        return (
            <Fragment>
                <Grid container className={classes.root}>
                    <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', marginBottom: '10px', zIndex: 10 }}>
                        <Tabs variant='fullWidth' value={this.state.value} onChange={this.handleChange} classes={{ indicator: classes.tabsIndicator }}>
                            <Tab label="Sensor Data" classes={{ selected: classes.selected }} />
                            <Tab label="Event Data" disabled classes={{ selected: classes.selected }} />
                            <Tab label="Config Data" classes={{ selected: classes.selected }} />
                        </Tabs>
                    </AppBar>
                    {this.state.value === 0 && (fetchingGraphEvents ?  <div style={{ width: '100%', height: '100%' }}>
                        <Paper style={{ height: '105px', marginTop: '1%', width: '100%', padding: '5px' }}><LinearProgress style={{height: '100%'}} color="secondary" /></Paper>
                        <Paper style={{ height: '105px', marginTop: '1%', width: '100%', padding: '5px' }}><LinearProgress style={{height: '100%'}} color="secondary" /></Paper>
                        <Paper style={{ height: '105px', marginTop: '1%', width: '100%', padding: '5px' }}><LinearProgress style={{height: '100%'}} color="secondary" /></Paper>
                        <Paper style={{ height: '105px', marginTop: '1%', width: '100%', padding: '5px' }}><LinearProgress style={{height: '100%'}} color="secondary" /></Paper>
                    </div> : <ActivityGraph />)}
                    {this.state.value === 1 && <div />}
                    {this.state.value === 2 && <div style={{ display: 'flex' }}>
                        <Grid item className={classes.unitList}>
                            <Paper>
                                <ZoneList />
                            </Paper>
                        </Grid>
                        <Grid item className={classes.graph}>
                            <Paper>
                                <DeviceList />
                            </Paper>
                        </Grid></div>}
                </Grid>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { fetchingGraphEvents } = state.app;

    return {
        fetchingGraphEvents
    };
}

const mapDispatchToProps = (dispatch) => ({
    dataRefresh: () => {
    }
})

const connectedUnit = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Unit));
export { connectedUnit as Unit }; 