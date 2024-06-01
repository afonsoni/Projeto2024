import React, { useState } from 'react';

const Festa = ({ festa }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="border p-4 mb-4 rounded shadow-md bg-white">
      <h2 className="text-xl font-semibold">{festa["Nome da Festa"]}</h2>
      <p>{festa.Data}</p>
      <p>{festa.Freguesia}, {festa.Concelho}, {festa.Distrito}</p>
      {showMore && <p className="mt-2">{festa.Descrição}</p>}
      <button
        className="mt-2 text-blue-500 hover:underline"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? 'Mostrar menos' : 'Mostrar mais'}
      </button>
    </div>
  );
};

export default Festa;
