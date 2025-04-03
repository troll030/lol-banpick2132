
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [version, setVersion] = useState('latest');
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState('');
  const [sets, setSets] = useState(Array(5).fill().map(() => ({ bluePick: [], redPick: [], blueBan: [], redBan: [] })));
  const [currentSet, setCurrentSet] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(res => setVersion(res.data[0]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`)
      .then(res => setChampions(Object.values(res.data.data)))
      .catch(console.error);
  }, [version]);

  
const handleChampionClick = (champId) => {
    try {
      const newSets = [...sets];
      const current = { ...newSets[currentSet] };
      const allPicked = [...current.bluePick, ...current.redPick, ...current.blueBan, ...current.redBan];
      if (allPicked.includes(champId)) return;

const pickOrder = 
["blueBan", "redBan", "blueBan", "redBan", "blueBan", "redBan",
 "bluePick", "redPick", "redPick",
 "bluePick", "bluePick",
 "redPick",
 "redBan", "blueBan", "redBan", "blueBan",
 "redPick", "bluePick", "bluePick", "redPick"]

;

      if (clickCount < pickOrder.length) {
        const area = pickOrder[clickCount];
        if (!current[area].includes(champId) && current[area].length < 5) {
          current[area].push(champId);
          newSets[currentSet] = current;
          setSets(newSets);
          setClickCount(clickCount + 1);
        }
      }
    } catch (e) {
      console.error('Error on champion click:', e);
    }
  };

  const resetSet = () => {
    const updated = [...sets];
    updated[currentSet] = { bluePick: [], redPick: [], blueBan: [], redBan: [] };
    setSets(updated);
    setClickCount(0);
  };

  const undoLast = () => {
    const updated = [...sets];
    const current = { ...updated[currentSet] };

    const pickOrder = 
["blueBan", "redBan", "blueBan", "redBan", "blueBan", "redBan",
 "bluePick", "redPick", "redPick",
 "bluePick", "bluePick",
 "redPick",
 "redBan", "blueBan", "redBan", "blueBan",
 "redPick", "bluePick", "bluePick", "redPick"]

;

    const lastIndex = clickCount - 1;
    if (lastIndex >= 0) {
      const area = pickOrder[lastIndex];
      if (current[area].length > 0) {
        current[area].pop();
        updated[currentSet] = current;
        setSets(updated);
        setClickCount(lastIndex);
      }
    }
  };

  const filtered = champions.filter((champ) => champ.name.includes(search));
  const areaNames = { bluePick: "블루팀 픽", redPick: "레드팀 픽", blueBan: "블루팀 밴", redBan: "레드팀 밴" };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-center text-2xl font-bold mb-4">LOL 벤픽 툴 (자동 할당)</h1>

      <div className="flex justify-center gap-2 mb-4">
        {sets.map((_, i) => (
          <button key={i} onClick={() => { setCurrentSet(i); setClickCount(0); }}
            className={`px-4 py-1 rounded border-2 ${i === currentSet ? "border-white" : "border-gray-500"}`}>
            세트 {i + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 my-4">
        <button onClick={resetSet} className="px-4 py-2 border-2 border-white rounded">🔁 Reset</button>
        <button onClick={undoLast} className="px-4 py-2 border-2 border-white rounded">↩️ Undo</button>
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="챔피언 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-black rounded w-72"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-black p-2 rounded max-h-48 overflow-y-auto border-2 border-white justify-center">
        {filtered.map((champ) => (
          <div key={champ.id} onClick={() => handleChampionClick(champ.id)} className="cursor-pointer">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`}
              className="w-12 h-12 rounded border-2 border-white"
              title={champ.name}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {["bluePick", "redPick", "blueBan", "redBan"].map((type) => (
          <div key={type}>
            <h2 className="text-center font-bold mb-1">{areaNames[type]}</h2>
            <div className="flex gap-2 border-2 border-white bg-gray-800 rounded p-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-12 h-12 border border-dashed border-white flex items-center justify-center">
                  {sets[currentSet][type][i] && (
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${sets[currentSet][type][i]}.png`}
                      className="w-10 h-10"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
