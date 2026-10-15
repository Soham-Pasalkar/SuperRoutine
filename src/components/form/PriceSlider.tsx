"use client";

import React from "react";

interface PriceSliderProps {
  min: number;
  max: number;
  touched: boolean;
  onChange: (values: { min: number; max: number; touched: boolean }) => void;
}

const MINV = 500;
const MAXV = 4000;
const GAP = 300;
const STEP = 100;
const BENCHMARK = 3000;

function formatInr(val: number): string {
  return "₹" + Number(val).toLocaleString("en-IN");
}

export function PriceSlider({
  min,
  max,
  onChange,
}: PriceSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number(e.target.value);
    if (newMin > max - GAP) {
      newMin = max - GAP;
    }
    onChange({ min: newMin, max, touched: true });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number(e.target.value);
    if (newMax < min + GAP) {
      newMax = min + GAP;
    }
    onChange({ min, max: newMax, touched: true });
  };

  const leftPercent = ((min - MINV) / (MAXV - MINV)) * 100;
  const widthPercent = ((max - min) / (MAXV - MINV)) * 100;
  const markerPercent = ((BENCHMARK - MINV) / (MAXV - MINV)) * 100;

  return (
    <div className="price">
      <div className="pv" id="pv" aria-live="polite">
        {formatInr(min)} to {formatInr(max)}
        <small>per month</small>
      </div>

      <div className="range" id="range">
        <div className="tr">
          <div
            className="fl"
            id="fl"
            style={{
              left: `calc(14px + (100% - 28px) * ${leftPercent / 100})`,
              width: `calc((100% - 28px) * ${widthPercent / 100})`,
            }}
          />
          <div
            className="mk"
            id="mk"
            style={{
              left: `calc(14px + (100% - 28px) * ${markerPercent / 100})`,
            }}
          />
        </div>

        <input
          type="range"
          id="rmin"
          min={MINV}
          max={MAXV}
          step={STEP}
          value={min}
          onChange={handleMinChange}
          aria-label="Lowest monthly price"
        />
        <input
          type="range"
          id="rmax"
          min={MINV}
          max={MAXV}
          step={STEP}
          value={max}
          onChange={handleMaxChange}
          aria-label="Highest monthly price"
        />
      </div>

      <div className="ends">
        <span>₹500</span>
        <span>₹4,000</span>
      </div>

      <p className="bench">
        <i aria-hidden="true" />
        Eight separate jars usually cost about ₹3,000 a month.
      </p>
    </div>
  );
}
