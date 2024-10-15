import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { FaRecycle, FaTrash, FaGlobe, FaLightbulb } from 'react-icons/fa';

const HomeResident = () => {
  return (
    <Container maxWidth="lg" className="mt-4">
      <Box className="mb-4" style={{ height: '300px', overflow: 'hidden' }}>
        <img
          src="https://gargeon.com/wp-content/uploads/2022/09/best-waste-disposal-service.jpg"
          alt="Waste Management"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      <Grid container spacing={4}>
        {[
          {
            title: "Waste Monitoring",
            content: [
              "Remember to sort your recyclables!"
            ],
            icon: <FaRecycle size={24} />
          },
          {
            title: "Waste Collection",
            content: [
              "Regular trash pickup: Every Monday and Thursday",
              "Please place bins on the curb by 7 AM."
            ],
            icon: <FaTrash size={24} />
          },
          {
            title: "Your Impact",
            content: [
              "Help to heal the world!"
            ],
            icon: <FaGlobe size={24} />
          },
          {
            title: "Today's Tip",
            content: [
              "Use reusable shopping bags"
            ],
            icon: <FaLightbulb size={24} />
          }
        ].map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper 
              className="p-4" 
              style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: '#D3EE98'  // Pale light green color
              }}
            >
              <Box display="flex" alignItems="center" className="mb-3">
                {card.icon}
                <Typography variant="h5" style={{ marginLeft: '8px' }}>
                  {card.title}
                </Typography>
              </Box>
              <Box flexGrow={1}>
                {card.content.map((item, i) => (
                  <Typography key={i} paragraph>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomeResident;
