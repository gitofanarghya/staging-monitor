import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import {withStyles} from '@material-ui/core/styles'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const styles = theme => ({
    deviceDetails: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})


class DeviceDetails extends React.Component {

    render() {
        const { classes, device } = this.props

        return(
            <Fragment>
                <Typography variant="h6" style={{marginLeft: '16px'}}>
                    Device Details
                </Typography>
                <Table size="small">
                <TableHead className={classes.scrollAdjust}>
                    <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow><TableCell>device type</TableCell><TableCell>{device.device_type.toString()}</TableCell></TableRow>
                    {device.sensor_type && <TableRow><TableCell>sensor type</TableCell><TableCell>{device.sensor_type.toString()}</TableCell></TableRow> }
                    <TableRow><TableCell>manufacturer</TableCell><TableCell>{device.manufacturer.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>model</TableCell><TableCell>{device.model.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>mac address</TableCell><TableCell>{device.mac_address.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>network address</TableCell><TableCell>{device.network_address.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>firmware vs</TableCell><TableCell>{device.firmware_vs.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>hardware vs</TableCell><TableCell>{device.hw_vs.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>is connected</TableCell><TableCell>{device.is_connected.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>endpoints</TableCell><TableCell>{device.endpoints.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>last contact time</TableCell><TableCell>{device.last_contact_time.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>last joined time</TableCell><TableCell>{device.last_joined_time.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>created at</TableCell><TableCell>{device.created_at.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>id</TableCell><TableCell>{device.id.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>hub id</TableCell><TableCell>{device.hub_id.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>zone id</TableCell><TableCell>{device.zone_id.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>site id</TableCell><TableCell>{device.site_id.toString()}</TableCell></TableRow>
                    {/* device !== null && Object.keys(device).map(p => {
                        if(device[p] !== null) {
                            return <TableRow><TableCell>{p}</TableCell><TableCell>{device[p].toString()}</TableCell></TableRow>
                        }
                    }) */}
                </TableBody>
                </Table>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { devices, selectedDevice } = state.app;
    
    return {
        device: devices.filter(d => d.id === selectedDevice)[0] ? devices.filter(d => d.id === selectedDevice)[0] : null
    };
}

const mapDispatchToProps = (dispatch) => ({
    setDevice: (id) => {
        dispatch({type: 'set_device', id})
    }
    
})

const connectedDeviceDetails = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DeviceDetails));
export { connectedDeviceDetails as DeviceDetails }; 