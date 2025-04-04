import React, { useState } from "react";

const ChampionList = ({ champions, onSelect }) => {
  const [search, setSearch] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="챔피언 검색"
        className="mb-2 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-6 gap-2 max-h-[60vh] overflow-y-auto">
        {champions
          .filter((champ) => champ.name.includes(search))
          .map((champ) => (
            <button
              key={champ.id}
              className="flex flex-col items-center border-2 border-white p-1"
              onClick={() => onSelect(champ)}
            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/15.7.1/img/champion/${champ.id}.png`}
                alt={champ.name}
                className="w-16 h-16"
              />
              <span className="text-sm">{champ.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ChampionList;
