import React, { useState } from "react";
import LineGraph from "./components/LineGraph";
import Form from "./components/Form";
import Alert from "./components/Alert";
import Warning from "./components/Warning";
import DetectedFrame from "./components/DetectedFrame";

function App() {
  const [sharedValue, setSharedValue] = useState('');

  // Function to update sharedValue
  const updateValue = (newValue) => {
    setSharedValue(newValue);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        padding: "2.5%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginBottom: 20
        }}
      >
        <div style={{ flex: "1" }}>
          <DetectedFrame value={sharedValue} />
        </div>
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form value={sharedValue} updateValue={updateValue} />
          <Warning value={sharedValue} />
          <Alert value={sharedValue} />
        </div>
      </div>
      <LineGraph />
    </div>
  );
}

export default App;
