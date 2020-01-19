import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { app } from '../app.reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  app
});

const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    applyMiddleware(
        loggerMiddleware,
    )
);