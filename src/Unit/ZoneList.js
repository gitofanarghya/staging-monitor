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


class ZoneList extends React.Component {
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
        const { classes, rows, selectedZone } = this.props
        
        const sortedCommunities = rows.sort((a,b) => {
            if(a[this.state.orderBy] < b[this.state.orderBy]) { return this.state.sortDirection === 'asc' ? -1 : 1 }
            if(a[this.state.orderBy] > b[this.state.orderBy]) { return this.state.sortDirection === 'asc' ? 1 : -1 }
            return 0
        })

        return(
            <Fragment>
                <Typography variant="h6" style={{marginLeft: '16px'}}>
                    Zones
                </Typography>
                <Table size="small">
                <TableHead className={classes.scrollAdjust}>
                    <TableRow>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'name'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('name')}>Name</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'totalDevices'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('totalDevices')}>Total Devices</TableSortLabel></TableCell> 
                        <TableCell><TableSortLabel active={this.state.orderBy === 'activeEvents'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('activeEvents')}>Active Events</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'unassignedEvents'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('unassignedEvents')}>Unassigned Events</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'devicesOffline'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('devicesOffline')}>Devices Offline</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'devicesBatteryLow'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('devicesBatteryLow')}>Battery Low</TableSortLabel></TableCell>
                        <TableCell><TableSortLabel active={this.state.orderBy === 'hubOffline'} direction={this.state.sortDirection} onClick={() => this.changeSortDirection('hubOffline')}>Hub Offline</TableSortLabel></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                    {sortedCommunities.map(c => (
                    <TableRow key={c.id} style={selectedZone === c.id ? {backgroundColor: '#1ADCFF', color: 'white'} : {}} className={classes.scrollAdjust} hover onClick={() => this.props.selectedZone !== c.id && this.props.setZone(c.id)}>
                        <TableCell style={{borderLeft: c.color, color: 'inherit'}}>{c.name}</TableCell>
                        <TableCell align='center' style={{color: 'inherit'}}>{c.totalDevices}</TableCell>
                        <TableCell align='center' style={{color: 'inherit'}}>{c.activeEvents}</TableCell> 
                        <TableCell align='center' style={{color: 'inherit'}}>{c.unassignedEvents}</TableCell> 
                        <TableCell align='center' style={{color: 'inherit'}}>{c.devicesOffline}</TableCell>
                        <TableCell align='center' style={{color: 'inherit'}}>{c.devicesBatteryLow}</TableCell>
                        <TableCell align='center' style={{color: 'inherit'}}>{c.hubOffline}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { zones, devices, events, selectedZone } = state.app;

    const rows = zones.map(z => ({
        id: z.id,
        name: z.name,
        totalDevices: devices.filter(d => d.zone_id === z.id).length,
        activeEvents: events.filter(e => e.zone_id === z.id).length,
        devicesOffline: events.filter(e => e.zone_id === z.id && e.event_type === 'device_offline').length,
        devicesBatteryLow: events.filter(e => e.zone_id === z.id && e.event_type === 'battery_low').length,
        hubOffline: events.filter(e => e.zone_id === z.id && e.event_type === 'hub_offline').length,
        color: events.filter(e => e.zone_id === z.id).length > 0 ? '5px solid #ff00009c' : '5px solid #00800085',
        unassignedEvents: events.filter(e => e.zone_id === z.id && e.status === 'unassigned').length
    }))
    
    return {
        zones,
        rows: rows,
        selectedZone
    };
}

const mapDispatchToProps = (dispatch) => ({
    setZone: (id) => {
        dispatch({type: 'set_zone', id})
    }
})

const connectedZoneList = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ZoneList));
export { connectedZoneList as ZoneList }; 