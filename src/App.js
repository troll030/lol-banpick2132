import React, { useEffect, useState } from "react";
import ChampionList from "./components/ChampionList";
import BanPickBoard from "./components/BanPickBoard";
import Controls from "./components/Controls";

const App = () => {
  const [champions, setChampions] = useState([]);
  const [blueTeam, setBlueTeam] = useState({ bans: [], picks: [] });
  const [redTeam, setRedTeam] = useState({ bans: [], picks: [] });
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState([]);

  const banPickOrder = [
    { team: "blue", type: "ban" },   // 1
    { team: "red", type: "ban" },    // 2
    { team: "blue", type: "ban" },   // 3
    { team: "red", type: "ban" },    // 4
    { team: "blue", type: "ban" },   // 5
    { team: "red", type: "ban" },    // 6
    { team: "blue", type: "pick" },  // 7
    { team: "red", type: "pick" },   // 8
    { team: "red", type: "pick" },   // 9
    { team: "blue", type: "pick" },  // 10
    { team: "blue", type: "pick" },  // 11
    { team: "red", type: "pick" },   // 12
    { team: "red", type: "ban" },    // 13
    { team: "blue", type: "ban" },   // 14
    { team: "red", type: "ban" },    // 15
    { team: "blue", type: "ban" },   // 16
    { team: "red", type: "pick" },   // 17
    { team: "blue", type: "pick" },  // 18
    { team: "blue", type: "pick" },  // 19
    { team: "red", type: "pick" },   // 20
  ];

  const version = "15.7.1";

  useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`)
      .then((res) => res.json())
      .then((data) => setChampions(Object.values(data.data)));
  }, []);

  const handleSelectChampion = (champion) => {
    if (blueTeam.bans.includes(champion.id) || redTeam.bans.includes(champion.id) ||
        blueTeam.picks.includes(champion.id) || redTeam.picks.includes(champion.id)) return;

    const { team, type } = banPickOrder[currentStep] || {};
    if (!team || !type) return;

    const newHistory = [...history, { blueTeam, redTeam, currentStep }];
    const updatedTeam = { ...((team === "blue") ? blueTeam : redTeam) };
    updatedTeam[type + "s"] = [...updatedTeam[type + "s"], champion.id];

    if (team === "blue") {
      setBlueTeam(updatedTeam);
    } else {
      setRedTeam(updatedTeam);
    }

    setHistory(newHistory);
    setCurrentStep(currentStep + 1);
  };

  const handleReset = () => {
    setBlueTeam({ bans: [], picks: [] });
    setRedTeam({ bans: [], picks: [] });
    setCurrentStep(0);
    setHistory([]);
  };

  const handleUndo = () => {
    const lastState = history.pop();
    if (lastState) {
      setBlueTeam(lastState.blueTeam);
      setRedTeam(lastState.redTeam);
      setCurrentStep(lastState.currentStep);
      setHistory([...history]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <BanPickBoard blueTeam={blueTeam} redTeam={redTeam} />
      <ChampionList champions={champions} onSelect={handleSelectChampion} />
      <Controls onReset={handleReset} onUndo={handleUndo} />
    </div>
  );
};

export default App;
