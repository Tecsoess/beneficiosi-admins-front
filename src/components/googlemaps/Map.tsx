import { Loader } from "@googlemaps/js-api-loader"
import { Box, Button, Paper, TextField } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import CreateIcon from '@material-ui/icons/Create';


const loader = new Loader({
  apiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
  version: "weekly",
  libraries: ['drawing', 'geometry', 'places', 'visualization']
});

type mapPropsType = {
  searchBox?: {
    onChange?: (e: any) => void;
    label: string;
    value?: any;
    name?: string;
    error?: null | string;
  };
  height: string;
  defaultPolygon?: any;
  width: string;
  onClick?: (e: any) => void;
  markers?: any[];
  withDraw?: boolean;
  options: {
    zoom: number;
    center: {
      lat: number;
      lng: number;
    },
    zoomControl?: boolean,
  };
  drawingEnd?: (e: any[]) => void;
}

const Map = ({ searchBox, onClick, markers, height, width, options, drawingEnd, withDraw, defaultPolygon }: mapPropsType) => {


  const [mapApi, setMapApi] = useState<any>(null);

  const [map, setMap] = useState<any>(null);

  const [autoCompleteInput, setAutoCompleteInput] = useState<any>(null);

  const [actualMarkers, setActualMarkers] = useState<any[]>([]);

  const [draw, setDraw] = useState(false);

  const [polyline, setPolyLine] = useState<any>(null);
  const [polygon, setPolygon] = useState<any>(null);

  const [polygonPath, setPolygonPath] = useState<any>([]);

  const mapRef = useRef(null);

  const searchRef = useRef(null);

  useEffect(() => {
    if (map) {
      setPolyLine(new mapApi.maps.Polyline({
        map: map,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      }));
    }
  }, [map]);

  useEffect(() => {
    if (defaultPolygon && defaultPolygon?.length > 0) {
      setPolygonPath((oldPolygonPath: any) => [...oldPolygonPath, ...defaultPolygon]);
    }
  }, [defaultPolygon])

  useEffect(() => {
    if (defaultPolygon && defaultPolygon?.length > 0 && polygonPath && map && polygonPath.length > 0 && !draw) {
      onAcceptDraw();
    }
  }, [polygonPath])

  useEffect(() => {
    loader.load().then((response) => {
      setMapApi(response);
    });

  }, []);

  useEffect(() => {
    if (mapApi && mapRef.current) {
      setMap(new mapApi.maps.Map(mapRef.current, {
        ...options
      }))
    }
  }, [mapApi, mapRef.current]);

  useEffect(() => {
    if (mapApi && searchRef.current) {
      setAutoCompleteInput(new mapApi.maps.places.Autocomplete(searchRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'ar' },
        fields: ['geometry', 'formatted_address']
      }));

    }
  }, [mapApi, searchRef.current]);



  useEffect(() => {
    if (autoCompleteInput) {
      autoCompleteInput?.addListener?.("place_changed", () => {
        const { geometry, formatted_address } = autoCompleteInput?.getPlace?.();

        searchBox?.onChange?.({ target: { value: formatted_address, name: searchBox.name, type: "text" } });
        onClick?.({ lat: geometry.location.lat(), lng: geometry.location.lng() });
      });
    }
  }, [autoCompleteInput])


  useEffect(() => {
    if (map) {
      map?.setZoom?.(options.zoom);
      map?.setCenter?.(options.center);
    }
  }, [options, map])

  useEffect(() => {
    if (map) {
      mapApi.maps.event.clearListeners(map, "click");
      map.addListener('click', onClickTheMap);
    }

    if (polygon) {
      if (draw) {
        polygon.setMap(null);
        setPolygonPath([]);
      } else {
        polygon.setMap(map);
      }
    }
  }, [map, draw]);

  useEffect(() => {
    if (markers && mapApi && map) {
      actualMarkers.map((actualMarker, i) => {
        actualMarker.setMap(null);
      });
      setActualMarkers([]);
      markers.map((marker, i) => {
        let newMarker = new mapApi.maps.Marker({
          animation: mapApi.maps.Animation.DROP,
          position: new mapApi.maps.LatLng(marker.lat, marker.lng)
        });
        newMarker.setMap(map)
        setActualMarkers([...actualMarkers, newMarker]);
      });
    }
  }, [markers, mapApi, map]);

  const handleDraw = () => {
    setDraw(true);
  }

  const onClickTheMap = ({ latLng }: any) => {
    if (draw) {
      const path = polyline.getPath();
      path.push(latLng);
      if (path.length === 1) {
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
        });
        setActualMarkers((oldActualMarkers) => {
          return [...oldActualMarkers, marker];
        })
      }
      setPolygonPath((oldPolygonPath: any) => [...oldPolygonPath, { lat: latLng.lat(), lng: latLng.lng() }]);
    } else {
      onClick?.({ lat: latLng.lat(), lng: latLng.lng() });
    }
  }

  const onAcceptDraw = () => {
    polyline?.getPath?.()?.clear?.();
    actualMarkers.map((actualMarker, i) => {
      actualMarker.setMap(null);
    });
    setActualMarkers([]);
    setDraw(false);
    setPolygon(new mapApi.maps.Polygon({
      map: map,
      paths: polygonPath,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    }));
    drawingEnd?.(polygonPath);
  }

  const onCancelDraw = () => {
    polyline.getPath().clear();
    actualMarkers.map((actualMarker, i) => {
      actualMarker.setMap(null);
    });
    setActualMarkers([]);
    setDraw(false);
  }


  return (
    <Box height={height} width={width}>
      {
        mapApi ?
          <div style={{ height: "100%" }}>
            {searchBox ?
              <div>
                <TextField onChange={searchBox.onChange}
                  label={searchBox.label}
                  error={searchBox.error ? true : false}
                  helperText={searchBox.error ? <Box component="span" color="red">{searchBox.error}</Box> : null}
                  inputRef={searchRef}
                  name={searchBox.name}
                  value={searchBox.value}
                  variant="outlined"
                  fullWidth />
              </div>
              :
              null
            }
            <Paper elevation={5} style={{ height: "100%", width: "100%", position: "relative" }}>
              <div ref={mapRef} style={{ cursor: "pointer", borderRadius: 8, height: "100%", width: "100%", marginTop: "15px", background: "red" }}>

              </div>
              {
                withDraw ?
                  <Box>
                    {
                      draw ?
                        <Box textAlign="center" position="absolute" left={0} bottom={10} width="100%" display="flex" justifyContent="center">
                          <Button onClick={onCancelDraw} variant="contained" color="primary" style={{ margin: "0 10px" }}>
                            Cancelar
                          </Button>
                          <Button onClick={onAcceptDraw} variant="contained" color="primary" style={{ margin: "0 10px" }}>
                            Aceptar
                          </Button>
                        </Box>
                        :
                        <Box position="absolute" bottom={10} right={10}>
                          <Button onClick={handleDraw} startIcon={<CreateIcon />} variant="contained" color="primary">
                            Dibujar zona
                          </Button>
                        </Box>
                    }
                  </Box>
                  :
                  null
              }
            </Paper>
          </div>
          :
          <Box>
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
            <Box component="h1" textAlign="center">
              Cargando el mapa
            </Box>
          </Box>
      }
    </Box >
  )
}

export default Map;
