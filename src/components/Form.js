import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import axiosInstance from "./axiosInstance";
import { IonIcon } from "@ionic/react";
import { warning } from "ionicons/icons";

function Form({ value, updateValue }) {
  const [toggle, setToggle] = useState(false);
  const [timeInterval, setTimeInterval] = useState("");
  const [threshold, setThreshold] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [timeIntervalValidator, setTimeIntervalValidator] = useState(false);
  const [thresholdValidator, setThresholdValidator] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const toggleSwitch = (timeInterval, threshold) => {
    setIsEnabled((previousState) => !previousState);

    // Run when the Switch is clicked
    if (!isEnabled) {
      // Run when the Switch is turned on
      console.log("Switch is turned ON");
      if (timeInterval === "" || threshold === "" || timeInterval === '0' || threshold === '0') {
        if (timeInterval === "") {
          setTimeIntervalValidator(true);
          console.log("Time Interval", timeIntervalValidator);
        }
        if (threshold === "") {
          setThresholdValidator(true);
          console.log("Threshold", thresholdValidator);
        }
        if (timeInterval === '0') {
            setTimeIntervalValidator(true);
        }
        if (threshold === '0') {
            setThresholdValidator(true);
        }
      } else {
        detectObjects(timeInterval, threshold);
        updateValue(timeInterval); // Updates the sharedValue state (for Time Interval Refresh)
      }
    } else {
      // Run when the Switch is turned off
      setTimeIntervalValidator(false);
      setThresholdValidator(false);
      console.log("Switch is turned OFF");
      stopWebcam();
    }
  };

  const stopWebcam = async () => {
    const response = await axiosInstance.post(`/stop_webcam`);
  };

  const detectObjects = async (timeInterval, threshold) => {
    const response = await axiosInstance.get(
      `/detect_objects?timeInterval=${timeInterval}&threshold=${threshold}&allProducts=${allProducts}`
    );
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/get_all_products`);
      setAllProducts(response.data.all_products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTimeIntervalChange = (e) => {
    const value = e.target.value;

    // Use a regular expression to remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Update the state with the numeric value
    setTimeInterval(numericValue);
  };

  const handleThresholdChange = (e) => {
    const value = e.target.value;

    // Use a regular expression to remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Update the state with the numeric value
    setThreshold(numericValue);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        marginBottom="5px"
      >
        <Box paddingRight={1}>
          <TextField
            label="Time Interval"
            variant="outlined"
            value={timeInterval}
            onChange={handleTimeIntervalChange}
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
              },
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
        </Box>

        <Box>
          <TextField
            label="Threshold"
            variant="outlined"
            value={threshold}
            onChange={handleThresholdChange}
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
              },
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={() => {
                toggleSwitch(timeInterval, threshold);
              }}
            />
          }
          label="Turn on AI"
          labelPlacement="start"
          style={{
            textAlign: "justify",
            fontWeight: "bold",
          }}
        />
      </Box>
      {timeIntervalValidator && (
        <span style={{ paddingRight: 10, fontStyle: 'italic' }}>
          <IonIcon icon={warning} style={{ fontSize: 24, verticalAlign: 'bottom'}}/> Please input a valid time interval!
        </span>
      )}
      {thresholdValidator && (
        <span style={{ paddingRight: 10, fontStyle: 'italic' }}>
          <IonIcon icon={warning} style={{ fontSize: 24, verticalAlign: 'bottom'}}/> Please input a valid threshold!
        </span>
      )}
    </div>
  );
}

export default Form;
