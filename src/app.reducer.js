const initialState = JSON.parse(localStorage.getItem('user')) ? {
    currentPage: 'Dashboard',
    loggedIn: true,
    loggingIn: false,
    message: '',
    tokens: JSON.parse(localStorage.getItem('user')),
    communities: [],
    units: [],
    devices: [],
    zones: [],
    events: [],
    selectedCommunity: '',
    selectedUnit: '',
    selectedZone: '',
    selectedDevice: '',
    graphEvents: []
} : {
        currentPage: 'Dashboard',
        loggedIn: false,
        loggingIn: false,
        message: '',
        tokens: {},
        communities: [],
        units: [],
        devices: [],
        zones: [],
        events: [],
        selectedCommunity: '',
        selectedUnit: '',
        selectedZone: '',
        selectedDevice: '',
        graphEvents: [],
        fetchingGraphEvents: false
    }

const difference = (a1, a2) => {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
        if (a2.indexOf(a1[i]) === -1) {
            result.push(a1[i]);
        }
    }
    return result;
}

export function app(state, action) {
    if (typeof state === 'undefined') {
        return initialState
    }
    switch (action.type) {

        case 'get_graph_events_request':
            return {
                ...state,
                fetchingGraphEvents: true
            }

        case 'get_graph_events_success':
            return {
                ...state,
                graphEvents: action.json,
                fetchingGraphEvents: false
            }

        case 'get_graph_events_failure':
            return {
                ...state,
                fetchingGraphEvents: false
            }

        case 'set_device':
            return {
                ...state,
                selectedDevice: action.id
            }

        case 'set_zone':
            return {
                ...state,
                selectedZone: action.id,
                selectedDevice: ''
            }

        case 'set_unit':
            return {
                ...state,
                selectedUnit: action.id,
                currentPage: 'Unit',
                selectedZone: '',
                selectedDevice: '',
                zones: [],
                devices: [],
                graphEvents: []
            }

        case 'set_community':
            return {
                ...state,
                selectedCommunity: action.id,
                currentPage: state.currentPage === 'Dashboard' ? 'Community' : state.currentPage,
                selectedDevice: '',
                selectedUnit: '',
                selectedZone: '',
                devices: [],
                zones: [],
                units: []
            }

        case 'change_page':
            return {
                ...state,
                currentPage: action.page
            }

        case 'get_active_events_request':
            return {
                ...state
            }

        case 'get_active_events_success':
            return {
                ...state,
                events: action.json
            }

        case 'get_active_events_failure':
            return {
                ...state
            }

        case 'get_zones_request':
            return {
                ...state
            }

        case 'get_zones_success':
            return {
                ...state,
                zones: action.json,
                selectedZone: action.json[0].id
            }

        case 'get_zones_failure':
            return {
                ...state
            }

        case 'get_devices_request':
            return {
                ...state
            }

        case 'get_devices_success':
            return {
                ...state,
                devices: action.json
            }

        case 'get_devices_failure':
            return {
                ...state
            }


        case 'get_units_request':
            return {
                ...state
            }

        case 'get_units_success':
            return {
                ...state,
                units: action.json
            }

        case 'get_units_failure':
            return {
                ...state
            }

        case 'refreshed':
            return {
                ...state,
                tokens: action.data
            }

        case 'get_communities_request':
            return {
                ...state
            }

        case 'get_communities_success':
            return {
                ...state,
                communities: action.json.map(c => {
                    return {
                        ...c,
                        name: c.id
                    }
                })
            }

        case 'get_communities_failure':
            return {
                ...state
            }

        case 'login_request':
            return {
                ...state,
                loggingIn: true
            }

        case 'login_success':
            return {
                ...state,
                loggedIn: true,
                loggingIn: false,
                tokens: action.json
            }

        case 'login_failure':
            return {
                ...state,
                loggingIn: false,
                message: action.error
            }

        case 'logout':
            return {
                currentPage: 'Dashboard',
                loggedIn: false,
                loggingIn: false,
                message: '',
                tokens: {},
                communities: [],
                units: [],
                devices: [],
                zones: [],
                events: [],
                selectedCommunity: '',
                selectedUnit: '',
                selectedZone: '',
                selectedDevice: ''
            }

        default:
            return state
    }
}