import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import { withStyles } from '@material-ui/core/styles'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line'
import bb from 'billboard.js'
import "billboard.js/dist/theme/insight.css"


const styles = theme => ({
  activityGraph: {
  }
})


class ActivityGraph extends React.Component {

  componentDidMount() {
    this._renderChart(this.props.graphEvents)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.graphEvents.motion_events !== this.props.graphEvents.motion_events) {
      if (this.props.graphEvents.motion_events.length !== 0) this._renderChart(this.props.graphEvents)
    }
  }

  _renderChart(graphEvents) {

    const motion = graphEvents.motion_events ? graphEvents.motion_events.map(e => ({ zone: e.zone_type, x: new Date(e.report_time), y: e.is_motion_detected })) : []

    Array.from(new Set(motion.map(e => e.zone))).map((z, i) => {
      const zone = z.replace(/ /g,'')
      bb.generate({
        size: {
          height: 85
        },
        data: {
          color: function(color, d) { return '#179fec' },
          x: 'x',
          columns: [
            ['x', ...motion.filter(e => e.zone === z).map(e => e.x)],
            ['motion', ...motion.filter(e => e.zone === z).map(e => e.y)]
          ],
          type: 'area-step',
          xFormat: "yyyy-MM-dd'T'HH:mm:ssZ"
        },
        line: {
          "step": {
            "type": "step-after"
          }
        },
        zoom: {
          enabled: true
        },
        axis: {
          x: {
            type: 'timeseries',
            show: true,
            tick: {
              format: "%m/%d %H:%M",
              fit: false,
              culling: {
                max: 5
              },
            },
            extent: [new Date(Date.now() - (86400000)), new Date(Date.now())]
          },
          y: {
            show: false
          }
        },
        legend: {
          show: false
        },
        tooltip: {
          show: true
        },
        bindto: "#" + zone,
      });
    })


  }

  render() {
    const { classes, graphEvents } = this.props

    const motion = graphEvents.motion_events ? graphEvents.motion_events.map(e => ({ zone: e.zone_type, x: new Date(e.report_time), y: e.is_motion_detected })) : []

    return (
      <Fragment>
        {motion === [] ? <div style={{display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>No events to show</div> : Array.from(new Set(motion.map(e => e.zone))).map((z, i) =>
          <Paper key={z.replace(/ /g,'')} style={{ padding: '5px', marginBottom: '1%', overflow: 'hidden', width: '100%' }}>
            <div key={z.replace(/ /g,'')}>
              <div style={{ paddingLeft: '10px' }}>{z}</div>
              <div id={z.replace(/ /g,'')}></div>
            </div>
          </Paper>
        )}
      </Fragment>
    )
  }
}


function mapStateToProps(state) {
  const { graphEvents } = state.app;

  return {
    graphEvents
  };
}

const mapDispatchToProps = (dispatch) => ({

})

const connectedActivityGraph = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ActivityGraph));
export { connectedActivityGraph as ActivityGraph }; 