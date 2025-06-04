import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import { Monster } from "../../types";
import { v4 as uuidv4 } from "uuid";

interface MonsterFormProps {
  onMonsterCreate: (monster: Monster) => void;
}

const MonsterForm: React.FC<MonsterFormProps> = ({ onMonsterCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    attack: "",
    defense: "",
    speed: "",
    hp: "",
    image_url: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    const attack = parseInt(formData.attack);
    if (!formData.attack || isNaN(attack) || attack < 1 || attack > 100) {
      newErrors.attack = "Ataque deve ser um número entre 1 e 100";
    }

    const defense = parseInt(formData.defense);
    if (!formData.defense || isNaN(defense) || defense < 1 || defense > 100) {
      newErrors.defense = "Defesa deve ser um número entre 1 e 100";
    }

    const speed = parseInt(formData.speed);
    if (!formData.speed || isNaN(speed) || speed < 1 || speed > 100) {
      newErrors.speed = "Velocidade deve ser um número entre 1 e 100";
    }

    const hp = parseInt(formData.hp);
    if (!formData.hp || isNaN(hp) || hp < 1 || hp > 200) {
      newErrors.hp = "HP deve ser um número entre 1 e 200";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  const handleReset = () => {
    setFormData({
      name: "",
      attack: "",
      defense: "",
      speed: "",
      hp: "",
      image_url: "",
    });
    setErrors({});
  };

  const calculateTotal = () => {
    const attack = parseInt(formData.attack) || 0;
    const defense = parseInt(formData.defense) || 0;
    const speed = parseInt(formData.speed) || 0;
    const hp = parseInt(formData.hp) || 0;
    return attack + defense + speed + hp;
  };

  const getTotalColor = () => {
    const total = calculateTotal();
    if (total >= 300) return "error";
    if (total >= 250) return "warning";
    if (total >= 200) return "info";
    return "success";
  };

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
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="URL da Imagem (opcional)"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              size={window.innerWidth < 600 ? "small" : "medium"}
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
              inputProps={{ min: 1, max: 100 }}
              size={window.innerWidth < 600 ? "small" : "medium"}
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
              inputProps={{ min: 1, max: 100 }}
              size={window.innerWidth < 600 ? "small" : "medium"}
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
              inputProps={{ min: 1, max: 100 }}
              size={window.innerWidth < 600 ? "small" : "medium"}
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
              inputProps={{ min: 1, max: 200 }}
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: { xs: 1, sm: 2 } }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Poder Total:
                </Typography>
                <Chip
                  label={calculateTotal()}
                  color={getTotalColor()}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                >
                  (Recomendado: 200-280)
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 2 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<Refresh />}
                  size={window.innerWidth < 600 ? "small" : "medium"}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  size={window.innerWidth < 600 ? "small" : "medium"}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    fontWeight: "bold",
                  }}
                >
                  Criar Monstro
                </Button>
              </Box>
            </Box>
          </Grid>

          {Object.keys(errors).length > 0 && (
            <Grid size={12}>
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Por favor, corrija os erros antes de continuar.
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default MonsterForm;
