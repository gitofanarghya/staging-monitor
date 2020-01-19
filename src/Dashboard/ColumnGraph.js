import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import {withStyles} from '@material-ui/core/styles'
import { Typography, IconButton, MenuItem, Menu } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { ResponsiveBarCanvas } from '@nivo/bar'

const styles = theme => ({
    calendar: {
        height: '225px'
    }
})


class ColumnGraph extends React.Component {

    state = {
        selectedCommunity: '',
        anchorEl: null,
    }

    handleClick = event => {
        this.setState({ ...this.state, anchorEl: event.currentTarget });
    };


    handleClose = () => {
        this.setState({...this.state, anchorEl: null})
    }

    handleSelectEventType = (e) => {
        if(this.state.selectedCommunity.indexOf(e) === -1) {
            this.setState({...this.state, selectedCommunity: [...this.state.selectedCommunity, e]})
        } else {
            this.setState({...this.state, selectedCommunity: [...this.state.selectedCommunity.filter(et => et !== e)]})
        }
    }


    render() {
        const { classes, events, communities, eventTypes } = this.props
        const { anchorEl } = this.state
        
        const filteredEventsByCommunity = this.state.selectedCommunity.length === 0 ? events : events.filter(e => this.state.selectedCommunity.indexOf(e.community_id) !== -1)

        let tempres = []

        filteredEventsByCommunity.map(e => {
          tempres[e.day] = {
              ...tempres[e.day] ? tempres[e.day] : {day: e.day},
              [e.event_type]: tempres[e.day] && tempres[e.day][e.event_type] ? tempres[e.day][e.event_type] + 1 : 1,
              [`${e.event_type}Color`]: `#${crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, 0)}`
          }  
        })

        const data = Object.values(tempres).sort((a, b) => {
            if(a.day < b.day) { return -1 }
            if(a.day > b.day) { return  1 }
            return 0
        })
        
        return(
            <Fragment>
                <div style={{display: 'flex'}}>
                    <Typography variant="h6" style={{marginLeft: '16px'}}>
                        Notifications - week
                    </Typography>
                    <div style={{marginLeft: 'auto'}}>
                        <IconButton 
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            title='Filter by communities'
                            onClick={this.handleClick}
                        >
                            <FilterListIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                            >
                            <MenuItem onClick={() => this.setState({...this.state, selectedCommunity: []})} style={this.state.selectedCommunity.length === 0 ? {backgroundColor: '#1ADCFF', color: '#ffffff'} : {}}>None</MenuItem>
                            {communities.map(e => 
                                <MenuItem key={e.id} onClick={() => this.handleSelectEventType(e.id)} style={this.state.selectedCommunity.indexOf(e.id) !== -1 ? {backgroundColor: '#1ADCFF', color: '#ffffff'} : {}}>{e.name}</MenuItem>    
                            )}
                        </Menu>
                    </div>
                </div>
                <div className={classes.calendar}>
                <ResponsiveBarCanvas
                    data={data}
                    keys={Array.from(eventTypes)}
                    indexBy="day"
                    margin={{ top: 5, right: 150, bottom: 40, left: 60 }}
                    padding={0.3}
                    groupMode="stacked"
                    layout="horizontal"
                    colors={{ scheme: 'nivo' }}
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'no. of events',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'day',
                        legendPosition: 'middle',
                        legendOffset: -50
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'top-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
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
            day = '' + d.getDate()
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [month, day].join('-');
    }

    const eventsFromLast7Days = events.filter(e => Date.parse(e.time_created)/1000 > new Date().getTime()/1000 - (7*24*3600))

    const eventsWithFormattedDate = eventsFromLast7Days.map(e => ({day: formatDate(e.time_created), event_type: e.event_type, community_id: e.community_id}))

    const distinctEventTypes = new Set([...events.map(e => e.event_type)])

    return { events: eventsWithFormattedDate, communities, eventTypes: distinctEventTypes };
}

const mapDispatchToProps = (dispatch) => ({
    dataRefresh: () => {
    }
})

const connectedColumnGraph = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ColumnGraph));
export { connectedColumnGraph as ColumnGraph }; 