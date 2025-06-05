// src/App.tsx
import React, { useState, useEffect, useCallback, useMemo, lazy } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import { Monster, BattleResult } from "./types";
import MonsterForm from "./components/MonsterForm";
import MonsterCard from "./components/MonsterCard";
import { getInitialMonsters } from "./data/sampleMonsters";

const BattleArena = lazy(() => import("./components/BattleArena"));

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    h1: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      "@media (min-width:600px)": {
        fontSize: "2.2rem",
      },
      "@media (min-width:900px)": {
        fontSize: "2.5rem",
      },
    },
    h4: {
      fontSize: "1.2rem",
      "@media (min-width:600px)": {
        fontSize: "1.5rem",
      },
      "@media (min-width:900px)": {
        fontSize: "2rem",
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          "@media (min-width:600px)": {
            paddingLeft: "24px",
            paddingRight: "24px",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(220, 0, 78, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(220, 0, 78, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(220, 0, 78, 0);
          }
        }
      `,
    },
  },
});

const EMPTY_MONSTER_ARRAY: Monster[] = [];
const EMPTY_BATTLE_ARRAY: BattleResult[] = [];

const App: React.FC = () => {
  const [monsters, setMonsters] = useState<Monster[]>(EMPTY_MONSTER_ARRAY);
  const [selectedMonsters, setSelectedMonsters] =
    useState<Monster[]>(EMPTY_MONSTER_ARRAY);
  const [showBattleArena, setShowBattleArena] = useState(false);
  const [battleHistory, setBattleHistory] =
    useState<BattleResult[]>(EMPTY_BATTLE_ARRAY);

  const hasMonsters = monsters.length > 0;
  const hasNoBattleHistory = battleHistory.length === 0;
  const showBattle = showBattleArena && selectedMonsters.length === 2;

  useEffect(() => {
    setShowBattleArena(selectedMonsters.length === 2);
  }, [selectedMonsters.length]);

  const handleMonsterCreate = useCallback((monster: Monster) => {
    setMonsters((prev) => [...prev, monster]);
  }, []);

  const handleSelectMonster = useCallback((monster: Monster) => {
    setSelectedMonsters((prev) => {
      const existingIndex = prev.findIndex((m) => m.id === monster.id);
      if (existingIndex !== -1) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      return prev.length >= 2 ? [prev[1], monster] : [...prev, monster];
    });
  }, []);

  const handleDeleteMonster = useCallback((monsterId: string) => {
    setMonsters((prev) => prev.filter((m) => m.id !== monsterId));
    setSelectedMonsters((prev) => prev.filter((m) => m.id !== monsterId));
  }, []);

  const handleLoadSampleMonsters = useCallback(() => {
    const sampleMonsters = getInitialMonsters();
    setMonsters((prev) => [...prev, ...sampleMonsters]);
  }, []);

  const handleBattleComplete = useCallback((result: BattleResult) => {
    setBattleHistory((prev) => [...prev, result]);
  }, []);

  const handleBattleReset = useCallback(() => {
    setShowBattleArena(false);
    setSelectedMonsters(EMPTY_MONSTER_ARRAY);
  }, []);

  const selectedMonsterIds = useMemo(
    () => new Set(selectedMonsters.map((m) => m.id)),
    [selectedMonsters]
  );

  const recentBattleHistory = useMemo(
    () => battleHistory.slice(-5).reverse(),
    [battleHistory]
  );

  const headerSx = useMemo(
    () => ({
      p: { xs: 2, sm: 3 },
      mb: { xs: 3, sm: 4 },
      textAlign: "center",
      bgcolor: "primary.main",
      color: "white",
    }),
    []
  );

  const renderHeader = useMemo(
    () => (
      <Paper elevation={3} sx={headerSx}>
        <Typography variant="h1" gutterBottom>
          ⚔️ Monster Battle Arena
        </Typography>
      </Paper>
    ),
    [headerSx]
  );

  const renderMonsterForm = useMemo(
    () => (
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom>
          📝 Cadastrar Monstro
        </Typography>
        <MonsterForm onMonsterCreate={handleMonsterCreate} />
      </Box>
    ),
    [handleMonsterCreate]
  );

  const renderLoadSampleButton = useMemo(
    () => (
      <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
        <Button
          variant="outlined"
          onClick={handleLoadSampleMonsters}
          size="large"
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "200px" },
          }}
        >
          🎲 Carregar Exemplos
        </Button>
      </Box>
    ),
    [handleLoadSampleMonsters]
  );

  const renderEmptyState = useMemo(
    () => (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          textAlign: "center",
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          📭 Nenhum monstro cadastrado ainda
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Crie seu primeiro monstro usando o formulário acima ou carregue alguns
          exemplos!
        </Typography>
      </Paper>
    ),
    []
  );

  const scrollSx = useMemo(
    () => ({
      overflowX: "auto",
      overflowY: "visible",
      pb: 2,
      pt: 1,
      pl: 0.5,
      "&::-webkit-scrollbar": {
        height: 6,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#f1f1f1",
        borderRadius: 3,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c1c1c1",
        borderRadius: 3,
      },
    }),
    []
  );

  const renderMobileMonsterList = useMemo(
    () => (
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          width: "100%",
          mb: 3,
          overflow: "visible",
        }}
      >
        <Box sx={scrollSx}>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              width: "max-content",
            }}
          >
            {monsters.map((monster) => (
              <Box
                key={monster.id}
                sx={{
                  width: { xs: "calc(50vw - 24px)", sm: "160px" },
                  flexShrink: 0,
                }}
              >
                <MonsterCard
                  monster={monster}
                  onSelectForBattle={handleSelectMonster}
                  onDelete={handleDeleteMonster}
                  isSelected={selectedMonsterIds.has(monster.id)}
                  showBattleButton={true}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    ),
    [
      monsters,
      handleSelectMonster,
      handleDeleteMonster,
      selectedMonsterIds,
      scrollSx,
    ]
  );

  const renderDesktopMonsterGrid = useMemo(
    () => (
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {monsters.map((monster) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={monster.id}>
              <MonsterCard
                monster={monster}
                onSelectForBattle={handleSelectMonster}
                onDelete={handleDeleteMonster}
                isSelected={selectedMonsterIds.has(monster.id)}
                showBattleButton={true}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
    [monsters, handleSelectMonster, handleDeleteMonster, selectedMonsterIds]
  );

  const renderBattleHistory = useMemo(() => {
    if (hasNoBattleHistory) return null;

    return (
      <Box sx={{ mt: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          🏆 Histórico de Batalhas
        </Typography>
        <Grid container spacing={2}>
          {recentBattleHistory.map((battle, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Batalha #{battleHistory.length - index}
                </Typography>
                <Typography variant="body2" color="success.main">
                  🏆 Vencedor: {battle.winner.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🥈 Derrotado: {battle.loser.name}
                </Typography>
                <Typography variant="caption" display="block">
                  ⚔️ {battle.totalRounds} rounds
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }, [recentBattleHistory, battleHistory.length, hasNoBattleHistory]);

  const renderMainContent = useMemo(() => {
    if (showBattle) {
      return (
        <BattleArena
          monster1={selectedMonsters[0]}
          monster2={selectedMonsters[1]}
          onBattleComplete={handleBattleComplete}
          onReset={handleBattleReset}
        />
      );
    }

    return (
      <>
        {renderMonsterForm}
        {!hasMonsters && renderLoadSampleButton}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            pt: { xs: 2, sm: 3 },
            mt: { xs: 2, sm: 3 },
          }}
        >
          {!hasMonsters ? (
            renderEmptyState
          ) : (
            <>
              {renderMobileMonsterList}
              {renderDesktopMonsterGrid}
            </>
          )}
        </Box>
        {renderBattleHistory}
      </>
    );
  }, [
    showBattle,
    selectedMonsters,
    handleBattleComplete,
    handleBattleReset,
    renderMonsterForm,
    hasMonsters,
    renderLoadSampleButton,
    renderEmptyState,
    renderMobileMonsterList,
    renderDesktopMonsterGrid,
    renderBattleHistory,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {renderHeader}
          <Box>{renderMainContent}</Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default React.memo(App);
