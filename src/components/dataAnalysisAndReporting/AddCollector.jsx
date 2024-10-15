import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { Box, Paper, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button"; // Using Material-UI button for consistency

function AddCollector() {
  const [collectorName, setCollectorName] = useState("");
  const [collectorEmail, setCollectorEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reference to 'collector' collection
    const collectorsCollection = collection(db, "collector");

    try {
      // Add a new document with collectorEmail and collectorName
      await addDoc(collectorsCollection, {
        collectorEmail: collectorEmail,
        collectorName: collectorName,
      });
      alert("Collector added successfully!");
      setCollectorEmail("");
      setCollectorName("");
    } catch (error) {
      console.error("Error adding collector: ", error);
      alert("Failed to add collector");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 600,
          borderRadius: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#37474f",
            textTransform: "uppercase",
          }}
        >
          Add Collector
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Collector Name"
              variant="outlined"
              fullWidth
              value={collectorName}
              onChange={(e) => setCollectorName(e.target.value)}
              required
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                  "& fieldset": {
                    borderColor: "#bdbdbd",
                  },
                  "&:hover fieldset": {
                    borderColor: "#37474f",
                  },
                },
              }}
            />
            <TextField
              label="Collector Email"
              variant="outlined"
              fullWidth
              value={collectorEmail}
              onChange={(e) => setCollectorEmail(e.target.value)}
              required
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                  "& fieldset": {
                    borderColor: "#bdbdbd",
                  },
                  "&:hover fieldset": {
                    borderColor: "#37474f",
                  },
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: 2,
              borderRadius: "12px",
              fontSize: "16px",
              backgroundColor: "#00796b",
              "&:hover": {
                backgroundColor: "#004d40",
              },
              transition: "background-color 0.3s ease",
            }}
          >
            Add Collector
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default AddCollector;
