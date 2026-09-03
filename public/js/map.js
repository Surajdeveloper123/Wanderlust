// import * as maplibregl from "https://unpkg.com/maplibre-gl@6.1.0/dist/maplibre-gl.mjs";

// document.addEventListener("DOMContentLoaded", () => {

//     const mapElement = document.getElementById("map");

//     if (!mapElement) {
//         return;
//     }

//     // Prevent duplicate initialization
//     if (mapElement.dataset.mapInitialized === "true") {
//         return;
//     }

//     mapElement.dataset.mapInitialized = "true";

//     // ==========================================
//     // TOKEN
//     // ==========================================
//     const mapToken = mapElement.dataset.token?.trim();

//     if (!mapToken) {
//         console.error("MAP_TOKEN is missing.");
//         return;
//     }

//     // ==========================================
//     // LISTING DATA
//     // ==========================================
//     let listingData = {};

//     try {
//         listingData = JSON.parse(
//             mapElement.dataset.listing || "{}"
//         );
//     } catch (error) {
//         console.error("Listing data error:", error);
//     }

//     // ==========================================
//     // DEFAULT COORDINATES
//     // ==========================================
//     let coordinates = [77.2090, 28.6139];

//     // ==========================================
//     // LISTING COORDINATES
//     // ==========================================
//     if (
//         listingData?.geometry &&
//         Array.isArray(listingData.geometry.coordinates) &&
//         listingData.geometry.coordinates.length >= 2
//     ) {
//         const longitude = Number(listingData.geometry.coordinates[0]);
//         const latitude = Number(listingData.geometry.coordinates[1]);

//         if (
//             Number.isFinite(longitude) &&
//             Number.isFinite(latitude) &&
//             longitude >= -180 &&
//             longitude <= 180 &&
//             latitude >= -90 &&
//             latitude <= 90
//         ) {
//             coordinates = [longitude, latitude];
//         }
//     }

//     console.log("Listing coordinates:", coordinates);

//     // ==========================================
//     // LOCATIONIQ STYLE
//     // ==========================================
//     const mapStyle =
//         "https://tiles.locationiq.com/v3/streets/vector.json?key=" +
//         encodeURIComponent(mapToken);

//     // ==========================================
//     // MAP
//     // ==========================================
//     let map;

//     try {
//         map = new maplibregl.Map({
//             container: mapElement,
//             style: mapStyle,
//             center: coordinates,
//             zoom: 9,
//             attributionControl: true
//         });
//     } catch (error) {
//         console.error("Map initialization error:", error);
//         return;
//     }

//     // ==========================================
//     // NAVIGATION CONTROL
//     // ==========================================
//     map.addControl(
//         new maplibregl.NavigationControl(),
//         "top-right"
//     );

//     // ==========================================
//     // SEARCH BAR (LOCATIONIQ GEOCODER)
//     // ==========================================
//     if (window.MaplibreGeocoder) {
//         const geocoderApi = {
//             forwardGeocode: async (config) => {
//                 const features = [];
//                 try {
//                     const request = `https://api.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(config.query)}&format=json`;
//                     const response = await fetch(request);
//                     const geojson = await response.json();
                    
//                     for (let feature of geojson) {
//                         let center = [parseFloat(feature.lon), parseFloat(feature.lat)];
//                         let point = {
//                             type: 'Feature',
//                             geometry: {
//                                 type: 'Point',
//                                 coordinates: center
//                             },
//                             place_name: feature.display_name,
//                             properties: feature,
//                             text: feature.display_name,
//                             place_type: ['place'],
//                             center: center
//                         };
//                         features.push(point);
//                     }
//                 } catch (e) {
//                     console.error("Geocoding failed", e);
//                 }
//                 return { features: features };
//             }
//         };

//         const geocoder = new window.MaplibreGeocoder(geocoderApi, {
//             maplibregl: maplibregl,
//             placeholder: 'Search location...'
//         });

//         map.addControl(geocoder, 'top-left');
//     }

//     // ==========================================
//     // RED LOCATION MARKER
//     // ==========================================
//     const marker = new maplibregl.Marker({
//         color: "#ff0000"
//     })
//         .setLngLat(coordinates)
//         .addTo(map);

//     // ==========================================
//     // POPUP
//     // ==========================================
//     const title = listingData.title || "Listing Location";

//     const popupHTML = `
//         <div class="listing-map-popup">
//             <h5>${escapeHTML(title)}</h5>
//             <p>Exact Location will be provided after booking.</p>
//         </div>
//     `;

//     const popup = new maplibregl.Popup({
//         offset: 25,
//         closeButton: true,
//         closeOnClick: true
//     }).setHTML(popupHTML);

//     marker.setPopup(popup);

//     // ==========================================
//     // MAP LOAD
//     // ==========================================
//     map.on("load", () => {
//         console.log("LocationIQ map loaded successfully.");
//         map.resize();
//     });

//     // ==========================================
//     // MAP ERROR
//     // ==========================================
//     map.on("error", (event) => {
//         console.error("Map error:", event.error || event);
//     });

//     // ==========================================
//     // RESIZE
//     // ==========================================
//     window.addEventListener("resize", () => {
//         try {
//             map.resize();
//         } catch (error) {
//             console.warn("Map resize error:", error);
//         }
//     });

//     setTimeout(() => {
//         try {
//             map.resize();
//         } catch (error) {
//             console.warn("Map resize error:", error);
//         }
//     }, 500);

// });

// // ==========================================
// // ESCAPE HTML
// // ==========================================
// function escapeHTML(value) {
//     return String(value)
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;");
// }
import * as maplibregl from "https://unpkg.com/maplibre-gl@6.1.0/dist/maplibre-gl.mjs";

document.addEventListener("DOMContentLoaded", async () => {

    const mapElement = document.getElementById("map");

    if (!mapElement) {
        return;
    }

    // Prevent duplicate initialization
    if (mapElement.dataset.mapInitialized === "true") {
        return;
    }

    mapElement.dataset.mapInitialized = "true";

    // ==========================================
    // TOKEN
    // ==========================================
    const mapToken = mapElement.dataset.token?.trim();

    if (!mapToken) {
        console.error("MAP_TOKEN is missing.");
        return;
    }

    // ==========================================
    // LISTING DATA
    // ==========================================
    let listingData = {};

    try {
        listingData = JSON.parse(
            mapElement.dataset.listing || "{}"
        );
    } catch (error) {
        console.error("Listing data error:", error);
    }

    // ==========================================
    // COORDINATES & DYNAMIC GEOCODING
    // ==========================================
    let coordinates = [77.2090, 28.6139]; // Default: New Delhi
    let hasValidCoordinates = false;

    // Check if valid coordinates exist in database
    if (
        listingData?.geometry &&
        Array.isArray(listingData.geometry.coordinates) &&
        listingData.geometry.coordinates.length >= 2
    ) {
        const longitude = Number(listingData.geometry.coordinates[0]);
        const latitude = Number(listingData.geometry.coordinates[1]);

        if (
            Number.isFinite(longitude) &&
            Number.isFinite(latitude) &&
            longitude >= -180 &&
            longitude <= 180 &&
            latitude >= -90 &&
            latitude <= 90
        ) {
            coordinates = [longitude, latitude];
            hasValidCoordinates = true;
        }
    }

    // If database coordinates are missing, fetch dynamically using LocationIQ API
    if (!hasValidCoordinates && (listingData.location || listingData.country)) {
        try {
            const queryLocation = `${listingData.location || ''}, ${listingData.country || ''}`.trim();
            const geoUrl = `https://api.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(queryLocation)}&format=json`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            if (geoData && geoData.length > 0) {
                const fetchedLon = parseFloat(geoData[0].lon);
                const fetchedLat = parseFloat(geoData[0].lat);
                if (Number.isFinite(fetchedLon) && Number.isFinite(fetchedLat)) {
                    coordinates = [fetchedLon, fetchedLat];
                }
            }
        } catch (err) {
            console.warn("Dynamic geocoding fallback failed:", err);
        }
    }

    console.log("Final Listing coordinates:", coordinates);

    // ==========================================
    // LOCATIONIQ STYLE
    // ==========================================
    const mapStyle =
        "https://tiles.locationiq.com/v3/streets/vector.json?key=" +
        encodeURIComponent(mapToken);

    // ==========================================
    // MAP INITIALIZATION
    // ==========================================
    let map;

    try {
        map = new maplibregl.Map({
            container: mapElement,
            style: mapStyle,
            center: coordinates,
            zoom: 14,
            attributionControl: true
        });
    } catch (error) {
        console.error("Map initialization error:", error);
        return;
    }

    // ==========================================
    // NAVIGATION CONTROL
    // ==========================================
    map.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
    );

    // ==========================================
    // SEARCH BAR (LOCATIONIQ GEOCODER)
    // ==========================================
    if (window.MaplibreGeocoder) {
        const geocoderApi = {
            forwardGeocode: async (config) => {
                const features = [];
                try {
                    const request = `https://api.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(config.query)}&format=json`;
                    const response = await fetch(request);
                    const geojson = await response.json();
                    
                    for (let feature of geojson) {
                        let center = [parseFloat(feature.lon), parseFloat(feature.lat)];
                        let point = {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: center
                            },
                            place_name: feature.display_name,
                            properties: feature,
                            text: feature.display_name,
                            place_type: ['place'],
                            center: center
                        };
                        features.push(point);
                    }
                } catch (e) {
                    console.error("Geocoding failed", e);
                }
                return { features: features };
            }
        };

        const geocoder = new window.MaplibreGeocoder(geocoderApi, {
            maplibregl: maplibregl,
            placeholder: 'Search location...'
        });

        map.addControl(geocoder, 'top-left');
    }

    // ==========================================
    // AIRBNB STYLED RED HOUSE MARKER
    // ==========================================
    const customMarkerEl = document.createElement('div');
    customMarkerEl.className = 'custom-map-marker';
    customMarkerEl.innerHTML = '<i class="fa-solid fa-house"></i>';

    const marker = new maplibregl.Marker({ element: customMarkerEl })
        .setLngLat(coordinates)
        .addTo(map);

    // ==========================================
    // POPUP
    // ==========================================
    const title = listingData.title || "Listing Location";
    const locName = listingData.location ? `${listingData.location}, ${listingData.country || ''}` : "Exact location provided after booking.";

    const popupHTML = `
        <div class="listing-map-popup" style="padding: 4px;">
            <h6 style="margin: 0; font-weight: 700; color: #222;">${escapeHTML(title)}</h6>
            <p style="margin: 4px 0 0 0; color: #717171; font-size: 0.85rem;">${escapeHTML(locName)}</p>
        </div>
    `;

    const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true
    }).setHTML(popupHTML);

    marker.setPopup(popup);

    // ==========================================
    // MAP LOAD & RESIZE
    // ==========================================
    map.on("load", () => {
        console.log("LocationIQ map loaded successfully.");
        map.resize();
    });

    map.on("error", (event) => {
        console.error("Map error:", event.error || event);
    });

    window.addEventListener("resize", () => {
        try {
            map.resize();
        } catch (error) {
            console.warn("Map resize error:", error);
        }
    });

    setTimeout(() => {
        try {
            map.resize();
        } catch (error) {
            console.warn("Map resize error:", error);
        }
    }, 500);

});

// ==========================================
// ESCAPE HTML
// ==========================================
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}