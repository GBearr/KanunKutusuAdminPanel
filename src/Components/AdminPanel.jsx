import React, { useState, useEffect, useRef } from "react";
import { postService } from "../services/PostService";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Tab,
  Grid,
  CircularProgress,
  Stack,
} from "@mui/material";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import { ProposalCard } from "./ProposalCard";

const AdminPanel = () => {
  const [proposals, setProposals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const pages = ["Products", "Pricing", "Blog"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];

  const observer = useRef();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        let data;
        if (tabValue === 0) {
          data = await postService.getPendingPosts(page, user.id);
          console.log("Tab value:1");
        } else if (tabValue === 1) {
          data = await postService.getApprovedPosts(page, user.id);
          console.log("Tab value:2");
        } else {
          data = await postService.getRejectedPosts(page, user.id);
          console.log("Tab value:3");
        }
        if (data && Array.isArray(data)) {
          setProposals((prevProposals) => [...prevProposals, ...data]);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Beklenmeyen veri yapısı");
        }
      } catch (error) {
        console.error("Veri getirme hatası:", error);
        setHasMore(false); // Hata durumunda daha fazla veri olmadığını varsayın
      }
      setLoading(false);
    };

    if (user) {
      fetchProposals();
    }
  }, [tabValue, page, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Sekme değiştirildiğinde sayfayı sıfırla
    setProposals([]); // Sekme değiştirildiğinde mevcut veriyi temizle
  };

  const lastProposalElementRef = useRef();

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (lastProposalElementRef.current) {
      observer.current.observe(lastProposalElementRef.current);
    }
  }, [loading, hasMore]);
  console.log(user);
  return (
    <Container>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              KANUN KUTUSU
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              KANUN KUTUSU
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {user ? (
                <Tooltip title="Open settings">
                  <Stack
                    spacing={2}
                    direction={"row"}
                    sx={{ alignItems: "center" }}
                  >
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar src={user.profile_image_url} />
                    </IconButton>
                    <Typography>
                      {user.first_name + " " + user.last_name}
                    </Typography>
                  </Stack>
                </Tooltip>
              ) : null}
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Bekleyen Postlar" />
            <Tab label="Onaylanan Postlar" />
            <Tab label="Reddedilen Postlar" />
          </TabList>
        </Box>
      </TabContext>
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Grid container direction="column" alignItems="center" spacing={4}>
              {proposals.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  key={index}
                  sx={{ minWidth: "100%" }}
                  ref={
                    proposals.length === index + 1
                      ? lastProposalElementRef
                      : null
                  }
                >
                  <ProposalCard post={item} />
                </Grid>
              ))}
            </Grid>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default AdminPanel;
