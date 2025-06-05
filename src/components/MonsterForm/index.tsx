import React, { useState, useCallback, useMemo } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import { Monster } from "../../types";
import { v4 as uuidv4 } from "uuid";

interface MonsterFormProps {
  onMonsterCreate: (monster: Monster) => void;
}

const MonsterForm: React.FC<MonsterFormProps> = React.memo(
  ({ onMonsterCreate }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [formData, setFormData] = useState({
      name: "",
      attack: "",
      defense: "",
      speed: "",
      hp: "",
      image_url: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = useCallback(
      (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      },
      [errors]
    );

    const validateForm = useCallback(() => {
      const newErrors: { [key: string]: string } = {};

      if (!formData.name.trim()) {
        newErrors.name = "Nome é obrigatório";
      }

      const attack = parseInt(formData.attack);
      if (!formData.attack || isNaN(attack) || attack < 1) {
        newErrors.attack = "Ataque deve ser um número positivo";
      }

      const defense = parseInt(formData.defense);
      if (!formData.defense || isNaN(defense) || defense < 1) {
        newErrors.defense = "Defesa deve ser um número positivo";
      }

      const speed = parseInt(formData.speed);
      if (!formData.speed || isNaN(speed) || speed < 1) {
        newErrors.speed = "Velocidade deve ser um número positivo";
      }

      const hp = parseInt(formData.hp);
      if (!formData.hp || isNaN(hp) || hp < 1) {
        newErrors.hp = "HP deve ser um número positivo";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleReset = useCallback(() => {
      setFormData({
        name: "",
        attack: "",
        defense: "",
        speed: "",
        hp: "",
        image_url: "",
      });
      setErrors({});
    }, []);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const newMonster: Monster = {
          id: uuidv4(),
          name: formData.name.trim(),
          attack: parseInt(formData.attack),
          defense: parseInt(formData.defense),
          speed: parseInt(formData.speed),
          hp: parseInt(formData.hp),
          image_url:
            formData.image_url.trim() ||
            `https://via.placeholder.com/320x480/6366f1/ffffff?text=${encodeURIComponent(
              formData.name
            )}`,
        };

        onMonsterCreate(newMonster);
        handleReset();
      },
      [formData, validateForm, onMonsterCreate, handleReset]
    );

    const calculatedTotal = useMemo(() => {
      const attack = parseInt(formData.attack) || 0;
      const defense = parseInt(formData.defense) || 0;
      const speed = parseInt(formData.speed) || 0;
      const hp = parseInt(formData.hp) || 0;
      return attack + defense + speed + hp;
    }, [formData.attack, formData.defense, formData.speed, formData.hp]);

    const fieldSize = isMobile ? "small" : "medium";

    return (
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 } }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nome do Monstro"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Ex: Dragão Flamejante"
                size={fieldSize}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="URL da Imagem (opcional)"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                size={fieldSize}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                label="Ataque"
                type="number"
                value={formData.attack}
                onChange={(e) => handleInputChange("attack", e.target.value)}
                error={!!errors.attack}
                helperText={errors.attack}
                slotProps={{
                  input: {
                    inputProps: {
                      min: 1,
                    },
                  },
                }}
                size={fieldSize}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                label="Defesa"
                type="number"
                value={formData.defense}
                onChange={(e) => handleInputChange("defense", e.target.value)}
                error={!!errors.defense}
                helperText={errors.defense}
                slotProps={{
                  input: {
                    inputProps: {
                      min: 1,
                    },
                  },
                }}
                size={fieldSize}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                label="Velocidade"
                type="number"
                value={formData.speed}
                onChange={(e) => handleInputChange("speed", e.target.value)}
                error={!!errors.speed}
                helperText={errors.speed}
                slotProps={{
                  input: {
                    inputProps: {
                      min: 1,
                    },
                  },
                }}
                size={fieldSize}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                label="HP"
                type="number"
                value={formData.hp}
                onChange={(e) => handleInputChange("hp", e.target.value)}
                error={!!errors.hp}
                helperText={errors.hp}
                slotProps={{
                  input: {
                    inputProps: {
                      min: 1,
                    },
                  },
                }}
                size={fieldSize}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total de Atributos:
                </Typography>
                <Chip
                  label={calculatedTotal}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, sm: 2 },
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<Refresh />}
                  size={isMobile ? "small" : "medium"}
                  fullWidth={isMobile}
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  size={isMobile ? "small" : "medium"}
                  fullWidth={isMobile}
                >
                  Criar Monstro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    );
  }
);

export default MonsterForm;
