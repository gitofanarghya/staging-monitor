import React from 'react';
import { connect } from 'react-redux';
/* import { HomePage } from '../HomePage'; */
import { LoginPage } from './Login/LoginPage';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { HomePage } from './Home/HomePage';

class App extends React.Component {

    state = {
        open: false,
        message: ''
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.props.clearAlert()
        this.setState({ open: false, message: '' });
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.message !== this.props.message) {
            if(this.state.open) {
                this.setState({open:false})
                this.setState({open: true, message: nextProps.message})
            } else {
                this.setState({open: true, message: nextProps.message})
            }
        }
    }
    
    render() {
        return ( 
                <div className="h-100">
                {this.props.loggedIn ? <HomePage /> : <LoginPage />}
                <Snackbar
                    key={Date.now()}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    disableWindowBlurListener
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                    action={[
                        <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                    />
                </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggedIn, message } = state.app
    return {
        loggedIn,
        message,
    };
}


const mapDispatchToProps = (dispatch) => ({
    clearAlert: () => {
      dispatch({type: 'clear_alert'})
    }
})


const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App }; 