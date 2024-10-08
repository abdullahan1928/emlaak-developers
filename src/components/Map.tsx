"use client";
import { useEffect, useRef, useMemo } from "react";
import { Loader } from "@googlemaps/js-api-loader";

function Map({ address }: { address: string }) {
    const mapRef = useRef(null);
    // const geocoder = useMemo(() => new google.maps.Geocoder(), []);

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyBAH8vqZKf1P9kczPy2gdEAWlU-Syil6G4',
            version: "weekly",
        });
        loader.load().then((google) => {
            new google.maps.Geocoder().geocode({ address: address }, (results: any, status: any) => {
                if (status === "OK") {
                    const map = new google.maps.Map(mapRef.current, {
                        center: results[0].geometry.location,
                        zoom: 8,
                    });
                    const marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                    });
                } else {
                    console.error(`Geocode was not successful for the following reason: ${status}`);
                }
            });
        });
    }, [address]);
    return <div style={{ height: "400px" }} ref={mapRef} />;
}
export default Map;