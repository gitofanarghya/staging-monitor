import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { appService } from '../app.service';
import {withStyles} from '@material-ui/core/styles'
import { UnitList } from './UnitList';
import { Paper } from '@material-ui/core';
import { CalendarGraph } from './CalendarGraph';
import { ColumnGraph } from './ColumnGraph';

const styles = theme => ({
    root: {
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
    }
})


class Community extends React.Component {

    render() {
        const { classes } = this.props
        
        return(
            <Fragment>
                <Grid container className={classes.root}>
                    <Grid item className={classes.unitList}>
                        <Paper>
                            <UnitList />
                        </Paper>
                    </Grid>
                    <Grid item className={classes.graph}>
                        <Paper>
                            <CalendarGraph />
                        </Paper>
                        <Paper style={{marginTop: 20}}>
                            <ColumnGraph />
                        </Paper>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const {  } = state.app;
    
    return {
        
    };
}

const mapDispatchToProps = (dispatch) => ({
    dataRefresh: () => {
    }
})

const connectedCommunity = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Community));
export { connectedCommunity as Community }; 