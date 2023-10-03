import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import axiosInstance from "./axiosInstance";

function DetectedFrame({ value }) {
  const [currentImage, setCurrentImage] = useState("");

  const fetchImage = async () => {
    try {
      const response = await axiosInstance.get(
        `/get_one_image?image_path=current_image.jpg`
      );
      setCurrentImage(response.data.image_base64);
      console.log(
        "Checker that this fetchImage api is indeed fetching an image on a specified interval"
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let intervalId = null;

    const fetchImageInterval = () => {
      fetchImage();
      if (value === "") {
        intervalId = setInterval(fetchImage, 5000);
        console.log("Interval started");
      } else {
        intervalId = setInterval(fetchImage, parseInt(value) * 1000);
        console.log("Interval started");
      }
    };

    // Initial data fetching
    fetchImageInterval();

    // Cleanup: Stop the timer when the component unmounts or loses focus
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Cleared interval");
      }
    };
  }, [value]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={`data:image/png;base64,${currentImage}`}
          alt="Image"
          style={{
            width: 640,
            height: 640,
            boxShadow: "0px 4px 6px rgba(0.9, 0.9, 0.9, 0.9)",
          }}
        />
      </div>
    </>
  );
}

export default DetectedFrame;
