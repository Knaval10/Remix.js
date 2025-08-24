import { useEffect, useRef, useState } from "react";
import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AdministrativeBoundaryController, {
  administrativeLayers,
} from "./AdministrativeBoundaryController";
import TopFilter from "./TopFilter";
import { useFederalData } from "~/hooks/useFederalData";
import { useFederal } from "~/lib/context/FederalContext";
import Popup from "./Popup";
import { createRoot } from "react-dom/client";
export type LayerTitle = "province" | "district" | "municipality" | "ward";

export interface MapProps {
  checkedLayer: LayerTitle[];
  setCheckedLayer: React.Dispatch<React.SetStateAction<LayerTitle[]>>;
}

export interface ItemProps {}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const mapStyle = import.meta.env.VITE_APP_MAP_STYLE_NONE;
const nepalUrl = import.meta.env.VITE_APP_MAP_SOURCE_NEPAL;
const Map = ({ alerts, hoveredItem, setHoveredItem, showToolbar }: any) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState<number | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<LayerTitle[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [submittedProvince, setSubmittedProvince] = useState({});
  const [submittedDistrict, setSubmittedDistrict] = useState({});

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    mapRef?.current?.resize();
    mapRef?.current?.fitBounds(
      [
        [78.4745772586162, 25.882484351930984],
        [90.01928188702573, 30.658606158679973],
      ],
      { duration: 0 }
    );
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [width, showToolbar]);

  const alertData = alerts && alerts?.results?.length > 0 && alerts?.results;

  // let hoveredDistrictId: number | undefined = undefined;
  let hoveredMarkerId: number | undefined = hoveredItem;

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      zoom: 6,
      minZoom: 2,
      maxZoom: 22,
      center: [84.2676, 28.5465],
      maxBounds:
        // window.screen.width < 768
        //   ?
        [
          [79.161987, 19.47695], //South-west
          [89.626465, 36.22655], //North-east
        ],
      // : [
      //     [78.4745772586162, 25.882484351930984],
      //     [90.01928188702573, 30.658606158679973],
      //   ],

      preserveDrawingBuffer: true,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    //Load style
    map.on("load", () => {
      //Adding source for nepal
      map.addSource("nepal", {
        type: "vector",
        url: nepalUrl,
      });

      //Adding data source
      map.addSource("alert-data", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features:
            alertData?.length > 0 &&
            alertData.map((item: any) => ({
              type: "Feature",
              id: item?.id,
              geometry: item.point,
              properties: { ...item },
            })),
        },
        cluster: false,
        clusterRadius: 40,
      });

      map.addLayer({
        id: "nepal-outline",
        source: "nepal",
        "source-layer": "provincegeo", // or another appropriate outline layer
        type: "line",
        layout: {
          visibility: "visible", // Always visible
        },
        paint: {
          "line-color": "black", // lighter stroke for background outline
          "line-width": 1,
        },
      });

      //Province layer
      map.addLayer({
        id: "province-line",
        source: "nepal",
        "source-layer": "provincegeo",
        type: "line",
        layout: {
          visibility: "none",
        },
        paint: {
          "line-color": "black",
          "line-width": 1,
        },
      });
      //District layer
      map.addLayer({
        id: "district-line",
        source: "nepal",
        "source-layer": "districtgeo",
        type: "line",
        layout: {
          visibility: "none",
        },
        paint: {
          "line-color": "red",
          "line-width": 1,
        },
      });

      map.addLayer({
        id: "district-fill",
        source: "nepal",
        "source-layer": "districtgeo",
        type: "fill",
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "hoverDistrict"], false],
            "blue",
            "transparent",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hoverDistrict"], false],
            0.5,
            0,
          ],
        },
      });
      map.addLayer({
        id: "municipality-line",
        source: "nepal",
        "source-layer": "municipalitygeo",
        type: "line",
        layout: {
          visibility: "none",
        },
        paint: {
          "line-color": "green",
          "line-width": 1,
        },
      });

      //Alert cluster
      map.addLayer({
        id: "alert-cluster",
        source: "alert-data",
        type: "circle",
        filter: ["has", "point_count"],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-color": "orange", // Fill color
          "circle-opacity": 0.5,
          "circle-radius": 15, // Radius
          "circle-stroke-width": 5, // 👈 Stroke width
          "circle-stroke-color": "yellow", // 👈 Stroke color
          "circle-stroke-opacity": 1,
        },
      });

      //Alert cluster count
      map.addLayer({
        id: "alert-cluster-count",
        type: "symbol",
        source: "alert-data",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      //Alert marker for non-cluster point
      map.addLayer({
        id: "alert-marker",
        source: "alert-data",
        type: "circle",
        filter: ["!has", "point_count"],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-color": [
            "match",
            ["get", "referenceType"],
            "river",
            "blue",
            "fire",
            "red",
            "rain",
            "purple",
            "black",
          ],
          "circle-radius": 8,
          "circle-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], true],
            1, // fully visible if hovered
            ["boolean", ["feature-state", "otherHover"], true],
            0.2, // faded if another marker is hovered
            1, // default opacity
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "purple",
          "circle-stroke-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], true],
            1,
            ["boolean", ["feature-state", "otherHover"], true],
            0,
            1,
          ],
        },
      });

      //Mouse event to change the district fill on hover
      // map.on("mousemove", "district-fill", (e: mapboxgl.MapLayerMouseEvent) => {
      //   e.preventDefault();
      //   map.getCanvas().style.cursor = "pointer";

      //   if (hoveredDistrictId) {
      //     map.setFeatureState(
      //       {
      //         source: "nepal",
      //         sourceLayer: "districtgeo",
      //         id: hoveredDistrictId,
      //       },
      //       { hoverDistrict: false }
      //     );
      //   }

      //   if (e.features && e.features.length > 0) {
      //     hoveredDistrictId = e.features[0].id as number; // or string, depending on your GeoJSON feature ID type

      //     map.setFeatureState(
      //       {
      //         source: "nepal",
      //         sourceLayer: "districtgeo",
      //         id: hoveredDistrictId,
      //       },
      //       { hoverDistrict: true }
      //     );
      //   }
      // });

      // //Revert the district fill on mouse leave
      // map.on(
      //   "mouseleave",
      //   "district-fill",
      //   (e: mapboxgl.MapLayerMouseEvent) => {
      //     map.getCanvas().style.cursor = "";

      //     if (hoveredDistrictId) {
      //       map.setFeatureState(
      //         {
      //           source: "nepal",
      //           sourceLayer: "districtgeo",
      //           id: hoveredDistrictId,
      //         },
      //         { hoverDistrict: false }
      //       );
      //     }

      //     hoveredDistrictId = undefined;
      //   }
      // );

      //Change center and zoom on cluster click
      map.on("click", "alert-cluster", (e) => {
        e.preventDefault();
        map.setCenter(e.lngLat);
        map.setZoom(map.getZoom() + 1);
        // map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseenter", "alert-cluster", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mousemove", "alert-marker", (e: MapLayerMouseEvent) => {
        e.preventDefault();
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        const id = feature?.id;
        setHoveredItem(id);
        if (id == null) return;

        // Reset previous hover state if hovering a new feature
        if (hoveredMarkerId) {
          map.setFeatureState(
            { source: "alert-data", id: hoveredMarkerId },
            { hover: false }
          );
        }

        hoveredMarkerId = undefined;
        if (e.features && e.features.length > 0) {
          hoveredMarkerId = e.features[0].id as number; // or string, depending on your GeoJSON feature ID type
          map.setFeatureState(
            {
              source: "alert-data",
              id: hoveredMarkerId,
            },
            { hover: true }
          );
        }

        // Dim all other markers
        map.querySourceFeatures("alert-data").forEach((f) => {
          if (f.id != null && f.id !== id) {
            map.setFeatureState(
              { source: "alert-data", id: f.id },
              { otherHover: true }
            );
          }
        });
      });

      map.on("mouseleave", "alert-marker", () => {
        // Reset hover state for previously hovered marker
        // if (hoveredMarkerId) {
        //   map.setFeatureState(
        //     { source: "alert-data", id: hoveredMarkerId },
        //     { hover: false }
        //   );
        //   hoveredMarkerId = undefined;
        // }
        map.getCanvas().style.cursor = "";

        // Reset all otherHover states
        map.querySourceFeatures("alert-data").forEach((f) => {
          if (f.id != null) {
            map.setFeatureState(
              { source: "alert-data", id: f.id },
              { otherHover: false }
            );
          }
        });
      });

      const applyInitialHoverEffect = () => {
        const features = map.querySourceFeatures("alert-data");

        if (!features.length) {
          return;
        }

        for (const feature of features) {
          if (feature.id == null) continue;

          const isHovered = feature.id === hoveredMarkerId;

          map.setFeatureState(
            { source: "alert-data", id: feature.id },
            isHovered ? { hover: true } : { otherHover: true }
          );
        }

        // center to hovered marker
        // const hoveredFeature = features.find(f => f.id === hoveredMarkerId);
        // if (hoveredFeature && hoveredFeature.geometry?.type === "Point") {
        //   const coords = hoveredFeature.geometry.coordinates;
        //   map.flyTo({ center: coords, zoom: 10 });
        // }
      };

      if (map.isSourceLoaded("alert-data")) {
        applyInitialHoverEffect();
      } else {
        map.on("sourcedata", function handleSourceLoad(e) {
          if (e.sourceId === "alert-data" && e.isSourceLoaded) {
            applyInitialHoverEffect();
            map.off("sourcedata", handleSourceLoad);
          }
        });
      }
    });

    map.on("click", "alert-marker", (e: MapLayerMouseEvent) => {
      e.preventDefault();
      if (!e.features) return;
      const properties = e.features[0].properties;
      const popupNode = document.createElement("div");
      createRoot(popupNode).render(<Popup properties={properties} />);
      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setDOMContent(popupNode)
        .addTo(map);
    });

    //Responsiveness
    //At every screen size, fits the map to the maximum south-west and north-east coordinates of Nepal
    map.fitBounds(
      [
        [78.4745772586162, 25.882484351930984],
        [90.01928188702573, 30.658606158679973],
      ],
      { duration: 500 }
    );

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const layerIds: string[] = [
      "district-line",
      "province-line",
      "municipality-line",
      "ward-line",
    ];

    layerIds.forEach((id) => {
      const title = administrativeLayers.find(
        (item) => item.lineId === id
      )?.title;

      if (!title) return; // Skip if title is undefined

      const visibility = selectedLayer?.includes(title) ? "visible" : "none";

      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", visibility);
      }
    });
  }, [selectedLayer]);

  useEffect(() => {
    if (mapRef?.current) {
      setTimeout(() => {
        mapRef?.current?.resize();
        mapRef?.current?.fitBounds(
          [
            [78.4745772586162, 25.882484351930984],
            [90.01928188702573, 30.658606158679973],
          ],
          { duration: 0 }
        );
      }, 300);
    }
  }, [showToolbar]);

  useEffect(() => {
    if (!mapRef?.current || !mapRef?.current.isStyleLoaded()) return;
    if (hoveredMarkerId == null) return;

    const features = mapRef?.current.querySourceFeatures("alert-data");
    if (!features.length) return;

    features.forEach((feature: any) => {
      if (feature.id == null) return;

      const isHovered = feature.id === hoveredMarkerId;

      mapRef?.current?.setFeatureState(
        { source: "alert-data", id: feature.id },
        isHovered
          ? { hover: true, otherHover: false }
          : { hover: false, otherHover: true }
      );
    });

    // center to hovered marker
    // const hovered = features.find((f) => f.id === hoveredMarkerId);
    // if (hovered?.geometry.type === "Point") {
    //   mapRef?.current.flyTo({ center: hovered.geometry.coordinates, zoom: 10 });
    // }

    return () => {
      // Clean up: reset all feature states
      features.forEach((feature: any) => {
        if (feature.id != null) {
          mapRef?.current?.setFeatureState(
            { source: "alert-data", id: feature.id },
            { hover: false, otherHover: false }
          );
        }
      });
    };
  }, [hoveredMarkerId, mapRef?.current]);

  const {
    province,
    district,
    municipality,
    fetchProvince,
    fetchDistrict,
    fetchMunicipality,
  }: any = useFederalData();
  useEffect(() => {
    fetchProvince();
    fetchDistrict();
    fetchMunicipality();
  }, []);

  const {
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedMunicipality,
    setSelectedMunicipality,
  }: any = useFederal();

  const handleFederalSubmit = () => {
    if (selectedProvince) {
      const provinceObj =
        province.data.results?.length > 0 &&
        province.data.results.find(
          (item: any) => String(item.id) === selectedProvince
        );
      setSubmittedProvince(provinceObj);
      if (selectedDistrict) {
        const districtObj =
          district.data.results?.length > 0 &&
          district.data.results.find(
            (item: any) => String(item.id) === selectedDistrict
          );
        setSubmittedDistrict(districtObj);
      }
    }
  };
  console.log("selected0", submittedDistrict);

  useEffect(() => {
    if (
      submittedProvince &&
      mapRef.current
      // mapRef.current.getLayer("province-line")
    ) {
      const map = mapRef.current;
      const { bbox, code }: any = submittedProvince; // use the correct property name like `id`, `name`, `code`, etc.

      // Filter layer to show only selected province
      // map.setFilter("province-line", [
      //   "==",
      //   ["get", "code"], // ← Change "code" to the property in your vector source
      //   code,
      // ]);

      // Zoom to the province
      if (bbox) {
        map.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          {
            padding: 20,
            duration: 1000,
          }
        );
      }
    }
    if (
      submittedProvince &&
      submittedDistrict &&
      mapRef.current
      // mapRef.current.getLayer("province-line")
    ) {
      const map = mapRef.current;
      const { bbox, code }: any = submittedDistrict; // use the correct property name like `id`, `name`, `code`, etc.

      // Filter layer to show only selected province
      // map.setFilter("province-line", [
      //   "==",
      //   ["get", "code"], // ← Change "code" to the property in your vector source
      //   code,
      // ]);

      // Zoom to the province
      if (bbox) {
        map.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          {
            padding: 20,
            duration: 1000,
          }
        );
      }
    }
  }, [submittedProvince, submittedDistrict]);

  const handleFilterReset = () => {
    setSelectedDistrict("");
    setSelectedProvince("");
    if (mapRef.current) {
      const map = mapRef.current;
      map.setCenter([84.2676, 28.5465]);
      // map.setZoom(map.getZoom() - 3);
      map.fitBounds([
        [79.161987, 19.47695],
        [89.626465, 36.22655],
      ]);
    }
  };

  return (
    <div className="h-screen w-full relative">
      <div className="flex gap-4 absolute right-10 top-10 z-10">
        <AdministrativeBoundaryController
          checkedLayer={selectedLayer}
          setCheckedLayer={setSelectedLayer}
        />
        <TopFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          province={province}
          district={district}
          municipality={municipality}
          handleFederalSubmit={handleFederalSubmit}
          handleFilterReset={handleFilterReset}
        />
      </div>
      <div ref={mapContainerRef} className="h-full w-full bg-[#f4f4f2]"></div>
    </div>
  );
};

export default Map;
