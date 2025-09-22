import { useState, useEffect } from "react";
import { AttackButton } from "../../Parts/Button/AttackButton";
import { BackButton } from "../../Parts/Button/BackButton";
import "./BattleArea.css";

export const BattleArea = ({ playerPokemon, cpuPokemon, onBattleEnd }) => {
  // 各ステータス取得
  const getPokemonStats = (pokemon) => {
    return pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});
  };

  // ポケモン技の４個の日本語名を取得
  const getPokemonMoves = async (pokemon) => {
    // 最初の4つの技のURLを取得
    const moveUrls = pokemon.moves.slice(0, 4).map((move) => move.move.url);

    // すべての fetch リクエストを並行して実行
    const movePromises = moveUrls.map((url) =>
      fetch(url)
        .then((response) => response.json())
        .then(
          (data) => data.names.find((name) => name.language.name === "ja").name
        )
    );

    // すべての Promise が解決するのを待つ
    const moves = await Promise.all(movePromises);
    return moves;
  };

  const playerStats = getPokemonStats(playerPokemon);
  console.log(playerStats);
  const cpuStats = getPokemonStats(cpuPokemon);
  console.log(cpuStats);
  const playerPokemonImg = playerPokemon.sprites.back_default;
  const cpuPokemonImg = cpuPokemon.sprites.front_default;
  const playerPokemonJN = playerPokemon.japaneseName;
  const cpuPokemonJN = cpuPokemon.japaneseName;

  const [playerHp, setPlayerHp] = useState(playerStats.hp);
  const [cpuHp, setCpuHp] = useState(cpuStats.hp);
  const [log, setLog] = useState([]);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [cpuMoves, setCpuMoves] = useState([]);

  useEffect(() => {
    setLog([
      `${playerPokemon.japaneseName} vs ${cpuPokemon.japaneseName}のバトル開始！`,
    ]);

    getPokemonMoves(playerPokemon).then((moves) => {
      setPlayerMoves(moves);
      console.log(moves);
    });
    getPokemonMoves(cpuPokemon).then((moves) => {
      setCpuMoves(moves);
      console.log(moves);
    });
  }, [playerPokemon, cpuPokemon]);

  // HPが0になったかを監視
  useEffect(() => {
    if (playerHp <= 0) {
      setTimeout(() => {
        onBattleEnd("cpu");
      }, 1000);
    }
    if (cpuHp <= 0) {
      setTimeout(() => {
        onBattleEnd("player");
      }, 1000);
    }
  }, [playerHp, cpuHp, onBattleEnd]);

  useEffect(() => {
    const boxLog = document.querySelector(".battle-log");
    if (log) {
      boxLog.scrollTop = boxLog.scrollHeight;
    }
  }, [log]);

  /**
   * プレイヤーが攻撃する
   * CPUのHPを減らす
   * バトルログを追加
   */
  const handleAttack = (selectedMove) => {
    // ダメージ計算（簡易版）
    const playerAttack = playerStats.attack;
    const cpuDefense = cpuStats.defense;

    // const movePower = playerMoves.find((move) => move === selectedMove);

    // ダメージ計算の式に技の威力を追加
    // const damage = Math.floor(
    //   (playerAttack / cpuDefense) *
    //     (Math.random() * 10 + 1) *
    //     (movePower / 10)
    // );

    const damage = Math.floor(
      (playerAttack / cpuDefense) * (Math.random() * 10 + 1)
    );

    // CPUのHPを減らす
    setCpuHp((prevHp) => prevHp - damage);

    // バトルログを追加
    setLog((prevLog) => [
      ...prevLog,
      `自分：${playerPokemon.japaneseName}の${selectedMove}！ ${damage}のダメージ！`,
    ]);

    // CPU側の攻撃
    setTimeout(() => {
      // CPUの攻撃力・防御力
      const cpuAttack = cpuStats.attack;
      const playerDefense = playerStats.defense;
      const cpuDamage = Math.floor(
        (cpuAttack / playerDefense) * (Math.random() * 10 + 1)
      );

      const selectedMove =
        cpuMoves[Math.floor(Math.random() * cpuMoves.length)];

      // プレイヤーのHPを減らす
      setPlayerHp((prevHp) => prevHp - cpuDamage);

      // バトルログを追加
      setLog((prevLog) => [
        ...prevLog,
        `CPU：${cpuPokemon.japaneseName}の${selectedMove}！ ${cpuDamage}のダメージ！`,
      ]);
    }, 1500);
  };

  return (
    <div>
      <div className="battle-area">
        {/* CPU側の表示 */}
        <div className="pokemon-stats">
          <img src={cpuPokemonImg} alt={cpuPokemonJN} />
          <div className="hpWrapper">
            <h2>{cpuPokemonJN}</h2>

            <div className="hpContainer">
              <div
                className="hpBar"
                style={{
                  width: `${(cpuHp / cpuStats.hp) * 100}%`,
                }}
              >
                <p>
                  {cpuHp}/{cpuStats.hp}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ユーザー側の表示 */}
        <div className="pokemon-stats">
          <img src={playerPokemonImg} alt={playerPokemonJN} />
          <div className="hpWrapper">
            <h2>{playerPokemonJN}</h2>
            <div className="hpContainer">
              <div
                className="hpBar"
                style={{
                  width: `${(playerHp / playerStats.hp) * 100}%`,
                }}
              >
                <p>
                  {playerHp}/{playerStats.hp}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="battle-controls">
        <div className="moves">
          <p>技を選択：</p>
          <AttackButton onAttack={handleAttack} onMove={playerMoves} />
        </div>
      </div>
      <div className="battle-log">
        {log.map((message, i) => (
          <p key={i} className="battle-log-message">
            {message}
          </p>
        ))}
      </div>
      <BackButton />
    </div>
  );
};
