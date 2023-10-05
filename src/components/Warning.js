import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import axiosInstance from "./axiosInstance";

const cardStyle = {
  height: "207px",
  width: "170px",
  margin: "10px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
};

const mediaStyle = {
  height: 150,
};

const contentStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleStyle = {
  fontSize: "0.9rem",
  fontWeight: "bold",
};

const subtitleStyle = {
  fontSize: "0.75rem",
  fontStyle: "italic",
};

function Warning({ value }) {
  const [currentImage, setCurrentImage] = useState("");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/get_json?json_filename=all_products_count`
      );
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let intervalId = null;

    const fetchDataInterval = () => {
      fetchData();
      if (value === "") {
        intervalId = setInterval(fetchData, 5000);
        console.log("Interval started");
      } else {
        intervalId = setInterval(fetchData, parseInt(value) * 1000);
        console.log("Interval started");
      }
    };

    fetchDataInterval();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Cleared interval");
      }
    };
  }, [value]);

  const getCountText = (count, threshold) => {
    if (count === 0) {
      return "Alert: Please refill immediately!";
    } else if (count <= threshold && count > 0) {
      return "Warning: You may now refill!";
    } else {
      return "Available stocks!";
    }
  };

  const getCountTextStyle = (count, threshold) => {
    if (count === 0) {
      return { color: "red", fontWeight: "bold" };
    } else if (count <= threshold && count > 0) {
      return { color: "#d48d1c", fontWeight: "bold" };
    } else {
      return { color: "black", fontWeight: "bold" };
    }
  };

  const getProductImage = (product) => {
    switch (product) {
      case "coke":
        return "/coke_logo.png";
      case "mountain_dew":
        return "/mountain_dew_logo.png";
      case "pocari":
        return "/pocari_logo.png";
      case "other":
        return "/other_logo.png";
      default:
        return "No image to display";
    }
  };

  return (
    <div>
      <p
        style={{
          textShadow: "2px 2px 2px white",
          color: "black",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        ALL PRODUCTS
      </p>
      <div
        style={{
          height: "240px",
          width: "760px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
          display: "flex",
          overflowX: "auto",
          padding: 5,
          marginBottom: 10,
        }}
      >
        {data.map((datum, index) => (
          <Card sx={cardStyle} key={index}>
            <CardMedia
              sx={mediaStyle}
              component="img"
              alt="testing"
              height="200"
              src={getProductImage(datum.product)}
            />
            <CardContent>
              <Box sx={contentStyle}>
                <div>
                  <Typography sx={titleStyle} variant="h5" component="div">
                    {datum.product}
                  </Typography>
                  <Typography
                    sx={subtitleStyle}
                    color="text.secondary"
                  ></Typography>
                </div>
                <Typography
                  variant="h5"
                  component="div"
                  style={getCountTextStyle(datum.count, datum.threshold)}
                >
                  {datum.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Warning;
