"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

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

import { Home, Settings, BookOpen, Menu as MenuIcon } from "lucide-react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function Menu1() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  const user = {
    name: "Bruno Lobo",
    email: "bruno@email.com",
    avatarUrl: "",
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const userInitial = user.email ? user.email[0].toUpperCase() : "?";

  const menuItems = [
    { text: "Início", icon: Home, href: "/" },
    { text: "Cursos", icon: BookOpen, href: "/tela-inicial" },
    { text: "Configurações", icon: Settings, href: "/configuracoes" },
  ];

  const DrawerList = (
    <Box
      sx={{
        width: 260,
        height: "100%",
        bgcolor: "#7c7c7e",
        color: "#fff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          p: 1,
        }}
      >
        <IconButton onClick={toggleDrawer(false)}>
          <ChevronLeftIcon className="text-white" />
        </IconButton>
      </Box>

      {/* Perfil */}
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
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.2)" }} />

      {/* Lista dinâmica */}
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (pathname === item.href) {
                    router.refresh();
                  } else {
                    router.push(item.href);
                  }
                  setOpen(false);
                }}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <ListItemIcon>
                  <Icon
                    className={
                      isActive ? "text-blue-900" : "text-white"
                    }
                  />
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Menu do perfil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Meu Perfil</MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            alert("Sair da conta...");
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
        <MenuIcon />
      </Button>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}