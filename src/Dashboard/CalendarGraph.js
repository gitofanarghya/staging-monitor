import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import {withStyles} from '@material-ui/core/styles'
import { ResponsiveCalendarCanvas } from '@nivo/calendar'
import { Typography, IconButton, MenuItem, Menu } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';

const styles = theme => ({
    calendar: {
        height: '235px'
    }
})


class CalendarGraph extends React.Component {

    state = {
        selectedEventType: [],
        selectedCommunity: [],
        anchorEl1: null,
        anchorEl2: null,
    }

    handleClick1 = event => {
        this.setState({ ...this.state, anchorEl1: event.currentTarget });
    };

    handleClick2 = event => {
        this.setState({ ...this.state, anchorEl2: event.currentTarget });
    };

    handleClose1 = () => {
        this.setState({...this.state, anchorEl1: null})
    }

    handleClose2 = () => {
        this.setState({...this.state, anchorEl2: null})
    }

    handleSelectEventType = (e) => {
        if(this.state.selectedEventType.indexOf(e) === -1) {
            this.setState({...this.state, selectedEventType: [...this.state.selectedEventType, e]})
        } else {
            this.setState({...this.state, selectedEventType: [...this.state.selectedEventType.filter(et => et !== e)]})
        }
    }

    handleSelectCommunity = (e) => {
        if(this.state.selectedCommunity.indexOf(e) === -1) {
            this.setState({...this.state, selectedCommunity: [...this.state.selectedCommunity, e]})
        } else {
            this.setState({...this.state, selectedCommunity: [...this.state.selectedCommunity.filter(et => et !== e)]})
        }
    }


    render() {
        const { classes, events, eventTypes, communities } = this.props
        const { anchorEl1, anchorEl2 } = this.state
        
        const filteredEventsByEventType = this.state.selectedEventType.length === 0 ? events : events.filter(e => this.state.selectedEventType.indexOf(e.event_type) !== -1)
        const filteredEventsByCommunity = this.state.selectedCommunity.length === 0 ? filteredEventsByEventType : filteredEventsByEventType.filter(e => this.state.selectedCommunity.indexOf(e.community_id) !== -1)
        let tempres = []

        for(let { day } of filteredEventsByCommunity) {
            tempres[day] = {
                day,  
                value: tempres[day] ? tempres[day].value + 1 : 1
            }      
        }

        const finalData = Object.values(tempres)
        
        return(
            <Fragment>
                <div style={{display: 'flex'}}>
                    <Typography variant="h6" style={{marginLeft: '16px'}}>
                        Notifications - overall
                    </Typography>
                    <div style={{marginLeft: 'auto'}}>
                        <IconButton 
                            aria-owns={anchorEl1 ? 'event-type-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick1}
                            title='Filter by type of event'
                        >
                            <FilterListIcon />
                        </IconButton>
                        <Menu
                            id="event-type-menu"
                            anchorEl={anchorEl1}
                            open={Boolean(anchorEl1)}
                            onClose={this.handleClose1}
                            >
                            <MenuItem onClick={() => this.setState({...this.state, selectedEventType: []})} style={this.state.selectedEventType.length === 0 ? {backgroundColor: '#1ADCFF', color: '#ffffff'} : {}}>None</MenuItem>
                            {Array.from(eventTypes).map(e => 
                                <MenuItem key={e} onClick={() => this.handleSelectEventType(e)} style={this.state.selectedEventType.indexOf(e) !== -1 ? {backgroundColor: '#1ADCFF', color: '#ffffff'} : {}}>{e}</MenuItem>    
                            )}
                        </Menu>
                        <IconButton 
                            aria-owns={anchorEl2 ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            title='Filter by communities'
                            onClick={this.handleClick2}
                        >
                            <FilterListIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl2}
                            open={Boolean(anchorEl2)}
                            onClose={this.handleClose2}
                            >
                            <MenuItem onClick={() => this.setState({...this.state, selectedCommunity: []})} style={this.state.selectedCommunity.length === 0 ? {backgroundColor: '#1ADCFF', color: '#ffffff'} : {}}>None</MenuItem>
                            {communities.map(e => 
                                <MenuItem key={e.id} onClick={() => this.handleSelectCommunity(e.id)} style={this.state.selectedCommunity.indexOf(e.id) !== -1 ? {backgroundColor: '#1ADCFF', color: '#ffffff'} : {}}>{e.name}</MenuItem>    
                            )}
                        </Menu>
                    </div>
                </div>
                <div className={classes.calendar}>
                    <ResponsiveCalendarCanvas
                        data={finalData}
                        align='top-left'
                        from="2018-01-01"
                        to="2019-12-31"
                        emptyColor="#eeeeee"
                        colors={[ '#97e3d5', '#61cdbb', '#e8c1a0', '#f47560' ]}
                        margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
                        yearSpacing={40}
                        monthBorderColor="#000000"
                        dayBorderWidth={1}
                        dayBorderColor="#000000"
                        legends={[
                            {
                                anchor: 'bottom-left',
                                direction: 'row',
                                translateY: 36,
                                itemCount: 4,
                                itemWidth: 42,
                                itemHeight: 36,
                                itemsSpacing: 14,
                                itemDirection: 'left-to-right'
                            }
                        ]}
                    />
                </div>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { events, communities } = state.app;

    const formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
    }

    const eventsWithFormattedDate = events.map(e => ({day: formatDate(e.time_created), event_type: e.event_type, community_id: e.community_id}))

    const distinctEventTypes = new Set([...events.map(e => e.event_type)])
    
    return { events: eventsWithFormattedDate, eventTypes: distinctEventTypes, communities };
}

const mapDispatchToProps = (dispatch) => ({
    dataRefresh: () => {
    }
})

const connectedCalendarGraph = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CalendarGraph));
export { connectedCalendarGraph as CalendarGraph }; 