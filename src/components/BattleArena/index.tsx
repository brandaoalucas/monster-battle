import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Divider,
  Chip,
  Alert,
  Fade,
  Zoom,
} from "@mui/material";
import {
  PlayArrow,
  Refresh,
  Security,
  Speed,
  EmojiEvents,
  Bolt,
  Shield,
} from "@mui/icons-material";
import { Monster, BattleResult } from "../../types";
import { executeBattle } from "../../utils/battleEngine";
import { BattleArenaProps } from "../../types";

const BattleArena: React.FC<BattleArenaProps> = ({
  monster1,
  monster2,
  onBattleComplete,
  onReset,
}) => {
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [attackingMonster, setAttackingMonster] = useState<string | null>(null);
  const [monster1CurrentHp, setMonster1CurrentHp] = useState<number>(
    monster1.hp
  );
  const [monster2CurrentHp, setMonster2CurrentHp] = useState<number>(
    monster2.hp
  );
  const [battleFinished, setBattleFinished] = useState<boolean>(false);
  const [currentRoundData, setCurrentRoundData] = useState<any>(null);

  useEffect(() => {
    setMonster1CurrentHp(monster1.hp);
    setMonster2CurrentHp(monster2.hp);
    setBattleFinished(false);
  }, [monster1, monster2]);

  const handleInstantBattle = () => {
    const result = executeBattle(monster1, monster2);
    setBattleResult(result);
    setCurrentRound(result.totalRounds);
    setMonster1CurrentHp(
      result.winner.id === monster1.id
        ? result.winner.currentHp || 0
        : result.loser.currentHp || 0
    );
    setMonster2CurrentHp(
      result.winner.id === monster2.id
        ? result.winner.currentHp || 0
        : result.loser.currentHp || 0
    );
    setBattleFinished(true);
    onBattleComplete?.(result);
  };

  const handleAnimatedBattle = async () => {
    setIsAnimating(true);
    setCurrentRound(0);
    setMonster1CurrentHp(monster1.hp);
    setMonster2CurrentHp(monster2.hp);
    setBattleFinished(false);
    setCurrentRoundData(null);

    const result = executeBattle(monster1, monster2);
    setBattleResult(result);

    let tempMonster1Hp = monster1.hp;
    let tempMonster2Hp = monster2.hp;

    for (let i = 0; i < result.rounds.length; i++) {
      const round = result.rounds[i];
      setCurrentRoundData(round);

      setAttackingMonster(round.attacker.id);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAttackingMonster(null);

      if (!round.isDodged) {
        if (round.defender.id === monster1.id) {
          tempMonster1Hp = round.defenderHpAfter;
          setMonster1CurrentHp(tempMonster1Hp);
        } else {
          tempMonster2Hp = round.defenderHpAfter;
          setMonster2CurrentHp(tempMonster2Hp);
        }
      }

      setCurrentRound(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (round.defenderHpAfter === 0) {
        break;
      }
    }

    setBattleFinished(true);
    setCurrentRoundData(null);
    setIsAnimating(false);
    onBattleComplete?.(result);
  };

  const handleReset = () => {
    setBattleResult(null);
    setCurrentRound(0);
    setIsAnimating(false);
    setAttackingMonster(null);
    setMonster1CurrentHp(monster1.hp);
    setMonster2CurrentHp(monster2.hp);
    setBattleFinished(false);
    setCurrentRoundData(null);
    onReset?.();
  };

  const getMonsterCurrentHp = (monsterId: string) => {
    return monsterId === monster1.id ? monster1CurrentHp : monster2CurrentHp;
  };

  const renderBattleMonsterCard = (
    monster: Monster,
    isWinner?: boolean,
    isAttacking?: boolean,
    isRightCard?: boolean
  ) => (
    <Card
      elevation={isWinner && battleFinished ? 8 : 3}
      sx={{
        border: isWinner && battleFinished ? "3px solid gold" : "none",
        position: "relative",
        overflow: "visible",
        transition: "all 0.5s ease",
        transform:
          isWinner && battleFinished
            ? "scale(1.05)"
            : isAttacking
            ? isRightCard
              ? "translateX(-20px) rotate(-5deg) scale(1.1)"
              : "translateX(20px) rotate(5deg) scale(1.1)"
            : "scale(1)",
        animation: isAttacking
          ? isRightCard
            ? "attackPulseRight 0.8s ease-in-out"
            : "attackPulseLeft 0.8s ease-in-out"
          : "none",
        "@keyframes attackPulseLeft": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
          "50%": {
            transform: "scale(1.1) rotate(5deg) translateX(20px)",
            boxShadow: "0 8px 24px rgba(255,0,0,0.3)",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
        "@keyframes attackPulseRight": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
          "50%": {
            transform: "scale(1.1) rotate(-5deg) translateX(-20px)",
            boxShadow: "0 8px 24px rgba(255,0,0,0.3)",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <Box sx={{ position: "relative", pt: { xs: 3, sm: 4 } }}>
        {isWinner && battleFinished && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 12 },
              right: { xs: 8, sm: 12 },
              zIndex: 10,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          >
            <Chip
              icon={<EmojiEvents />}
              label="VENCEDOR"
              color="warning"
              size="medium"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.7rem", sm: "0.9rem" },
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
          </Box>
        )}

        <CardMedia
          component="img"
          image={monster.image_url}
          alt={monster.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/240x360/cccccc/666666?text=Monster";
          }}
          sx={{
            width: "100%",
            height: { xs: "140px", sm: "180px", md: "240px" },
            objectFit: "contain",
            objectPosition: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px 8px 0 0",
            filter: isWinner
              ? "none"
              : getMonsterCurrentHp(monster.id) === 0 && battleFinished
              ? "grayscale(100%)"
              : "none",
          }}
        />
      </Box>

      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: "0.85rem", sm: "1.1rem" },
              flexGrow: 1,
              mb: 0,
            }}
          >
            {monster.name}
            {isAttacking && (
              <Chip
                label="ATK!"
                color="error"
                size="small"
                sx={{
                  ml: 0.5,
                  animation: "blink 0.5s infinite",
                  fontSize: { xs: "0.5rem", sm: "0.65rem" },
                }}
              />
            )}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.25, flexWrap: "wrap" }}>
            {currentRoundData &&
              currentRoundData.attacker.id === monster.id &&
              currentRoundData.isCritical && (
                <Chip
                  label="CRIT!"
                  color="warning"
                  size="small"
                  sx={{
                    animation: "flash 0.8s ease-in-out",
                    fontSize: { xs: "0.5rem", sm: "0.65rem" },
                  }}
                />
              )}
            {currentRoundData &&
              currentRoundData.defender.id === monster.id &&
              currentRoundData.isDodged && (
                <Chip
                  label="ESQ!"
                  color="info"
                  size="small"
                  icon={
                    <Shield sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }} />
                  }
                  sx={{
                    animation: "flash 0.8s ease-in-out",
                    fontSize: { xs: "0.5rem", sm: "0.65rem" },
                  }}
                />
              )}
          </Box>
        </Box>

        {/* Barra de HP separada na arena */}
        <Box sx={{ mb: { xs: 1, sm: 2 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.6rem", sm: "0.7rem" },
              }}
            >
              HP
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.7rem", sm: "0.9rem" },
              }}
            >
              {getMonsterCurrentHp(monster.id)}/{monster.hp}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(getMonsterCurrentHp(monster.id) / monster.hp) * 100}
            color={
              getMonsterCurrentHp(monster.id) > monster.hp * 0.5
                ? "success"
                : getMonsterCurrentHp(monster.id) > monster.hp * 0.2
                ? "warning"
                : "error"
            }
            sx={{
              height: { xs: 4, sm: 6 },
              borderRadius: 3,
              backgroundColor: "rgba(0,0,0,0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                transition: "transform 0.8s ease",
              },
            }}
          />
        </Box>

        {/* Atributos em linha horizontal */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Bolt
              sx={{ color: "red", fontSize: { xs: "1rem", sm: "1.2rem" } }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: { xs: "0.5rem", sm: "0.6rem" },
                  lineHeight: 1,
                }}
              >
                ATK
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.9rem" },
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {monster.attack}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Security
              sx={{ color: "blue", fontSize: { xs: "1rem", sm: "1.2rem" } }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: { xs: "0.5rem", sm: "0.6rem" },
                  lineHeight: 1,
                }}
              >
                DEF
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.9rem" },
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {monster.defense}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Speed
              sx={{ color: "green", fontSize: { xs: "1rem", sm: "1.2rem" } }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: { xs: "0.5rem", sm: "0.6rem" },
                  lineHeight: 1,
                }}
              >
                SPD
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.9rem" },
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {monster.speed}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderBattleHistory = () => {
    if (!battleResult || currentRound === 0) return null;

    const visibleRounds = battleResult.rounds.slice(0, currentRound);

    return (
      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          ⚔️ Histórico da Batalha - Round {currentRound}/
          {battleResult.totalRounds}
        </Typography>
        <Paper
          elevation={2}
          sx={{
            maxHeight: { xs: 150, sm: 200 },
            overflow: "auto",
            p: { xs: 1, sm: 2 },
            bgcolor: "grey.50",
          }}
        >
          {visibleRounds.map((round, index) => (
            <Alert
              key={index}
              severity={
                round.isDodged
                  ? "info"
                  : round.isCritical
                  ? "warning"
                  : round.damage > 15
                  ? "error"
                  : "success"
              }
              sx={{ mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                <strong>Round {round.roundNumber}:</strong>{" "}
                {round.attacker.name} atacou {round.defender.name}
                {round.isDodged ? (
                  <>
                    {" "}
                    mas <strong>ESQUIVOU!</strong> 🛡️
                  </>
                ) : (
                  <>
                    {round.isCritical && (
                      <>
                        {" "}
                        com <strong>CRÍTICO!</strong> ⚡
                      </>
                    )}
                    {" causando "}
                    <strong>{round.damage} de dano</strong>
                    {round.isCritical && ` (base: ${round.originalDamage})`}
                  </>
                )}
                {round.defenderHpAfter === 0 && " 💀 NOCAUTE!"}
              </Typography>
            </Alert>
          ))}
        </Paper>
      </Box>
    );
  };

  return (
    <Box>
      <Fade in={true}>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 3 },
            bgcolor: "grey.900",
            color: "white",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            ⚔️ ARENA DE BATALHA
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="grey.300"
            sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}
          >
            {monster1.name} VS {monster2.name}
          </Typography>
        </Paper>
      </Fade>

      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 4 }}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Grid size={{ xs: 6, md: 6 }}>
          <Zoom in={true}>
            {renderBattleMonsterCard(
              monster1,
              battleResult?.winner.id === monster1.id,
              attackingMonster === monster1.id,
              false
            )}
          </Zoom>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Zoom in={true} style={{ transitionDelay: "200ms" }}>
            {renderBattleMonsterCard(
              monster2,
              battleResult?.winner.id === monster2.id,
              attackingMonster === monster2.id,
              true
            )}
          </Zoom>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3 },
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleInstantBattle}
          disabled={isAnimating}
          startIcon={<Bolt />}
          size={window.innerWidth < 600 ? "small" : "medium"}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Batalha Instantânea
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAnimatedBattle}
          disabled={isAnimating}
          startIcon={<PlayArrow />}
          size={window.innerWidth < 600 ? "small" : "medium"}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {isAnimating ? "Batalha em andamento..." : "Batalha Animada"}
        </Button>
        <Button
          variant="text"
          onClick={handleReset}
          startIcon={<Refresh />}
          size={window.innerWidth < 600 ? "small" : "medium"}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Nova Batalha
        </Button>
      </Box>

      <Divider sx={{ my: { xs: 2, sm: 3 } }} />

      {battleResult && battleFinished && (
        <Fade in={true}>
          <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              🏆 {battleResult.winner.name} venceu a batalha!
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Batalha durou {battleResult.totalRounds} rounds •{" "}
              {battleResult.loser.name} foi derrotado
            </Typography>
          </Alert>
        </Fade>
      )}

      {renderBattleHistory()}
    </Box>
  );
};

export default BattleArena;
