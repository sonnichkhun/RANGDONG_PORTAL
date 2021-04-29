import React, { RefObject, Dispatch } from 'react';

export interface SearchBoxProps {
  map?: any;
  mapApi: any;
  placeholder?: string;
  onPlacesChanged: Dispatch<React.SetStateAction<any[]>>;
  className?: string;
  defaultAddress?: string;
}

function SearchBox(props: SearchBoxProps) {
  const ref: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const {
    mapApi,
    placeholder,
    onPlacesChanged,
    className,
    defaultAddress,
  } = props;
  const searchBox = React.useRef(null);

  const handlePlacesChanged = React.useCallback(() => {
    if (onPlacesChanged) {
      onPlacesChanged(searchBox.current.getPlaces());
    }
  }, [onPlacesChanged, searchBox]);

  React.useEffect(() => {
    searchBox.current = new window.google.maps.places.SearchBox(ref.current);
    searchBox.current.addListener('places_changed', handlePlacesChanged);
    return () => window.google.maps.event.clearInstanceListeners(searchBox);
  }, [handlePlacesChanged, mapApi.event]);

  return (
    <input
      ref={ref}
      placeholder={placeholder}
      type="text"
      className={className}
      defaultValue={defaultAddress}
    />
  );
}

export default SearchBox;
