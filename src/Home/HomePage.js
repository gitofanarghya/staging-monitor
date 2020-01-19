import React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import { NavBar } from './NavBar'
import { appService } from '../app.service';
import {Dashboard} from '../Dashboard/Dashboard'
import { Community } from '../Community/Community';
import { Unit } from '../Unit/Unit';



class HomePage extends React.Component {

    hidden = null
    visibilityChange = null
    triedRefreshing = false
    refreshTimeOut = null
    dataRefreshTimeOut = null
    
    componentDidMount = () => {
        this.props.init()
        this.refreshTimeOut = setTimeout(this.refresh, 3000000)   
        this.dataRefreshTimeOut = setTimeout(this.dataRefresh, 60000)       
        window.addEventListener('online', this.onLineCheckAndRefresh)
        window.addEventListener('storage', (event) => this.storageChange(event), false)

        if (typeof document.hidden !== "undefined") { 
            this.hidden = "hidden";
            this.visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            this.hidden = "msHidden";
            this.visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            this.hidden = "webkitHidden";
            this.visibilityChange = "webkitvisibilitychange";
        }

        if (typeof document.addEventListener === "undefined" || this.hidden === undefined) {
            console.log("Some features may not work on this browser. Please refresh page if app breaks!");
        } else {
            document.addEventListener(this.visibilityChange, this.visibilityCheckAndRefresh, false);
        }
    }

    visibilityCheckAndRefresh = () => {
        if(document[this.hidden] === false) {
            if(this.triedRefreshing) {
                this.props.refresh()
                this.triedRefreshing = false
            }
        }
    }

    onLineCheckAndRefresh = () => {
        if(document[this.hidden] === false) {
            this.props.refresh()
            this.triedRefreshing = false
        } else {
            this.triedRefreshing = true
        }
    }

    storageChange = (event) => {
        if(event.key === 'user' && document[this.hidden]) {
            if(JSON.parse(localStorage.getItem('user')) === null) {
                this.props.softLogout()
            }
            if(JSON.parse(localStorage.getItem('user')) && this.props.user.user_id !== JSON.parse(localStorage.getItem('user')).user_id) {
                this.props.softLogout()
            }
        }
    }
    

    refresh = (continueInterval = true) => {
        if(!document[this.hidden]) {
            this.props.refresh()
        } else {
            this.triedRefreshing = true
        }
        if(continueInterval) {
            this.refreshTimeOut = setTimeout(this.refresh, 3000000)
        }   
    }

    dataRefresh = (continueInterval = true) => {
        if(!document[this.hidden] && navigator.onLine) {
            this.props.dataRefresh()
        }
        if(continueInterval) {
            this.dataRefreshTimeOut = setTimeout(this.dataRefresh, 60000)
        }
    }

    componentWillUnmount = () => {
        clearTimeout(this.refreshTimeOut)
        clearTimeout(this.dataRefreshTimeOut)
    }

    render() {
        const { currentPage } = this.props
        
        return(
            <NavBar>
                {
                    currentPage === 'Dashboard' && <Dashboard /> ||
                    currentPage === 'Community' && <Community /> ||
                    currentPage === 'Unit' && <Unit />
                }    
            </NavBar>
        )
    }
}



function mapStateToProps(state) {
    const { currentPage } = state.app;
    
    return {
        currentPage
    };
}

const mapDispatchToProps = (dispatch) => ({
    init: () => {
        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "grant_type": "refresh_token",
                "refresh_token": localStorage.getItem('user') === null ? null : JSON.parse(localStorage.getItem('user'))['refresh_token'],
                "client_id": "rTZ61c51XXJriPBSoGReIeZ7W7MjWy"
            })
        };

        fetch(`https://care-api-prod.appspot.com/oauth2/tokens`, requestOptions)
            .then(response => response.json().then(data => {
                    if(!response.ok) {
                        localStorage.removeItem('user');
                        dispatch({type: 'logout'});
                    } else {
                        localStorage.setItem('user', JSON.stringify(data));
                        dispatch({ type: 'refreshed', data })
                        dispatch({type: 'get_active_events_request'})
                        appService.getActiveEvents()
                            .then(json => {
                                dispatch({type: 'get_active_events_success', json})
                            }, error => {
                                dispatch({type: 'get_activeEvents_failure'})
                            })
                        /* if(!JSON.parse(localStorage.getItem('communities'))) { */
                            dispatch({type: 'get_communities_request'})
                            appService.getCommunities()
                                .then(json => {
                                    dispatch({type: 'get_communities_success', json})
                                    /* json.map(c => {
                                        dispatch({type: 'get_units_request', name: c.name})
                                        appService.getUnits(c.id)
                                            .then(json1 => {
                                                dispatch({type: 'get_units_success', name: c.name, json: json1})
                                                json1.map(u => {
                                                    dispatch({type: 'get_devices_request', cname: c.name, uname: u.name})
                                                    appService.getDevices(u.id)
                                                        .then(json2 => {
                                                            dispatch({type: 'get_devices_success', cname: c.name, uname: u.name, json: json2})
                                                        }, error2 => {
                                                            dispatch({type: 'get_devices_failure', cname: c.name, uname: u.name, error: error2})
                                                            setTimeout(() => {
                                                                appService.getDevices(u.id)
                                                                    .then(json4 => {
                                                                        dispatch({type: 'get_devices_success', cname: c.name, uname: u.name, json: json4})
                                                                    }, error4 => {
                                                                        dispatch({type: 'get_devices_failure', cname: c.name, uname: u.name, error: error4})
                                                                    })
                                                            }, 2000)
                                                        }) 
                                                    dispatch({type: 'get_zones_request', cname: c.name, uname: u.name})
                                                    appService.getZones(u.id)
                                                        .then(json3 => {
                                                            dispatch({type: 'get_zones_success', cname: c.name, uname: u.name, json: json3})
                                                        }, error3 => {
                                                            dispatch({type: 'get_zones_failure', cname: c.name, uname: u.name, error: error3})
                                                        }) 
                                                })
                                            }, error1 => {
                                                dispatch({type: 'get_units_failure', name: c.name, error1})
                                            })
                                    }) */
                                }, error => {
                                    dispatch({type: 'get_communities_failure', error})
                                })
                        /* } */
                        
                    }    
                })
            )
    },
    refresh: () => {
        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "grant_type": "refresh_token",
                "refresh_token": localStorage.getItem('user') === null ? null : JSON.parse(localStorage.getItem('user'))['refresh_token'],
                "client_id": "rTZ61c51XXJriPBSoGReIeZ7W7MjWy"
            })
        };

        fetch(`https://care-api-prod.appspot.com/oauth2/tokens`, requestOptions)
            .then(response => response.json().then(data => {
                    if(!response.ok) {
                        localStorage.removeItem('user');
                        dispatch({type: 'logout'});
                    } else {
                        localStorage.setItem('user', JSON.stringify(data));
                        dispatch({ type: 'REFRESHED', data })
                    }    
                })
            )
    },
    softLogout: () => {
        dispatch({type: 'logout'});
    },
    dataRefresh: () => {
        dispatch({type: 'get_active_events_request'})
        appService.getActiveEvents()
            .then(json => {
                dispatch({type: 'get_active_events_success', json})
            }, error => {
                dispatch({type: 'get_activeEvents_failure'})
            })
    }
})

const connectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export { connectedHomePage as HomePage }; 