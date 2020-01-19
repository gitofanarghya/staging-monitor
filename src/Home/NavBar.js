import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/DashboardRounded';
import DomainIcon from '@material-ui/icons/Domain';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { ListItemIcon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SearchBar } from './CommunitySelector';
import { UnitSelector } from './UnitSelector';


const drawerWidth = 250;

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%'
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor: '#179fec',
    height: 100,
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  toolbar: {
      ...theme.mixins.toolbar,
      height: 100
  },
  drawerPaper: {
    width: drawerWidth,
    border: 'none'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: 124,
    width: 'calc(100% - 250px)'
  }
});

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
    open: false
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleClickOpen = () => {
    this.setState({...this.state, open: !this.state.open})
  }

  logout = () => {
    this.props.logout()
  }

  render() {
    const { classes, theme, children } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} style={{ backgroundColor: '#525A62'}}>
            {/* <img src='logo-new.png' width='250px' alt=''></img> */}
        </div>
        <List>
            <ListItem 
                button 
                onClick={() => this.props.changePage('Dashboard')}
                style={this.props.currentPage === 'Dashboard' ? {color: '#1ADCFF', fontWeight: 500, fontSize: 14, backgroundColor: 'transparent'} : {fontWeight: 500, fontSize: 14, backgroundColor: 'transparent'}}
            >
                <ListItemIcon style={{color: 'inherit'}}><DashboardIcon /></ListItemIcon>
                <ListItemText disableTypography primary='Dashboard' />
            </ListItem>
            <ListItem 
                button 
                onClick={() => this.props.changePage('Community')}
                style={this.props.currentPage === 'Community' ? {color: '#1ADCFF', fontWeight: 500, fontSize: 14, backgroundColor: 'transparent'} : {fontWeight: 500, fontSize: 14, backgroundColor: 'transparent'}}
            >
                <ListItemIcon style={{color: 'inherit'}}><DomainIcon /></ListItemIcon>
                <ListItemText disableTypography primary='Community' />
            </ListItem>
            <ListItem 
                button 
                onClick={() => this.props.changePage('Unit')}
                style={this.props.currentPage === 'Unit' ? {color: '#1ADCFF', fontWeight: 500, fontSize: 14, backgroundColor: 'transparent'} : {fontWeight: 500, fontSize: 14, backgroundColor: 'transparent'}}
            >
                <ListItemIcon style={{color: 'inherit'}}><HomeIcon /></ListItemIcon>
                <ListItemText disableTypography primary='Unit' />
            </ListItem>
            <ListItem button onClick={() => this.handleClickOpen()}>
              <ListItemIcon style={{color: 'inherit'}}><ExitToAppIcon /></ListItemIcon>
              <ListItemText disableTypography style={{color: 'inherit', fontWeight: 500, fontSize: 14}} primary='Logout' />
            </ListItem>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" style={{textAlign: 'center'}}>Log out</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description" style={{textAlign: 'center'}}>
                  Are you sure you want to log out of your account?
                </DialogContentText>
              </DialogContent>
                <Button variant='contained' onClick={() => this.logout()} style={{ margin: 'auto', width: '70%', marginBottom: '10px', backgroundColor: '#EC655F', color: 'white' }}>
                  Log out
                </Button>
                <Button variant='contained'  onClick={() => this.handleClickOpen()} style={{ margin: 'auto', width: '70%', marginBottom: '20px', backgroundColor: '#BDC5CB', color: 'white' }}>
                  Cancel
                </Button>
            </Dialog>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" color='primary' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            {this.props.currentPage === 'Community' && <SearchBar /> ||
            this.props.currentPage === 'Unit' && <div><SearchBar /> <UnitSelector /></div> ||
            <Typography variant="h5" color="inherit" noWrap>
                Operations Center
            </Typography>}
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden lgUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden mdDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          {children}
        </main>
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

 
function mapStateToProps(state) {
    const { currentPage } = state.app;
    
    return {
        currentPage
    };
}

const mapDispatchToProps = (dispatch) => ({
    changePage: (page) => {
      dispatch({type: 'change_page', page})
    },
    logout: () => {
        localStorage.removeItem('user')
        dispatch({type: 'logout'})
    }
})
  
const connectedNavBar = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ResponsiveDrawer));
export { connectedNavBar as NavBar }