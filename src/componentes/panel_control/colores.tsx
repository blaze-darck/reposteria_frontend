import React, { useState, useEffect } from "react";

type ColorType = "Primario" | "Secundario" | "Terciario";

interface ColorSelectorProps {
  label: ColorType;
  color: string;
  onChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  label,
  color,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border shadow"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="border px-2 py-1 rounded w-28 text-sm"
        />
      </div>
    </div>
  );
};

const Colores: React.FC = () => {
  const [show, setShow] = useState(false);
  const [primary, setPrimary] = useState("#3490dc");
  const [secondary, setSecondary] = useState("#38c172");
  const [tertiary, setTertiary] = useState("#ffed4a");

  useEffect(() => {
    const saved = localStorage.getItem("siteColors");
    if (saved) {
      const { primary, secondary, tertiary } = JSON.parse(saved);
      setPrimary(primary);
      setSecondary(secondary);
      setTertiary(tertiary);
    }
  }, []);

  const handleSave = () => {
    const colors = { primary, secondary, tertiary };
    localStorage.setItem("siteColors", JSON.stringify(colors));
    alert("Colores guardados correctamente");
  };

  return (
    <div className="bg-white shadow p-6 rounded-md max-w-xl mx-auto space-y-4">
      <button
        onClick={() => setShow(!show)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {show ? "Ocultar Configuración" : "Configurar Colores"}
      </button>

      {show && (
        <div className="space-y-6 border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800">
            Selector de Colores del Sitio
          </h2>

          <ColorSelector
            label="Primario"
            color={primary}
            onChange={setPrimary}
          />
          <ColorSelector
            label="Secundario"
            color={secondary}
            onChange={setSecondary}
          />
          <ColorSelector
            label="Terciario"
            color={tertiary}
            onChange={setTertiary}
          />

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Guardar Colores
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Colores;
