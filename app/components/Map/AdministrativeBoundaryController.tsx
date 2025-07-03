import React from "react";
import { LayerTitle, MapProps } from ".";

export interface AdministrativeLayer {
  id: number;
  title: LayerTitle;
  lineId: string;
}

export const administrativeLayers: AdministrativeLayer[] = [
  {
    id: 1,
    title: "province",
    lineId: "province-line",
  },
  {
    id: 2,
    title: "district",
    lineId: "district-line",
  },
  {
    id: 3,
    title: "municipality",
    lineId: "municipality-line",
  },
  {
    id: 4,
    title: "ward",
    lineId: "ward-line",
  },
];

const AdministrativeBoundaryController = ({
  checkedLayer,
  setCheckedLayer,
}: MapProps) => {
  const toggleLayer = (layer: LayerTitle) => {
    setCheckedLayer(
      (prev) =>
        prev.includes(layer)
          ? prev.filter((l) => l !== layer) // remove if already selected
          : [...prev, layer] // add if not selected
    );
  };
  return (
    <div className="flex flex-col gap-2">
      {administrativeLayers.map((item) => (
        <div key={item.id} className="flex gap-2 text-black capitalize">
          <input
            type="checkbox"
            value={item.title}
            checked={checkedLayer.includes(item.title)}
            onChange={() => toggleLayer(item.title)}
            name={item.title}
            id={item.title}
          />
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

export default AdministrativeBoundaryController;
