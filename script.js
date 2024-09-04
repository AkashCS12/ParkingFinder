mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;

var map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/fooba-/cltagn3kg015l01pi9bpc56z5',
    center: [77.41962097802912, 23.26374719462932],
    zoom: 9
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Enter a location",
    types: 'place,postcode,locality,address'
});

document.querySelector('.search-container').appendChild(geocoder.onAdd(map));

map.addControl(new mapboxgl.NavigationControl());

var searchClicked = false;
var userLocationMarker = new mapboxgl.Marker();

function searchLocation() {
    var query = document.querySelector('.search-input').value;
    geocoder.query(query);
    searchClicked = true;
    hideSuggestions();
}

function redirectToSignUp() {
    window.location.href = "SignUp/sign-up.html";
}

function redirectToAbout() {
    window.location.href = "AboutUs/about.html";
}

function updateSuggestions() {
    var query = document.querySelector('.search-input').value;
    if (query.length > 0) {
        searchClicked = false;
        fetchSuggestions(query);
    } else {
        hideSuggestions();
    }
}

function fetchSuggestions(query) {
    fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=' + mapboxgl.accessToken)
        .then(response => response.json())
        .then(data => {
            displaySuggestions(data.features);
        })
        .catch(error => console.error('Error fetching suggestions:', error));
}

function displaySuggestions(features) {
    var suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = "";
    features.forEach(function (feature) {
        var suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = feature.place_name;
        suggestionItem.onclick = function () {
            document.querySelector('.search-input').value = feature.place_name;
            map.flyTo({
                center: feature.center,
                zoom: 12
            });
            hideSuggestions();
        };
        suggestionsDiv.appendChild(suggestionItem);
    });
    suggestionsDiv.style.display = 'block';
}

function hideSuggestions() {
    document.getElementById('suggestions').style.display = 'none';
}

var styleSelector = document.getElementById('map-style');
styleSelector.addEventListener('change', function() {
    var selectedStyle = styleSelector.value;
    map.setStyle(selectedStyle);
});

function navigateToUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            if (map.getSource('navigation')) {
                map.removeSource('navigation');
                map.removeLayer('navigation-route');
            }
            userLocationMarker.setLngLat([position.coords.longitude, position.coords.latitude]);
            userLocationMarker.addTo(map);
            var userCoordinates = [position.coords.longitude, position.coords.latitude];
            var setLocationCoordinates = map.getCenter();
            var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + userCoordinates[0] + ',' + userCoordinates[1] + ';' + setLocationCoordinates.lng + ',' + setLocationCoordinates.lat + '?geometries=geojson&steps=true&access_token=' + mapboxgl.accessToken;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var route = data.routes[0].geometry;
                    if (map.getSource('navigation')) {
                        map.removeSource('navigation');
                        map.removeLayer('navigation-route');
                    }
                    map.addSource('navigation', {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': route
                        }
                    });
                    map.addLayer({
                        'id': 'navigation-route',
                        'type': 'line',
                        'source': 'navigation',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#007bff',
                            'line-width': 8
                        }
                    });
                })
                .catch(error => console.error('Error fetching route:', error));
            map.flyTo({
                center: userCoordinates,
                zoom: 12
            });
        }, function(error) {
            console.error('Error getting user location:', error);
            alert('Error getting user location. Please enable location services or try again later.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function redirectToLargeMap() {
    window.location.href = "LargeMap.html";
}

function redirectToMain() {
    window.location.href = "index.html";
}

var specificLocations = [
    {
        name: "Minal Mall Parking Lot",
        coordinates: [77.45571845, 23.27373897],
        popupContent: "<h3 style='color: black;'>Minal Mall Parking Lot</h3>",
        address: "28, 28, JK Rd, near Allahabad Bank, Minal Residency, Bhopal, Madhya Pradesh 462023" 
    },

    {
        name: "VEER VALET PARKING",
        coordinates: [77.46292823, 23.27058507],
        popupContent: "<h3 style='color: black;'>VEER VALET PARKING</h3>",
        address: "Nizamuddin Rd, Durgesh Vihar, Ayodhya Nagar, Bhopal, Madhya Pradesh 462022" 
    },

    {
        name: "Parking MPSEDC",
        coordinates: [77.42962592,	23.24976749],
        popupContent: "<h3 style='color: black;'>Parking MPSEDC</h3>",
        address: "6CVH+9W8, Opposites Maida Mill, Arera Hills, Bhopal, Madhya Pradesh 462011" 
    },

    {
        name: "Smart Parking Bhopal",
        coordinates: [77.43443244,	23.24030389],
        popupContent: "<h3 style='color: black;'>Smart Parking Bhopal</h3>",
        address: "No.202, Plot, Ram Gopal Maheshwari Marg, MP Nagar Zone-I, Zone-I, Maharana Pratap Nagar, Bhopal, Madhya Pradesh 462011" 
    },

    {
        name: "Parking Area",
        coordinates: [77.43099921,	23.24787483],
        popupContent: "<h3 style='color: black;'>Parking Area</h3>",
        address: "6CVJ+33C, Arera Hills, Bhopal, Madhya Pradesh 462011" 
    },

    {
        name: "bp Parking Lot",
        coordinates: [77.43271583,	23.23967295],
        popupContent: "<h3 style='color: black;'>bp Parking Lot</h3>",
        address: "Plot No-178, Chitra Complex, Near Hotel Surendra Vilas, Zone-I, Maharana Pratap Nagar, Bhopal, Madhya Pradesh 462023" 
    },
    
    {
        name: "Parking Lot",
        coordinates: [77.44061225,	23.22642271],
        popupContent: "<h3 style='color: black;'>Parking Lot</h3>",
        address: "6CPM+2V Bhopal, Madhya Pradesh" 
    },
    
    {
        name: "Parking",
        coordinates: [77.43580573,	23.2358873],
        popupContent: "<h3 style='color: black;'>Parking</h3>",
        address: "6CJP+H9Q, Nagar Nigam, Zone-II, Maharana Pratap Nagar, Bhopal, Madhya Pradesh 462023" 
    },
    
    {
        name: "Smart Parking 1B",
        coordinates: [77.43443244,	23.22074363],
        popupContent: "<h3 style='color: black;'>Smart Parking, Parking Lot 1- B</h3>",
        address: "10 No. Market, 17, Main Rd No. 3, E-4, Arera Colony, Bhopal, Madhya Pradesh 462016" 
    },
    
    {
        name: "Parking Multilevel",
        coordinates: [77.40284675,	23.26017669],
        popupContent: "<h3 style='color: black;'>Parking Multilevel</h3>",
        address: "7C42+7X6, Nagar Nigam,Bhopal., Sultania Rd, Ibrahimpura, Peer Gate Area, Bhopal, Madhya Pradesh 462001" 
    },
    
    {
        name: "Parking Areas",
        coordinates: [77.44267219,	23.22768469],
        popupContent: "<h3 style='color: black;'>Parking Areas</h3>",
        address: "6CCR+GF4, Habib Ganj, Bhopal, Madhya Pradesh 462023" 
    },
    
    {
        name: "J P Hospital parking",
        coordinates: [77.41692298,	23.23651825],
        popupContent: "<h3 style='color: black;'>J P Hospital parking</h3>",
        address: "A-3, Main Rd 1, Bheem Nagar, BDA Colony, Panchsheel Nagar Main Road 1 Bheem Nagar, BDA Colony, Panchsheel Nagar, Bhopal, Madhya Pradesh 462003" 
    },
    
    {
        name: "Multi level parking",
        coordinates: [77.43408912,	23.23967295],
        popupContent: "<h3 style='color: black;'>Multi level parking, MP Nagar Zone 1</h3>",
        address: "37, Sultania Rd, Ibrahimpura, Peer Gate Area, Bhopal, Madhya Pradesh 462001" 
    },
    
    {
        name: "Parking For 4 Wheeler",
        coordinates: [77.41486304,	23.2750005],
        popupContent: "<h3 style='color: black;'>Parking For 4 Wheeler</h3>",
        address: "7C97+34J, Bhopal Junction, Bhopal, Madhya Pradesh 462001" 
    },
    
    {
        name: "Smart Parking DB City Bhopal",
        coordinates: [77.43031257,	23.23399444],
        popupContent: "<h3 style='color: black;'>Smart Parking DB City Bhopal</h3>",
        address: "6CMJ+2C5, Zone-I, Arera Hills, Bhopal, Madhya Pradesh 462016" 
    },
    
    {
        name: "BHEL Senior Club Parking",
        coordinates: [77.46292823,	23.22989314],
        popupContent: "<h3 style='color: black;'>BHEL Senior Club Parking</h3>",
        address: "6FG6+M48, Sector A, BHEL, Bhopal, Madhya Pradesh 462022" 
    },
    
    {
        name: "Multi Level Parking ISBT",
        coordinates: [77.44473212,	23.23904202],
        popupContent: "<h3 style='color: black;'>Multi Level Parking, ISBT</h3>",
        address: "6CJV+8HP, Near Hotels in ISBT Area, Habib Ganj, Bhopal, Madhya Pradesh 462023" 
    },
        
    {
        name: "Krishna Complex Parking Lot",
        coordinates: [77.40627998,	23.26932349],
        popupContent: "<h3 style='color: black;'>Krishna Complex Parking Lot</h3>",
        address: "Plot No. 9, Krishna Complex, Hamidia Rd, Near Nadra Bus Stand, Ghora Nakkas, Peer Gate Area, Bhopal, Madhya Pradesh 462001" 
    },
        
    {
        name: "Parking Ashoka Lake view",
        coordinates: [77.38636726,	23.25102926],
        popupContent: "<h3 style='color: black;'>Parking Ashoka Lake view</h3>",
        address: "69RQ+X6Q, Shymala Hills, Bhopal, Madhya Pradesh 462002" 
    },
        
    {
        name: "Tatya Tope Multi Level parking",
        coordinates: [77.39769691,	23.24219666],
        popupContent: "<h3 style='color: black;'>Tatya Tope Multi Level parking</h3>",
        address: "62, STT Nagar, TT Nagar, Bhopal, Madhya Pradesh 462003" 
    },
        
    {
        name: "Rani kamlapati railway station parking",
        coordinates: [77.43889564,	23.22800019],
        popupContent: "<h3 style='color: black;'>Rani kamlapati railway station parking</h3>",
        address: "6CCQ+JF9, Habib Ganj, Bhopal, Madhya Pradesh 462023" 
    },
        
    {
        name: "Natraj Club Parking",
        coordinates: [77.45709174,	23.23651825],
        popupContent: "<h3 style='color: black;'>Natraj Club Parking</h3>",
        address: "6FJ4+HHW, Sector A, Berkheda, Bhopal, Madhya Pradesh 462023" 
    },
        
    {
        name: "Lake View Parking",
        coordinates: [77.38224738,	23.24850572],
        popupContent: "<h3 style='color: black;'>Lake View Parking</h3>",
        address: "69VJ+2F7, Shymala Hills, Bhopal, Madhya Pradesh 462002" 
    },
        
    {
        name: "Bansal Group of Institutes",
        coordinates: [77.50925601,	23.26904222],
        popupContent: "<h3 style='color: black;'>Bansal Group of Institutes</h3>",
        address: "Anand Nagar, Kokta, Raisen Road, Bhopal, Madhya Pradesh 462021" 
    },
];

specificLocations.forEach(function(location) {
    var anchorTag = "<a href='Slot/slots.html?location=" + encodeURIComponent(location.name) + "'>Check Availability</a>";
    var popupHTML = "<h3 style='color: black;'>" + location.name + "</h3>" +
    "<p style='color: black;'>" + location.address + "</p>" +
    "<p style='color: black; margin-bottom: -15px; font-weight: bold;'>Total Slots: <span id='totalSlots_" + encodeURIComponent(location.name) + "' style='color: blue;'></span></p>" +
                    "<p style='color: black; font-weight: bold;'>Available Slots: <span id='availableSlots_" + encodeURIComponent(location.name) + "' style='color: green;'></span></p>" +
                    anchorTag;

    var popup = new mapboxgl.Popup().setHTML(popupHTML);

    var markerElement = document.createElement('div');
    markerElement.className = 'mapboxgl-marker';
    markerElement.style.backgroundImage = 'url("icon.png")';
    markerElement.style.width = '35px';
    markerElement.style.height = '35px';

    var marker = new mapboxgl.Marker(markerElement)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map);

    fetch('parkinginfo.php?location=' + encodeURIComponent(location.name))
        .then(response => response.text())
        .then(data => {
            var slots = data.split(',');
            var totalSlots = slots[0];
            var availableSlots = slots[1];
            document.getElementById('totalSlots_' + encodeURIComponent(location.name)).textContent = totalSlots;
            document.getElementById('availableSlots_' + encodeURIComponent(location.name)).textContent = availableSlots;
        })
        .catch(error => console.error('Error fetching slots:', error));

    marker.getElement().addEventListener('click', function() {
        popup.addTo(map);
        fetch('parkinginfo.php?location=' + encodeURIComponent(location.name))
            .then(response => response.text())
            .then(data => {
                var slots = data.split(',');
                var totalSlots = slots[0];
                var availableSlots = slots[1];
                document.getElementById('totalSlots_' + encodeURIComponent(location.name)).textContent = totalSlots;
                document.getElementById('availableSlots_' + encodeURIComponent(location.name)).textContent = availableSlots;
            })
            .catch(error => console.error('Error fetching slots:', error));
    });
});

var specificLocation = specificLocations.find(function(location) {
    return location.coordinates[0] === 77.5131801112173 && location.coordinates[1] === 23.270964878906067;
});

if (specificLocation) {
    var popup = new mapboxgl.Popup().setHTML(specificLocation.popupContent);

    var markerElement = document.createElement('div');
    markerElement.className = 'mapboxgl-marker';
    markerElement.style.backgroundImage = 'url("icon.png")';
    markerElement.style.width = '35px';
    markerElement.style.height = '35px';

    var marker = new mapboxgl.Marker(markerElement)
        .setLngLat(specificLocation.coordinates)
        .setPopup(popup)
        .addTo(map);

        function updatePopupStatus(popup, locationName) {
            fetch('parkinginfo.php?location=' + encodeURIComponent(locationName))
                .then(response => response.text())
                .then(data => {
                    var slots = data.split(',');
                    var totalSlots = slots[0];
                    var availableSlots = slots[1];
                    popup.setHTML("<h3 style='color: black;'>" + locationName + "</h3>" +
                        "<p style='color: black;'>Total Slots: " + totalSlots + "</p>" +
                        "<p style='color: black;'>Available Slots: " + availableSlots + "</p>");
                })
                .catch(error => console.error('Error fetching slots:', error));
        }
        
        setInterval(function() {
            specificLocations.forEach(function(location) {
                var popup = location.marker.getPopup();
                updatePopupStatus(popup, location.name);
            });
        }, 1000);        

    updatePopupStatus();


    marker.getElement().addEventListener('click', function() {
        popup.addTo(map);
    });
}

window.onload = function() {
    var loggedIn = getCookie("loggedIn");
    var userContainer = document.querySelector('.user-container');
    var signUpBtn = document.querySelector('.signup-btn');
    if (loggedIn === "true") {
        signUpBtn.style.display = "none";
        userContainer.style.display = "block";
    } else {
        signUpBtn.style.display = "block";
        userContainer.style.display = "none";
    }
}

function getCookie(name) {
    var cookieArr = document.cookie.split(';');
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split('=');
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function setCookie(name, value) {
    document.cookie = name + "=" + value + ";path=/";
}

function clearCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

function logout() {
    clearCookie("loggedIn");
    window.location.reload();
}

function profile() {
    window.location.href="Account/account.html";
}

function redirectToMap() {
    window.location.href = "LargeMap.html";
  }

function redirectToContact() {
    window.location.href = "ContactUs/contact.html";
  }

  function redirectToFAQ() {
    window.location.href = "FAQ/faq.html";
  }
  
    function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}
  
  function closeSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
  }