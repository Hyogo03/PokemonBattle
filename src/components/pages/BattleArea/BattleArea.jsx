import { useState, useEffect } from "react";
import { AttackButton } from "../../Parts/Button/AttackButton";
import { BackButton } from "../../Parts/Button/BackButton";
import "./BattleArea.css";

export const BattleArea = ({ playerPokemon, cpuPokemon }) => {
  // 各ステータス取得
  const getPokemonStats = (pokemon) => {
    return pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});
  };

  const playerStats = getPokemonStats(playerPokemon);
  const cpuStats = getPokemonStats(cpuPokemon);
  const playerPokemonImg = playerPokemon.sprites.back_default;
  const cpuPokemonImg = cpuPokemon.sprites.front_default;
  const playerPokemonJN = playerPokemon.japaneseName;
  const cpuPokemonJN = cpuPokemon.japaneseName;

  const [playerHp, setPlayerHp] = useState(playerStats.hp);
  const [cpuHp, setCpuHp] = useState(cpuStats.hp);
  const [log, setLog] = useState([]);

  useEffect(() => {
    setLog([
      `${playerPokemon.japaneseName} vs ${cpuPokemon.japaneseName}のバトル開始！`,
    ]);
  }, [playerPokemon, cpuPokemon]);

  /**
   * プレイヤーが攻撃する
   * CPUのHPを減らす
   * バトルログを追加
   */
  const handleAttack = () => {
    // ダメージ計算（簡易版）
    const playerAttack = playerStats.attack;
    const cpuDefense = cpuStats.defense;
    const damage = Math.floor(
      (playerAttack / cpuDefense) * (Math.random() * 10 + 1)
    );

    // CPUのHPを減らす
    setCpuHp((prevHp) => prevHp - damage);

    // バトルログを追加
    setLog((prevLog) => [
      ...prevLog,
      `自分：${playerPokemon.japaneseName}のこうげき！ ${cpuPokemon.japaneseName}に${damage}のダメージ！`,
    ]);

    // CPU側の攻撃
    setTimeout(() => {
      // CPUの攻撃力・防御力
      const cpuAttack = cpuStats.attack;
      const playerDefense = playerStats.defense;
      const cpuDamage = Math.floor(
        (cpuAttack / playerDefense) * (Math.random() * 10 + 1)
      );

      // プレイヤーのHPを減らす
      setPlayerHp((prevHp) => prevHp - cpuDamage);

      // バトルログを追加
      setLog((prevLog) => [
        ...prevLog,
        `CPU：${cpuPokemon.japaneseName}のこうげき！ ${playerPokemon.japaneseName}に${cpuDamage}のダメージ！`,
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
          <AttackButton onClick={handleAttack} />
        </div>
      </div>
      <div className="battle-log">
        {log.map((message, i) => (
          <p key={i}>{message}</p>
        ))}
      </div>
      <BackButton />
    </div>
  );
};
