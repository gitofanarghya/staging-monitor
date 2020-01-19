import React from 'react';
import * as serviceWorker from './serviceWorker';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { store } from './helpers/store';
import { App } from './App';
import './index.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1ADCFF',
      dark: '#179FEC',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ccc'
    },
    overrides: {
      MuiSelect: {
        select: {
          "&:focus": {
            background: "transparent"
          }
        }
      }
    }
  }
  });

render(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
