import React from "react";

const Row = ({ title, champions }) => (
  <div>
    <h4 className="font-bold">{title}</h4>
    <div className="flex space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-12 h-12 border border-white">
          {champions[i] && (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/15.7.1/img/champion/${champions[i]}.png`}
              alt={champions[i]}
              className="w-full h-full"
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const BanPickBoard = ({ blueTeam, redTeam }) => (
  <div className="space-y-2">
    <Row title="블루팀 밴" champions={blueTeam.bans} />
    <Row title="레드팀 밴" champions={redTeam.bans} />
    <Row title="블루팀 픽" champions={blueTeam.picks} />
    <Row title="레드팀 픽" champions={redTeam.picks} />
  </div>
);

export default BanPickBoard;
