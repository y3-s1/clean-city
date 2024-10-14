import React from 'react';

const SpecialWasteHelp = () => {
  return (
    <div className="container py-4 bg-light">
      <h1 className="display-4 mb-4">Special Waste Help</h1>
      <p className="lead mb-5">Help and guidelines on special waste collection are detailed below.</p>

      {/* Household Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">1. Household Waste</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>General Waste (Mixed Household Waste):</strong> Non-recyclable waste such as food wrappers, used tissues, or non-recyclable packaging.</li>
          <li className="list-group-item"><strong>Organic Waste (Compostable Waste):</strong> Food scraps, garden waste, and biodegradable materials.</li>
        </ul>
      </div>

      {/* Recyclable Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">2. Recyclable Waste</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Plastic:</strong> Bottles, containers, bags, and packaging materials.</li>
          <li className="list-group-item"><strong>Paper and Cardboard:</strong> Newspapers, magazines, boxes, and paper packaging.</li>
          <li className="list-group-item"><strong>Glass:</strong> Bottles, jars, and glass containers.</li>
          <li className="list-group-item"><strong>Metal:</strong> Aluminum cans, tin cans, and scrap metal.</li>
        </ul>
      </div>

      {/* E-Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">3. E-Waste (Electronic Waste)</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Small Electronics:</strong> Mobile phones, tablets, laptops, chargers.</li>
          <li className="list-group-item"><strong>Large Electronics:</strong> Televisions, washing machines, refrigerators, and air conditioners.</li>
          <li className="list-group-item"><strong>Batteries:</strong> Both rechargeable and single-use batteries.</li>
        </ul>
      </div>

      {/* Hazardous Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">4. Hazardous Waste</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Chemical Waste:</strong> Cleaning agents, paints, pesticides, and solvents.</li>
          <li className="list-group-item"><strong>Medical Waste:</strong> Syringes, expired medications, and medical equipment.</li>
          <li className="list-group-item"><strong>Flammable Waste:</strong> Items like gasoline, kerosene, or other combustible materials.</li>
        </ul>
      </div>

      {/* Bulky Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">5. Bulky Waste</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Furniture:</strong> Old sofas, chairs, tables, mattresses, etc.</li>
          <li className="list-group-item"><strong>Large Appliances:</strong> Refrigerators, stoves, and washing machines.</li>
          <li className="list-group-item"><strong>Construction Debris:</strong> Bricks, tiles, wood, and other building materials.</li>
        </ul>
      </div>

      {/* Green Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">6. Green Waste</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Yard/Garden Waste:</strong> Grass clippings, tree branches, dead leaves, and other plant materials.</li>
        </ul>
      </div>

      {/* Textile Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">7. Textile Waste</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Clothing and Fabrics:</strong> Old clothes, sheets, curtains, and other fabric items.</li>
          <li className="list-group-item"><strong>Shoes and Accessories:</strong> Shoes, belts, bags.</li>
        </ul>
      </div>

      {/* Special Event Waste */}
      <div className="mb-4">
        <h2 className="h3 mb-3">8. Special Event Waste</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Waste from Parties or Large Gatherings:</strong> Can include a mix of general, recyclable, and organic waste.</li>
          <li className="list-group-item"><strong>Festival/Event Waste:</strong> Includes plastic cups, paper plates, decorations, and general litter.</li>
        </ul>
      </div>
    </div>
  );
};

export default SpecialWasteHelp;