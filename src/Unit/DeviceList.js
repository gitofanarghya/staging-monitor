import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import {withStyles} from '@material-ui/core/styles'
import { Typography, Badge, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import BatteryLowIcon from '@material-ui/icons/BatteryAlert'
import PowerOffIcon from '@material-ui/icons/PowerOff'

const styles = theme => ({
    deviceList: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        flexWrap: 'wrap'
    },
    device: {
        margin: 10,
        width: 20,
        height: 30
    },
    deviceDiv: {
        opacity: 0.75,
        cursor: 'pointer',
        '&:hover': {
            opacity: 1
        }
    }
})

const StyledBadge = withStyles(theme => ({
        badge: {
            right: '50%'
        },
    }))(Badge);

const StyledBadge1 = withStyles(theme => ({
        badge: {
            top: '50%',
            right: '75%',
            color: 'red'
        },
    }))(Badge);

const StyledBadge2 = withStyles(theme => ({
        badge: {
            top: '50%',
            right: '25%'
        },
    }))(Badge);

class DeviceList extends React.Component {

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.devices.length > 0 && nextProps.selectedZone !== this.props.selectedZone) {
            this.props.setDevice(nextProps.devices[0].id)
        } else if(nextProps.devices.length > 0 && this.props.devices.length === 0) {
            this.props.setDevice(nextProps.devices[0].id)
        }
    }

    render() {
        const { classes, devices, zoneName, selectedDevice, device } = this.props

        return(
            <Fragment>
                <Typography variant="h6" style={{marginLeft: '16px'}}>
                    {zoneName}
                </Typography>
                <div className={classes.deviceList}>
                    {devices.map(d => {
                        switch (d.device_type) {
                            case 'bulb':
                                return <div key={d.id} className={classes.deviceDiv} onClick={() => this.props.setDevice(d.id)}><StyledBadge2 invisible={d.is_connected} badgeContent={<PowerOffIcon />} ><StyledBadge className={classes.margin} variant='dot' invisible={d.id !== selectedDevice} color="primary"><img key={d.id} className={classes.device} src='bulb_hover.png'/></StyledBadge></StyledBadge2></div>
                            case 'sensor':
                                if(d.sensor_type === 'motion') {
                                    return <div key={d.id} className={classes.deviceDiv} onClick={() => this.props.setDevice(d.id)}><StyledBadge2 invisible={d.is_connected} badgeContent={<PowerOffIcon />} ><StyledBadge1 invisible={d.battery_voltage > d.battery_voltage_threshold} badgeContent={<BatteryLowIcon />}><StyledBadge className={classes.margin} variant='dot' invisible={d.id !== selectedDevice} color="primary"><img key={d.id} className={classes.device} src='sensor_hover.png'/></StyledBadge></StyledBadge1></StyledBadge2></div>
                                } else {
                                    return <div key={d.id} className={classes.deviceDiv} onClick={() => this.props.setDevice(d.id)}><StyledBadge2 invisible={d.is_connected} badgeContent={<PowerOffIcon />} ><StyledBadge1 invisible={d.battery_voltage > d.battery_voltage_threshold} badgeContent={<BatteryLowIcon />}><StyledBadge className={classes.margin} variant='dot' invisible={d.id !== selectedDevice} color="primary"><img key={d.id} className={classes.device} src='contact.png'/></StyledBadge></StyledBadge1></StyledBadge2></div>
                                }
                                
                            case 'switch':
                                return <div key={d.id} className={classes.deviceDiv} onClick={() => this.props.setDevice(d.id)}><StyledBadge2 invisible={d.is_connected} badgeContent={<PowerOffIcon />} ><StyledBadge1 invisible={d.battery_voltage > d.battery_voltage_threshold} badgeContent={<BatteryLowIcon />}><StyledBadge className={classes.margin} variant='dot' invisible={d.id !== selectedDevice} color="primary"><img key={d.id} className={classes.device} src='switch_hover.png'/></StyledBadge></StyledBadge1></StyledBadge2></div>
                            case 'outlet':
                                return <div key={d.id} className={classes.deviceDiv} onClick={() => this.props.setDevice(d.id)}><StyledBadge2 invisible={d.is_connected} badgeContent={<PowerOffIcon />} ><StyledBadge className={classes.margin} variant='dot' invisible={d.id !== selectedDevice} color="primary"><img key={d.id} className={classes.device} src='outlet.png'/></StyledBadge></StyledBadge2></div>
                        }
                    })}
                </div>
                <Table size="small">
                <TableHead className={classes.scrollAdjust}>
                    <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>{device !== null && 
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
                    <TableRow><TableCell>last joined at</TableCell><TableCell>{device.last_joined_at.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>created at</TableCell><TableCell>{device.created_at.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>id</TableCell><TableCell>{device.id.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>hub id</TableCell><TableCell>{device.hub_id.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>zone id</TableCell><TableCell>{device.zone_id.toString()}</TableCell></TableRow>
                    <TableRow><TableCell>site id</TableCell><TableCell>{device.site_id.toString()}</TableCell></TableRow>
                    {device !== null && Object.keys(device).map(p => {
                        if(device[p] !== null && ['device_type', 'sensor_type', 'manufacturer', 'model', 'mac_address', 'network_address', 'firmware_vs', 'hw_vs', 'is_connected', 'endpoints', 'last_contact_time', 'last_joined_time', 'created_at', 'id', 'hub_id', 'zone_id', 'site_id'].indexOf(p) === -1) {
                            return <TableRow key={p}><TableCell>{p}</TableCell><TableCell>{device[p].toString()}</TableCell></TableRow>
                        }
                    })}
                </TableBody>}
                </Table>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { devices, selectedZone, zones, selectedDevice } = state.app;
    
    return {
        selectedZone,
        selectedDevice,
        devices: devices.filter(z => z.zone_id === selectedZone),
        zoneName: zones.filter(z => z.id === selectedZone)[0] ? zones.filter(z => z.id === selectedZone)[0].name : '',
        device: devices.filter(d => d.id === selectedDevice)[0] ? devices.filter(d => d.id === selectedDevice)[0] : null
    };
}

const mapDispatchToProps = (dispatch) => ({
    setDevice: (id) => {
        dispatch({type: 'set_device', id})
    }
    
})

const connectedDeviceList = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DeviceList));
export { connectedDeviceList as DeviceList }; 