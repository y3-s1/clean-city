import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Card, CardContent, Typography, IconButton, Collapse, List, ListItem, ListItemText } from '@mui/material';

const SpecialWasteHelp = () => {
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const categories = [
    {
      title: 'Household Waste',
      items: [
        { label: 'General Waste (Mixed Household Waste)', description: 'Non-recyclable waste such as food wrappers, used tissues, or non-recyclable packaging.' },
        { label: 'Organic Waste (Compostable Waste)', description: 'Food scraps, garden waste, and biodegradable materials.' },
      ],
    },
    {
      title: 'Recyclable Waste',
      items: [
        { label: 'Plastic', description: 'Bottles, containers, bags, and packaging materials.' },
        { label: 'Paper and Cardboard', description: 'Newspapers, magazines, boxes, and paper packaging.' },
        { label: 'Glass', description: 'Bottles, jars, and glass containers.' },
        { label: 'Metal', description: 'Aluminum cans, tin cans, and scrap metal.' },
      ],
    },
    {
      title: 'E-Waste (Electronic Waste)',
      items: [
        { label: 'Small Electronics', description: 'Mobile phones, tablets, laptops, chargers.' },
        { label: 'Large Electronics', description: 'Televisions, washing machines, refrigerators, and air conditioners.' },
        { label: 'Batteries', description: 'Both rechargeable and single-use batteries.' },
      ],
    },
    {
      title: 'Hazardous Waste',
      items: [
        { label: 'Chemical Waste', description: 'Cleaning agents, paints, pesticides, and solvents.' },
        { label: 'Medical Waste', description: 'Syringes, expired medications, and medical equipment.' },
        { label: 'Flammable Waste', description: 'Items like gasoline, kerosene, or other combustible materials.' },
      ],
    },
    {
      title: 'Bulky Waste',
      items: [
        { label: 'Furniture', description: 'Old sofas, chairs, tables, mattresses, etc.' },
        { label: 'Large Appliances', description: 'Refrigerators, stoves, and washing machines.' },
        { label: 'Construction Debris', description: 'Bricks, tiles, wood, and other building materials.' },
      ],
    },
    {
      title: 'Green Waste',
      items: [
        { label: 'Yard/Garden Waste', description: 'Grass clippings, tree branches, dead leaves, and other plant materials.' },
      ],
    },
    {
      title: 'Textile Waste',
      items: [
        { label: 'Clothing and Fabrics', description: 'Old clothes, sheets, curtains, and other fabric items.' },
        { label: 'Shoes and Accessories', description: 'Shoes, belts, bags.' },
      ],
    },
    {
      title: 'Special Event Waste',
      items: [
        { label: 'Waste from Parties or Large Gatherings', description: 'Can include a mix of general, recyclable, and organic waste.' },
        { label: 'Festival/Event Waste', description: 'Includes plastic cups, paper plates, decorations, and general litter.' },
      ],
    },
  ];

  return (
    <div className="container py-4 bg-light">
      <h1 className="display-6 mb-4">Special Waste Help</h1>
      <p className="lead mb-4">Guidelines for special waste collection are outlined below. Click a category to view more details.</p>

      {categories.map((category, index) => (
        <Card key={index} className="mb-4">
          <CardContent>
            <div className="d-flex justify-content-between align-items-center">
              <Typography variant="h6" component="h2">
                {category.title}
              </Typography>
              <IconButton onClick={() => toggleCategory(category.title)}>
                {openCategories[category.title] ? <FaChevronUp /> : <FaChevronDown />}
              </IconButton>
            </div>

            <Collapse in={openCategories[category.title]}>
              <List component="div" disablePadding>
                {category.items.map((item, i) => (
                  <ListItem key={i} className="px-4 py-2">
                    <ListItemText
                      primary={<strong>{item.label}</strong>}
                      secondary={item.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SpecialWasteHelp;
