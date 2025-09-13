import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementComplete, setMeasurementComplete] = useState(false);
  const [measurementData, setMeasurementData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fitmixContainer = document.getElementById("my-fitmix-container");
    const startBtn = document.getElementById("startVtoBtn");
    let fitmixInstance;

    if (!fitmixContainer) return;

    function hideModule() {
      fitmixContainer.style.display = "none";
      setIsMeasuring(false);
    }

    const params = {
      apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
      onStopVto: hideModule,
      mode: "pd",
      frameId: "8053672909258",
      onComplete: (data) => {
        console.log("Measurement complete:", data);
        setMeasurementData(data);
        setMeasurementComplete(true);
        setIsLoading(false);
        
        // Calculate additional measurements from the response data
        calculateAdditionalMeasurements(data);
      }
    };

    // Initialize FitMix
    fitmixInstance = window.FitMix.createWidget(
      "my-fitmix-container",
      params,
      () => {
        console.log("VTO module is ready.");
        startBtn.disabled = false;
      }
    );

    // Start VTO on button click
    const handleClick = () => {
      fitmixContainer.style.display = "block";
      setIsMeasuring(true);
      setIsLoading(true);
      setMeasurementComplete(false);
      fitmixInstance.startVto("live");
    };

    startBtn.addEventListener("click", handleClick);

    // Cleanup on unmount
    return () => {
      startBtn.removeEventListener("click", handleClick);
      if (fitmixInstance) fitmixInstance.stopVto();
    };
  }, []);

  const calculateAdditionalMeasurements = (data) => {
    // This function would extract additional measurements from the response
    // For demonstration, I'm using placeholder calculations
    if (data && data.views && data.views.length > 0) {
      const faceData = data.views[0].recognitionSceneDatas[0];
      
      // Calculate face shape (simplified example)
      const faceWidth = faceData.detectedFaceRegion.width;
      const faceHeight = faceData.detectedFaceRegion.height;
      const aspectRatio = faceWidth / faceHeight;
      
      let faceShape = "Oval";
      if (aspectRatio > 0.85) faceShape = "Round";
      if (aspectRatio < 0.7) faceShape = "Long";
      
      // Calculate cheekbone width (simplified example)
      const cheekboneWidth = faceWidth * 0.9;
      
      // Calculate pupil height (simplified example)
      const pupilHeight = (faceData.eyesPoints[0].y + faceData.eyesPoints[1].y) / 2;
      
      // Calculate eye opening height (simplified example)
      const eyeOpeningHeight = faceWidth * 0.05;
      
      // Add these to the measurement data
      setMeasurementData(prev => ({
        ...prev,
        faceShape,
        cheekboneWidth: cheekboneWidth.toFixed(1),
        pupilHeight: pupilHeight.toFixed(1),
        eyeOpeningHeight: eyeOpeningHeight.toFixed(1)
      }));
    }
  };

  const handleRetry = () => {
    setMeasurementComplete(false);
    setMeasurementData(null);
    
    // Reset and restart the measurement
    const fitmixContainer = document.getElementById("my-fitmix-container");
    const startBtn = document.getElementById("startVtoBtn");
    
    if (fitmixContainer && startBtn) {
      fitmixContainer.style.display = "block";
      setIsMeasuring(true);
      setIsLoading(true);
      
      // Reinitialize if needed
      window.location.reload(); // Simple solution for demo
    }
  };

  const handleSave = () => {
    // Here you would typically send the data to your backend
    console.log("Saving measurements:", measurementData);
    alert("Measurements saved successfully!");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pupillary Distance Measurement</h1>
        <p>Measure your PD accurately from home</p>
      </header>
      
      <main className="app-main">
        {!measurementComplete ? (
          <div className="instructions">
            <h2>Before You Begin</h2>
            <div className="instruction-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Find Good Lighting</h3>
                  <p>Make sure your face is evenly lit without harsh shadows</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Remove Glasses</h3>
                  <p>Take off any glasses to ensure accurate measurement</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Position Your Face</h3>
                  <p>Keep your face straight and look directly at the camera</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Stay Still</h3>
                  <p>Hold still during the measurement process</p>
                </div>
              </div>
            </div>
            
            <button id="startVtoBtn" className="start-button" disabled={isMeasuring}>
              {isMeasuring ? "Measuring..." : "Start PD Measurement"}
            </button>
            
            {isLoading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Measuring... Please keep still</p>
              </div>
            )}
          </div>
        ) : (
          <div className="results">
            <h2>Measurement Results</h2>
            <div className="measurement-cards">
              <div className="measurement-card">
                <h3>Pupillary Distance</h3>
                <p className="measurement-value">{measurementData?.computedPD || measurementData?.computedPd} mm</p>
                <p className="measurement-description">Distance between your pupils</p>
              </div>
              
              <div className="measurement-card">
                <h3>Face Shape</h3>
                <p className="measurement-value">{measurementData?.faceShape || "Oval"}</p>
                <p className="measurement-description">Your face shape classification</p>
              </div>
              
              <div className="measurement-card">
                <h3>Cheekbone Width</h3>
                <p className="measurement-value">{measurementData?.cheekboneWidth} mm</p>
                <p className="measurement-description">Width across your cheekbones</p>
              </div>
              
              <div className="measurement-card">
                <h3>Pupil Height</h3>
                <p className="measurement-value">{measurementData?.pupilHeight} mm</p>
                <p className="measurement-description">Height from reference point</p>
              </div>
              
              <div className="measurement-card">
                <h3>Eye Opening Height</h3>
                <p className="measurement-value">{measurementData?.eyeOpeningHeight} mm</p>
                <p className="measurement-description">Vertical opening of eyes</p>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="retry-button" onClick={handleRetry}>
                Retry Measurement
              </button>
              <button className="save-button" onClick={handleSave}>
                Save Measurements
              </button>
            </div>
          </div>
        )}
        
        <div id="my-fitmix-container"></div>
      </main>
      
      <footer className="app-footer">
        <p>For best results, perform measurement in a well-lit environment</p>
      </footer>
    </div>
  );
}

export default App;