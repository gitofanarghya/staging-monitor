import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import { Loading } from '../helpers/Loading';
import Grid from '@material-ui/core/Grid';
import {appService} from '../app.service';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const styles = theme => ({
    AppBar: {
        backgroundColor: "#525963"
    },
    card: {
        maxHeight: 450
    },
    media: {
        paddingTop: '213.64px',//'56.25%', // 16:9
        backgroundSize: 'contain'
    },
    bigLogo: {
        height: '100%',
        [theme.breakpoints.down(960)]: {
            display: 'none'
        }
    }, 
    smallLogo: {
        height: '100%',
        [theme.breakpoints.up(960)]: {
            display: 'none'
        },
        [theme.breakpoints.down(410)]: {
            display: 'none'
        }
    },
    smallerLogo: {
        height: '100%',
        [theme.breakpoints.up(410)]: {
            display: 'none'
        }
    },
    bigHeading: {
        textAlign: 'center',
        [theme.breakpoints.down(960)]: {
            display: 'none'
        }
    }, 
    smallHeading: {
        textAlign: 'center',
        [theme.breakpoints.up(960)]: {
            display: 'none'
        },
        [theme.breakpoints.down(410)]: {
            display: 'none'
        }
    }, 
    smallerHeading: {
        textAlign: 'center',
        [theme.breakpoints.up(410)]: {
            display: 'none'
        }
    },
    mainPic: {
        height: 450,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
})

class LoginPage extends React.Component {

    state = {
        username: '',
        password: ''
    };


    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            if(username === 'staging_monitor' && password === 'gargoyle$') this.props.login('av_support@stack.care', 'Abcd1234$');
            else this.props.loginFailure()
        }
    }

    render() {
        const { loggingIn, classes } = this.props;
        return ( loggingIn ? <Loading /> :
            <div style={{height: '100%'}}>
            <AppBar className={classes.AppBar} position="static" color="primary">
                <Toolbar disableGutters>
                    <Grid container justify="space-between" alignItems='center' style={{height: '64px'}}>
                        {/* <Grid item xs={2} className={classes.bigLogo}>
                            <img src='/logo-new.png' height='100%'/>
                        </Grid>
                        <Grid item xs={2} className={classes.smallLogo}>
                            <img src='/favicon.ico' height='100%'/>
                        </Grid>
                        <Grid item xs={2} className={classes.smallerLogo}>
                            <img src='/favicon.ico' width='100%' height='100%'/>
                        </Grid> 
                        <Grid item xs={8} className={classes.bigHeading}>
                            <Typography variant="h3">
                                Operations Center
                            </Typography>
                        </Grid>
                        <Grid item xs={8} className={classes.smallHeading}>
                            <Typography variant="h4">
                                Operations Center
                            </Typography>
                        </Grid>
                        <Grid item xs={8} className={classes.smallerHeading}>
                            <Typography variant="h5">
                                Operations Center
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                        </Grid> */}
                    </Grid>
                </Toolbar>            
            </AppBar>
            <Grid container direction="row" justify="center" alignItems='center' style={{height: 'calc(100% - 64px)'}}>
              {/* <Grid xs={6} item className={classes.mainPic}>
                <img src='/WarGames-19832-1024x576.jpg' height='100%' width='100%' />
              </Grid> */}
              <Grid md={3} sm={6} xs={10} item>
              <Card className={classes.card}>
                {/* <CardMedia
                    className={classes.media}
                    image="/logo.png"
                    title="stack care logo"
                /> */}
                <CardContent>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            name="username"
                            label="Email Id"
                            placeholder="Enter your email id"
                            className="email-field"
                            margin="normal"
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <br />
                        <TextField
                            name="password"
                            label="Password"
                            className="password-field"
                            placeholder="Enter your password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <br />
                        <br />
                        <center><Button type="submit" className="submit-button">
                            Login
                        </Button></center>
                    </form>
                </CardContent>
            </Card>
              </Grid>
            </Grid>
            </div>       
        
        )
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.app;
    return {
        loggingIn
    };
}

const mapDispatchToProps = (dispatch) => ({
    login: (username, password) => {
        dispatch({type: 'login_request'});
        appService.login(username, password)
            .then(json => { 
                    localStorage.setItem('user', JSON.stringify(json))
                    dispatch({type: 'login_success', json})
                }, error => {
                    dispatch({type: 'login_failure', error})
                })
    },
    loginFailure: () => {
        dispatch({type: 'login_failure', error: 'invalid credentials'})
    }
})

const connectedLoginPage = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginPage));
export { connectedLoginPage as LoginPage }; 