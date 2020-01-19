import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import { withStyles } from '@material-ui/core/styles'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line'

const styles = theme => ({
    activityGraph: {
        height: '64px',
        border: '1px solid',
        marginBottom: '10px',
        overflow: 'visible',
        width: '200%'
    },
    fixed: {
        position: 'fixed', top: 'inherit', left: '280px',
        [theme.breakpoints.down('md')]: {
            left: '50%'
        }
    }
})


class ActivityGraph extends React.Component {

    render() {
        const { classes, graphEvents } = this.props

        const motion = graphEvents.motion_events ? graphEvents.motion_events.map(e => ({ zone: e.zone_type, x: new Date(e.report_time), y: e.is_motion_detected })) : []

        return (
            <Fragment>
                {Array.from(new Set(motion.map(e => e.zone))).map((z, i) =>
                    <div key={z}>
                        <span className={classes.fixed}>{z}</span>
                        <div style={{ height: '20px', width: '100%' }}></div>
                        <div className={classes.activityGraph}>
                            <ResponsiveLine
                                height={Array.from(new Set(motion.map(e => e.zone))).length === i + 1 ? 84 : 64}
                                margin={Array.from(new Set(motion.map(e => e.zone))).length === i + 1 ? { top: 0, right: 0, bottom: 20, left: 0 } : { top: 0, right: 0, bottom: 0, left: 0 }}
                                data={[{ id: z, data: motion.filter(e => e.zone === z) }]}
                                colors={d => "#179FEC"}
                                lineWidth={0}
                                areaOpacity={1}
                                xScale={{
                                    type: 'time',
                                    format: 'native',
                                    min: new Date(Date.now() - (86400000 * 2)),
                                    max: new Date(Date.now())
                                }}
                                xFormat="time:%Y-%m-%d %H:%M"
                                yScale={{
                                    type: 'linear',
                                    stacked: false,
                                }}
                                axisLeft={null}
                                axisBottom={Array.from(new Set(motion.map(e => e.zone))).length === i + 1 ? {
                                    format: '%H:%M',
                                    tickValues: 'every 3 hours'
                                } : null}
                                curve='stepAfter'
                                enablePointLabel={false}
                                enableArea={true}
                                enableGridX={true}
                                enableGridY={false}
                                enablePoints={false}
                                useMesh={false}
                                enableSlices={false}
                            />
                        </div></div>
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