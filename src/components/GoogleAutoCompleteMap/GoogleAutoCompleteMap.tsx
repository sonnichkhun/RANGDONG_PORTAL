import { Model } from 'core/models';
import { GoogleAPI, GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import React, { Dispatch, RefObject, SetStateAction } from 'react';
import SearchBox from './SearchBox';

export interface GoogleAutoCompleteMapProps<T> {
  defaultAddress?: string; // default value for autocomplate
  defaultZoom: number; // default zoom for map
  google: GoogleAPI; // google Api instance for map
  lat: number; // latitude
  lng: number; // longitude
  inputClassName?: string;
  inputMapClassName?: string;
  model: T;
  setModel: Dispatch<SetStateAction<T>>;
  isAddress: boolean;
  placeholder?: string;
}

function GoogleAutoCompleteMap<T extends Model>(
  props: GoogleAutoCompleteMapProps<T>,
) {
  const {
    defaultAddress,
    defaultZoom,
    google,
    lat,
    lng,
    inputClassName,
    inputMapClassName,
    model,
    setModel,
    isAddress,
    placeholder,
  } = props;
  const ref: RefObject<any> = React.useRef<any>(null);
  const [places, setPlaces] = React.useState<any[]>([]);

  const handlePlacesChanged = React.useCallback(
    (places) => {
      if (places !== undefined && setModel) {
        setPlaces(places);
        const { 0: place } = places;
        if (!place || !place.geometry) return;
        if (place.geometry.viewport) {
          const address = place.formatted_address;
          const deliveryAddress = place.formatted_address;
          if (isAddress) {
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            setModel(
              Model.clone<T>({
                ...model,
                latitude,
                longitude,
                address,
              }),
            );
          } else {
            const deliveryLatitude = place.geometry.location.lat();
            const deliveryLongitude = place.geometry.location.lng();
            setModel(
              Model.clone<T>({
                ...model,
                deliveryLatitude,
                deliveryLongitude,
                deliveryAddress,
              }),
            );
          }
          ref.current.map.fitBounds(place.geometry.viewport);
        } else {
          ref.current.map.setCenter(place.geometry.location);
          ref.current.map.setZoom(2);
        }
      }
    },
    [isAddress, model, setModel],
  );

  return (
    <React.Fragment>
      <SearchBox
        onPlacesChanged={handlePlacesChanged}
        mapApi={google.maps}
        defaultAddress={defaultAddress}
        className={inputClassName}
        placeholder={placeholder}
      />
      <div className={inputMapClassName} style={{ display: 'block' }}>
        <Map
          ref={ref}
          google={google}
          zoom={defaultZoom}
          initialCenter={{ lat, lng }}
        >
          {places.length > 0 &&
            places.map((place, i) => {
              return <Marker key={i} position={place.geometry.location} />;
            })}
          {places.length === 0 && <Marker position={{ lat, lng }} />}
        </Map>
      </div>
    </React.Fragment>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_APIKEY,
  libraries: ['places'],
})(GoogleAutoCompleteMap);
