import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import axiosInstance from "./axiosInstance";

function LineGraph() {
  const [productList, setProductList] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [isFocused, setIsFocused] = useState(true);
  const [seriesVisibility, setSeriesVisibility] = useState({});

  const toggleSeriesVisibility = (seriesId) => {
    setSeriesVisibility((prevVisibility) => ({
      ...prevVisibility,
      [seriesId]: !prevVisibility[seriesId],
    }));
  };

  const fetchGraphData = async () => {
    try {
      const promises = productList.map(async (product) => {
        const response = await axiosInstance.get(
          `/generate_graph?product_codename=${product}`
        );
        const responseData = response.data;
        return {
          id: product,
          color: `hsl(104, 70%, 50%)`,
          data: responseData.map((item) => ({
            x: item.Date_created,
            y: item.Product_count,
          })),
        };
      });

      const transformedDataArray = await Promise.all(promises);
      setTransformedData(transformedDataArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get(`/get_all_products`);
      setProductList(response.data.all_products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchGraphData();

    const intervalId = setInterval(() => {
      if (isFocused) {
        fetchGraphData();
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isFocused]);

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const initialVisibility = {};
    productList.forEach((product) => {
      initialVisibility[product] = true;
    });
    setSeriesVisibility(initialVisibility);
  }, [productList]);

  const colors = {
    coke: "red",
    mountain_dew: "yellow",
    other: "black",
    pocari: "blue",
  };

  const theme = {
    fontFamily: "Arial, sans-serif",
    textColor: "#333",
    grid: {
      line: {
        stroke: "#eee",
        strokeWidth: 1,
      },
    },
    axis: {
      legend: {
        text: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      ticks: {
        text: {
          fontSize: 12,
          fontWeight: "bold",
        },
      },
    },
    crosshair: {
      line: {
        stroke: "#aaa",
        strokeWidth: 1,
        strokeDasharray: "6 6",
      },
    },
  };

  return (
    <>
      <div
        style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", height: 400 }}
      >
        <ResponsiveLine
          data={transformedData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Time",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            tickValues: Array.from({ length: 101 }, (_, i) => i),
            legend: "Count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={(series) =>
            seriesVisibility[series.id] ? colors[series.id] : "rgba(0, 0, 0, 0)"
          }
          enableSlices="x"
          pointSize={8}
          pointColor={{ from: "color" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "color" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 90,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          theme={theme}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {productList.map((product) => (
          <div
            key={product}
            onClick={() => toggleSeriesVisibility(product)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              opacity: seriesVisibility[product] ? 1 : 0.5,
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: colors[product],
                marginRight: "5px",
              }}
            />
            <span>{product}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default LineGraph;
