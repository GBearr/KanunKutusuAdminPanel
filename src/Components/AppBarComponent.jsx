import React, { useCallback, useState, useEffect, useRef } from "react";
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
  Stack,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import postService from "../services/PostService";
import userService from "../services/UserService";

const AppBarComponent = ({
  user,
  pages,
  settings,
  handleOpenNavMenu,
  handleCloseNavMenu,
  handleOpenUserMenu,
  handleCloseUserMenu,
  anchorElNav,
  anchorElUser,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleSearchChange = useCallback(
    (event) => {
      const query = event.target.value.length > 2 ? event.target.value : null;
      setSearchQuery(query);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (query && query.trim() !== "") {
          const postResults = await postService.searchPosts(user.id, query);
          const userResults = await userService.searchUsers(query);
          const combinedResults = [
            ...postResults.map((item) => ({ ...item, type: "post" })),
            ...userResults.map((item) => ({ ...item, type: "user" })),
          ];
          setSearchResults(combinedResults);
          setOpen(true);
        } else {
          setSearchResults([]);
          setOpen(false);
        }
      }, 1000);
    },
    [user]
  );

  const handleResultClick = (result) => {
    if (result.type === "post") {
      navigate(`/carddetail/${result.id}`, {
        state: {
          post: result,
        },
      });
    } else if (result.type === "user") {
      navigate(`/userdetail/${result.id}`);
    }
    setOpen(false);
    setSearchQuery("");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon
            onClick={handleLogoClick}
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              cursor: "pointer",
            }}
          />
          <Typography
            onClick={handleLogoClick}
            variant="h6"
            noWrap
            component="a"
            sx={{
              cursor: "pointer",
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
            href="#"
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

          <Box sx={{ flexGrow: 0, position: "relative" }}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <div>
                <TextField
                  value={searchQuery}
                  onChange={handleSearchChange}
                  variant="outlined"
                  placeholder="Arama"
                  size="small"
                  sx={{ mr: 2 }}
                  ref={searchRef}
                />
                {open && (
                  <Popper
                    open={open}
                    anchorEl={searchRef.current}
                    placement="bottom-start"
                    style={{ zIndex: 1200 }}
                  >
                    <Paper>
                      <List>
                        {searchResults.map((result, index) => (
                          <ListItem
                            button
                            key={index}
                            onClick={() => handleResultClick(result)}
                          >
                            <Avatar src={result.profileImageUrl} />
                            <ListItemText
                              sx={{ ml: 1 }}
                              primary={
                                result.type === "post"
                                  ? result.title
                                  : result.firstName + " " + result.lastName
                              }
                              secondary={
                                result.type === "post" ? "Post" : "User"
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Popper>
                )}
              </div>
            </ClickAwayListener>
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
  );
};

export default AppBarComponent;
