"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { HomeIcon, Menu as MenuIcon, Settings } from "lucide-react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function Menu1() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // --- Simulação de usuário logado ---
  const user = {
    name: "Bruno Lobo",
    email: "bruno@email.com",
    avatarUrl: "", // se vazio, vai mostrar a inicial do email
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // --- Controle do menu do perfil ---
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // --- Inicial do usuário (quando não tiver foto) ---
  const userInitial = user.email ? user.email[0].toUpperCase() : "?";

  const DrawerList = (
    <Box sx={{ width: 250, height: "100%", bgcolor: "#7c7c7e", color: "#fff"  }}>
      {/* --- Cabeçalho com seta --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          p: 1,
        }}
      >
        <IconButton onClick={toggleDrawer(false)}>
          <ChevronLeftIcon className="text-white"/>
        </IconButton>
      </Box>

      {/* --- Perfil --- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          gap: 2,
          px: 2,
          cursor: "pointer",
        }}
        onClick={handleAvatarClick}
      >
        <Avatar src={user.avatarUrl || undefined}>
          {!user.avatarUrl && userInitial}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text-white">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* --- Lista --- */}
      <List>
        {["Início", "Configurações"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon >
                {index % 2 === 0 ? <HomeIcon /> : <Settings />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* --- Menu do perfil --- */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Meu Perfil</MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            alert("Sair da conta..."); // aqui você coloca o logout real
          }}
        >
          Sair
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <div className="flex-1 px-10 py-10">
      <Button onClick={toggleDrawer(true)} color="inherit">
        <MenuIcon suppressHydrationWarning />
      </Button>
      <Drawer
        open={open}
        onClose={() => {}} // Desabilita fechar clicando fora
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
