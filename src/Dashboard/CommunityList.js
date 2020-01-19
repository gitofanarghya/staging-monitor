import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import {withStyles} from '@material-ui/core/styles'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';

const styles = theme => ({
    tableBody: {
        display: 'block',
        maxHeight: '490px',
        overflow: 'auto'
    },
    scrollAdjust: {
        display: 'table',
        width: '100%',
        tableLayout: 'fixed',
        cursor: 'pointer'
    }
})


class CommunityList extends React.Component {
    state= {
        sortDirection: 'desc',
        orderBy: 'activeEvents'
    }

    changeSortDirection = (name) => {
        if(this.state.sortDirection === 'asc') {
            this.setState({
                ...this.state,
                orderBy: name,
                sortDirection: 'desc'
            })
        } else {
            this.setState({
                ...this.state,
                orderBy: name,
                sortDirection: 'asc'
            })
        }
    }

    render() {
        const { classes, rows } = this.props
        
        const sortedCommunities = rows.sort((a,b) => {
            if(a[this.state.orderBy] < b[this.state.orderBy]) { return this.state.sortDirection === 'asc' ? -1 : 1 }
            if(a[this.state.orderBy] > b[this.state.orderBy]) { return this.state.sortDirection === 'asc' ? 1 : -1 }
            return 0
        })

        return(
            <Fragment>
                <Typography variant="h6" style={{marginLeft: '16px'}}>
                    Communities
                </Typography>
                <Table size="small">
                <TableHead className={classes.scrollAdjust}>
                    <TableRow>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'name'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('name')}>Name</TableSortLabel></TableCell>
                        {/* <TableCell><TableSortLabel active={this.state.orderBy === 'numberOfUnits'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('numberOfUnits')}>Units</TableSortLabel></TableCell> */}
                        {/* <TableCell><TableSortLabel active={this.state.orderBy === 'totalDevices'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('totalDevices')}>Total Devices</TableSortLabel></TableCell> */}
                        <TableCell><TableSortLabel active={this.state.orderBy === 'activeEvents'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('activeEvents')}>Active Events</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'unassignedEvents'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('unassignedEvents')}>Unassigned Events</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'devicesOffline'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('devicesOffline')}>Devices Offline</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'devicesBatteryLow'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('devicesBatteryLow')}>Battery Low</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'hubOffline'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('hubOffline')}>Hub Offline</TableSortLabel></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                    {sortedCommunities.map(c => (
                    <TableRow key={c.id} className={classes.scrollAdjust} hover onClick={() => this.props.setCommunity(c.id)}>
                        <TableCell style={{overflow: 'hidden'}}>{c.name}</TableCell>
                        {/* <TableCell align='center'>{c.numberOfUnits}</TableCell> */}
                        {/* <TableCell align='center'>{c.totalDevices}</TableCell>  */}
                        <TableCell align='center'>{c.activeEvents}</TableCell> 
                        <TableCell align='center'>{c.unassignedEvents}</TableCell> 
                        <TableCell align='center'>{c.devicesOffline}</TableCell>
                        <TableCell align='center'>{c.devicesBatteryLow}</TableCell>
                        <TableCell align='center'>{c.hubOffline}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { communities, /* devices, units, */ events } = state.app;
    /* const devicesWithCommunityId = devices.map(d => {
        return {
            ...d,
            community_id: units.filter(u => u.id === d.site_id)[0] ? units.filter(u => u.id === d.site_id)[0].community_id : null
        }
    }) */
    const rows = communities.map(c => {
        return {
            ...c,
            /* numberOfUnits: units.filter(u => u.community_id === c.id).length, */
            /* totalDevices: devicesWithCommunityId.filter(d => d.community_id === c.id).length, */
            devicesOffline: events.filter(e => e.event_type === 'device_offline' && e.community_id === c.id).length,
            devicesBatteryLow: events.filter(e => e.event_type === 'battery_low' && e.community_id === c.id).length,
            hubOffline: events.filter(e => e.event_type === 'hub_offline' && e.community_id === c.id).length,
            activeEvents: events.filter(e => e.community_id === c.id).length,
            unassignedEvents: events.filter(e => e.community_id === c.id).filter(e => e.status === 'unassigned').length
        }
    })
    return {
        rows
    };
}

const mapDispatchToProps = (dispatch) => ({
    setCommunity: (id) => {
        dispatch({type: 'set_community', id})
        dispatch({type: 'get_units_request'})
        appService.getUnits(id)
            .then(json => {
                dispatch({type: 'get_units_success', json})
            }, error => {
                dispatch({type: 'get_units_failure', error})
            })
    }
})

const connectedCommunityList = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CommunityList));
export { connectedCommunityList as CommunityList }; 