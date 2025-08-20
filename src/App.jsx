import { useEffect, useState } from "react";
import { PokemonSelect } from "./components/pages/PokemonSelect/PokemonSelect";
import { BattleArea } from "./components/pages/BattleArea/BattleArea";
import "./App.css";
import "../src/ress.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Loading } from "./components/pages/Loading/Loading";

const savePokemonToLocalStorage = (player, cpu) => {
  localStorage.setItem("playerPokemon", JSON.stringify(player));
  localStorage.setItem("cpuPokemon", JSON.stringify(cpu));
};

const loadPokemonFromLocalStorage = () => {
  const player = localStorage.getItem("playerPokemon");
  const cpu = localStorage.getItem("cpuPokemon");

  if (player && cpu) {
    return {
      player: JSON.parse(player),
      cpu: JSON.parse(cpu),
    };
  }
  return { player: null, cpu: null };
};

export function App() {
  const initialData = loadPokemonFromLocalStorage();
  const [playerPokemon, setPlayerPokemon] = useState(initialData.player);
  const [cpuPokemon, setCpuPokemon] = useState(initialData.cpu);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const PokemonSelectWrapper = () => {
    const navigate = useNavigate();

    const getPokemonWithJapaneseName = async (pokemonUrl) => {
      // ポケモンの詳細データを取得
      const pokemonRes = await fetch(pokemonUrl);
      const pokemonData = await pokemonRes.json();

      // 種族データを取得
      const speciesRes = await fetch(pokemonData.species.url);
      const speciesData = await speciesRes.json();

      // 日本語名を見つけて、データに追加
      const japaneseName = speciesData.names.find(
        (name) => name.language.name === "ja-Hrkt"
      ).name;
      return {
        ...pokemonData,
        japaneseName: japaneseName,
      };
    };

    const handleSelectPokemon = async (selectedPokemon) => {
      setIsLoading(true);

      const randomId = Math.floor(Math.random() * 151) + 1;
      const cpuPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

      try {
        // CPUのポケモンデータのみを非同期で取得
        const cpuData = await getPokemonWithJapaneseName(cpuPokemonUrl);

        // プレイヤーとCPUのデータを一度にステートにセット
        setPlayerPokemon(selectedPokemon);
        setCpuPokemon(cpuData);
        savePokemonToLocalStorage(selectedPokemon, cpuData);

        setTimeout(() => {
          setIsLoading(false);
          navigate("/battle");
        }, 2000);
      } catch (error) {
        console.error("Failed to fetch pokemon data:", error);
        setIsLoading(false);
        // エラーハンドリング
      }
    };

    return <PokemonSelect onSelect={handleSelectPokemon} />;
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={isLoading ? <Loading /> : <PokemonSelectWrapper />}
          />
          <Route
            path="/battle"
            element={
              playerPokemon && cpuPokemon ? (
                <BattleArea
                  playerPokemon={playerPokemon}
                  cpuPokemon={cpuPokemon}
                />
              ) : (
                <></>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
