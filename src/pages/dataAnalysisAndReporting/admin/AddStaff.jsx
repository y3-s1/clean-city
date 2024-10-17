import React from "react";
import AddTruck from "../../../components/dataAnalysisAndReporting/AddTruck";
import AddCollector from "../../../components/dataAnalysisAndReporting/AddCollector";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
} from "@mui/material";

function AddStaff() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      padding={4}
      sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }} // Light background for premium feel
    >
      {/* Using Grid to arrange items left and right */}
      <Grid container spacing={4} justifyContent="center">
        {/* Collector Section (Left Side) */}
        <Grid item xs={12} md={6}>
          {" "}
          {/* Adjust column width for responsive design */}
          <Card
            sx={{
              padding: 3,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                Add Collector
              </Typography>
              <Divider sx={{ marginBottom: 3 }} />
              <AddCollector />
            </CardContent>
          </Card>
        </Grid>

        {/* Truck Section (Right Side) */}
        <Grid item xs={12} md={6}>
          {" "}
          {/* Adjust column width for responsive design */}
          <Card
            sx={{
              padding: 3,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                Add Truck
              </Typography>
              <Divider sx={{ marginBottom: 3 }} />
              <AddTruck />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddStaff;
