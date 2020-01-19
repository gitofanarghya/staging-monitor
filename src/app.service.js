export const appService = {
    login,
    getCommunities,
    getUnits,
    getDevices,
    getZones,
    getActiveEvents,
    getGraphEvents
}

function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.access_token) {
        return { "Content-Type": "application/json",
            "authorization": `Bearer ${user.access_token}` 
        };
    } else {
        return {};
    }
}

function getGraphEvents(id) {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://activity-dot-care-api-prod.appspot.com/browse/site_data?site_id=${id}`, requestOptions)
        .then(handleResponse)
}

function getActiveEvents() {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://care-api-prod.appspot.com/events?get_all=1&status=unassigned,assigned`, requestOptions)
        .then(handleResponse)
}

function getZones(id) {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://dm-dot-care-api-prod.appspot.com/sites/${id}/zones`, requestOptions)
        .then(handleResponse)
}

function getDevices(id) {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://dm-dot-care-api-prod.appspot.com/sites/${id}/devices`, requestOptions)
        .then(handleResponse)
}

function getUnits(id) {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://care-api-prod.appspot.com/units?community_id=${id}`, requestOptions)
        .then(handleResponse)
}


function getCommunities() {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://care-api-prod.appspot.com/communities?get_all=1`, requestOptions)
        .then(handleResponse)
}

function login(username, password) {
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            "grant_type": "password",
            "email": username,
            "password": password,
            "client_id": "rTZ61c51XXJriPBSoGReIeZ7W7MjWy"
        })
    };

    return fetch(`https://care-api-prod.appspot.com/oauth2/tokens`, requestOptions)
        .then(handleResponse)
}

function handleResponse(response) {
    return response.json().then(json => {
        if (!response.ok) {
            const error = JSON.stringify((json.error && json.error.message) || response.statusText);
            return Promise.reject(error);
        }
        return json;
    });
}