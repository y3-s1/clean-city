import React from 'react';


const SpecialWasteHelp = () => {
  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Special Waste Help</h1>
      <p className="mb-8">Help and guidelines on special waste collection are detailed below.</p>

      {/* Household Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Household Waste</h2>
        <ul className="list-disc ml-6">
          <li><strong>General Waste (Mixed Household Waste):</strong> Non-recyclable waste such as food wrappers, used tissues, or non-recyclable packaging.</li>
          <li><strong>Organic Waste (Compostable Waste):</strong> Food scraps, garden waste, and biodegradable materials.</li>
        </ul>
      </div>

      {/* Recyclable Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Recyclable Waste</h2>
        <ul className="list-disc ml-6">
          <li><strong>Plastic:</strong> Bottles, containers, bags, and packaging materials.</li>
          <li><strong>Paper and Cardboard:</strong> Newspapers, magazines, boxes, and paper packaging.</li>
          <li><strong>Glass:</strong> Bottles, jars, and glass containers.</li>
          <li><strong>Metal:</strong> Aluminum cans, tin cans, and scrap metal.</li>
        </ul>
      </div>

      {/* E-Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. E-Waste (Electronic Waste)</h2>
        <ul className="list-disc ml-6">
          <li><strong>Small Electronics:</strong> Mobile phones, tablets, laptops, chargers.</li>
          <li><strong>Large Electronics:</strong> Televisions, washing machines, refrigerators, and air conditioners.</li>
          <li><strong>Batteries:</strong> Both rechargeable and single-use batteries.</li>
        </ul>
      </div>

      {/* Hazardous Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Hazardous Waste</h2>
        <ul className="list-disc ml-6">
          <li><strong>Chemical Waste:</strong> Cleaning agents, paints, pesticides, and solvents.</li>
          <li><strong>Medical Waste:</strong> Syringes, expired medications, and medical equipment.</li>
          <li><strong>Flammable Waste:</strong> Items like gasoline, kerosene, or other combustible materials.</li>
        </ul>
      </div>

      {/* Bulky Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Bulky Waste</h2>
        <ul className="list-disc ml-6">
          <li><strong>Furniture:</strong> Old sofas, chairs, tables, mattresses, etc.</li>
          <li><strong>Large Appliances:</strong> Refrigerators, stoves, and washing machines.</li>
          <li><strong>Construction Debris:</strong> Bricks, tiles, wood, and other building materials.</li>
        </ul>
      </div>

      {/* Green Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Green Waste</h2>
        <ul className="list-disc ml-6">
          <li><strong>Yard/Garden Waste:</strong> Grass clippings, tree branches, dead leaves, and other plant materials.</li>
        </ul>
      </div>

      {/* Textile Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Textile Waste</h2>
        <ul className="list-disc ml-6">
          <li><strong>Clothing and Fabrics:</strong> Old clothes, sheets, curtains, and other fabric items.</li>
          <li><strong>Shoes and Accessories:</strong> Shoes, belts, bags.</li>
        </ul>
      </div>

      {/* Special Event Waste */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Special Event Waste</h2>
        <ul className="list-disc ml-6">
          <li><strong>Waste from Parties or Large Gatherings:</strong> Can include a mix of general, recyclable, and organic waste.</li>
          <li><strong>Festival/Event Waste:</strong> Includes plastic cups, paper plates, decorations, and general litter.</li>
        </ul>
      </div>
    </div>
  );
};

export default SpecialWasteHelp;
