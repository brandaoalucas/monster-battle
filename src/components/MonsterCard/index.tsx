import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import {
  Speed,
  Favorite,
  DeleteOutline,
  Bolt,
  Shield,
} from "@mui/icons-material";
import { Monster } from "../../types";

interface MonsterCardProps {
  monster: Monster;
  onSelectForBattle?: (monster: Monster) => void;
  onDelete?: (monsterId: string) => void;
  isSelected?: boolean;
  showBattleButton?: boolean;
}

const MonsterCard: React.FC<MonsterCardProps> = React.memo(
  ({ monster, onSelectForBattle, onDelete, isSelected = false }) => {
    const powerRating = useMemo(() => {
      return Math.round(
        (monster.attack + monster.defense + monster.speed + monster.hp) / 4
      );
    }, [monster.attack, monster.defense, monster.speed, monster.hp]);

    const ratingColor = useMemo(() => {
      if (powerRating >= 50) return "error";
      if (powerRating >= 40) return "warning";
      if (powerRating >= 30) return "info";
      return "success";
    }, [powerRating]);

    const cardSx = useMemo(
      () => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: onSelectForBattle ? "pointer" : "default",
        transition: "all 0.3s ease",
        border: isSelected ? "3px solid #1976d2" : "1px solid #e0e0e0",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: isSelected ? 8 : 4,
        },
      }),
      [isSelected, onSelectForBattle]
    );

    const handleCardClick = useMemo(
      () => () => {
        if (onSelectForBattle) {
          onSelectForBattle(monster);
        }
      },
      [onSelectForBattle, monster]
    );

    const handleDeleteClick = useMemo(
      () => (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
          onDelete(monster.id);
        }
      },
      [onDelete, monster.id]
    );

    return (
      <Card
        elevation={isSelected ? 8 : 3}
        onClick={handleCardClick}
        sx={cardSx}
      >
        <Box sx={{ position: "relative", pt: { xs: 2.5, sm: 3 } }}>
          {isSelected && (
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
                label="SELECIONADO"
                color="primary"
                size="small"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.5rem", sm: "0.65rem" },
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

          {onDelete && (
            <Box
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 12 },
                left: { xs: 8, sm: 12 },
                zIndex: 10,
              }}
            >
              <IconButton
                onClick={handleDeleteClick}
                size="small"
                sx={{
                  bgcolor: "rgba(244, 67, 54, 0.9)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "error.main",
                    transform: "scale(1.1)",
                  },
                  width: { xs: 24, sm: 28 },
                  height: { xs: 24, sm: 28 },
                }}
              >
                <DeleteOutline
                  sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                />
              </IconButton>
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
              height: { xs: "160px", sm: "200px", md: "240px" },
              objectFit: "contain",
              objectPosition: "center",
              backgroundColor: "#f5f5f5",
            }}
          />
        </Box>

        <CardContent
          sx={{ flexGrow: 1, p: { xs: 1, sm: 1.5 }, pt: { xs: 0.5, sm: 1 } }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.8rem", sm: "1rem" },
                flexGrow: 1,
                mr: 1,
              }}
            >
              {monster.name}
            </Typography>
            <Chip
              label={`⭐ ${powerRating}`}
              color={ratingColor}
              size="small"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.55rem", sm: "0.65rem" },
              }}
            />
          </Box>

          {/* Atributos em linha horizontal única */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Favorite
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
                  HP
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.9rem" },
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  {monster.hp}
                </Typography>
              </Box>
            </Box>

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
              <Shield
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
  }
);

export default MonsterCard;
