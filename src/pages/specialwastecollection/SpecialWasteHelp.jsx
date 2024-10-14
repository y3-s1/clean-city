import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
      <h1 className="display-6 mb-2">Special Waste Help</h1>
      <p className="lead mb-5">Help and guidelines on special waste collection are detailed below.</p>

      {categories.map((category, index) => (
        <div key={index} className="mb-4">
          <h2 className="h4 mb-3 d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => toggleCategory(category.title)}>
            {category.title}
            <span className="ms-auto">
              {openCategories[category.title] ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </h2>
          <div className={`collapse ${openCategories[category.title] ? 'show' : ''}`}>
            <ul className="list-group">
              {category.items.map((item, i) => (
                <li className="list-group-item" key={i}>
                  <strong>{item.label}:</strong> {item.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecialWasteHelp;
