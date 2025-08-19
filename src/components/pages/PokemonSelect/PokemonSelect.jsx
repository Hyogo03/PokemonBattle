import { useState, useEffect } from "react";
import "./PokemonSelect.css";

export function PokemonSelect({ onSelect }) {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    // APIから最初の151匹のポケモンリストを取得
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        // resultsには名前とURLしか含まれていないため、
        // 各ポケモンの詳細データ（画像を含む）を個別に取得する

        const fetchedPokemons = data.results.map((pokemon) =>
          fetch(pokemon.url)
            .then((res) => res.json())
            .then((pokemonData) => {
              // species URLを取得
              const speciesUrl = pokemonData.species.url;
              return fetch(speciesUrl)
                .then((res) => res.json())
                .then((speciesData) => {
                  // 日本語名を見つけて返す
                  const japaneseName = speciesData.names.find(
                    (name) => name.language.name === "ja-Hrkt"
                  ).name;
                  return {
                    ...pokemonData,
                    japaneseName: japaneseName,
                  };
                });
            })
        );

        // Promise.allで全てのfetchが終わるのを待つ
        Promise.all(fetchedPokemons).then((pokemonData) => {
          setPokemons(pokemonData);
        });
      });
  }, []);

  return (
    <div>
      <h1>ポケモンを選ぼう！</h1>
      <div className="pokemon-list">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.name}
            className="pokemon-card"
            onClick={() => onSelect(pokemon)}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className={"pokemon-sprite"}
            />
            <p>{pokemon.japaneseName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
