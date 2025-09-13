import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [measurementData, setMeasurementData] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  useEffect(() => {
    const containerId = "msrt-container";
    const startBtn = document.getElementById("startPdBtn");

    let widgetInstance;

    const handleStart = () => {
      setIsMeasuring(true);

      widgetInstance = window.Msrt.createWidget(containerId, {
        apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",

        onGetResultPd: (result) => {
          console.log("PD Measurement Result:", result);
          setMeasurementData(result);
          setIsMeasuring(false);
        },

        onTooManyErrors: () => {
          console.error("Too many errors during PD measurement");
          setIsMeasuring(false);
        },

        onClose: () => {
          console.log("Measurement closed");
          setIsMeasuring(false);
        },

        pdCopyClipboard: true, // optional
        darkMode: false, // optional
      });
    };

    if (startBtn) {
      startBtn.addEventListener("click", handleStart);
    }

    return () => {
      if (startBtn) startBtn.removeEventListener("click", handleStart);
    };
  }, []);

  return (
    <div className="app">
      <h1>Pupillary Distance Measurement</h1>
      <button id="startPdBtn" disabled={isMeasuring}>
        {isMeasuring ? "Measuring..." : "Start PD Measurement"}
      </button>

      <div
        id="msrt-container"
        style={{ width: "400px", height: "740px", marginTop: "20px" }}
      ></div>

      {measurementData && (
        <div className="results">
          <h2>Results</h2>
          <p>PD: {measurementData.pd} mm</p>
          {measurementData.left && <p>Left Eye: {measurementData.left} mm</p>}
          {measurementData.right && <p>Right Eye: {measurementData.right} mm</p>}
        </div>
      )}
    </div>
  );
}

export default App;
