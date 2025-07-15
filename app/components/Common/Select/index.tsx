import React from "react";

const Select = ({
  selectData,
  disabled = false,
  selected,
  setSelected,
  placeholder = "Select...",
}: any) => {
  const options = selectData?.data?.results || [];

  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor=""
        className={`w-full rounded-sms text-[10px] uppercase font-medium ${
          disabled ? " text-gray-400" : "text-black"
        }`}
      >
        {placeholder?.split(" ")[1]}
      </label>
      <select
        value={selected || ""}
        onChange={(e) => setSelected(e.target.value)}
        disabled={disabled}
        className={`w-full border-b rounded-sms text-xs outline-none cursor-pointer ${
          disabled ? "bg-gray-100 text-gray-400" : "bg-white text-black"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>
            {opt.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
