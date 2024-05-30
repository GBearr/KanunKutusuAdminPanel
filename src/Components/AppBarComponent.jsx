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
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import postService from "../services/PostService";
import userService from "../services/UserService";

const AppBarComponent = ({
  user,
  handleOpenUserMenu,
  handleCloseUserMenu,
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
      navigate(`/profiledetail/${result.id}`);
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
            KANUN KUTUSU ADMİN PANEL
          </Typography>

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
            KANUN
          </Typography>

          <Box>
            <ClickAwayListener onClickAway={handleClickAway}>
              <div>
                <TextField
                  value={searchQuery}
                  onChange={handleSearchChange}
                  variant="outlined"
                  placeholder="Arama"
                  size="small"
                  sx={{
                    ml: { xs: 0, sm: 15 },
                    mr: 2,
                    backgroundColor: "white",
                    ":hover": "none",
                    border: "none",
                    borderRadius: "16px",
                  }}
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
                  <IconButton sx={{ p: 0 }}>
                    <Avatar
                      sx={{ margin: "auto" }}
                      src={user.profile_image_url}
                    />
                  </IconButton>
                  <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                    {user.first_name + " " + user.last_name}
                  </Typography>
                </Stack>
              </Tooltip>
            ) : null}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarComponent;
