import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const fitmixContainer = document.getElementById("my-fitmix-container");
    const startBtn = document.getElementById("startVtoBtn");
    let fitmixInstance;

    if (!fitmixContainer) return;

    function hideModule() {
      fitmixContainer.style.display = "none";
    }

    const params = {
      apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
      onStopVto: hideModule,
      mode: "pd",
      frameId: "8053672909258",
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
      fitmixInstance.startVto("live");
    };

    startBtn.addEventListener("click", handleClick);

    // Cleanup on unmount
    return () => {
      startBtn.removeEventListener("click", handleClick);
      if (fitmixInstance) fitmixInstance.stopVto();
    };
  }, []);

  return (
    <>
      <button id="startVtoBtn" disabled>
        Start PD Measurement
      </button>
      <div id="my-fitmix-container"></div>
    </>
  );
}

export default App;
