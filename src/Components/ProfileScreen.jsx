import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
  Grid,
  Container,
} from "@mui/material";
import { userService } from "../services/UserService";
import { postService } from "../services/PostService";
import { ProposalCard } from "./ProposalCard";

export const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [postOfUser, setPostOfUser] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUser = await userService.getUsers(id);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Kullanıcı çekme hatası:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        let fetchedPosts;
        switch (tabValue) {
          case 0:
            fetchedPosts = await postService.getPostsOfUser(1, id, 28);
            break;
          case 1:
            fetchedPosts = await postService.getPendingPostsOfUser(1, id, 28);
            break;
          case 2:
            fetchedPosts = await postService.getApprovedPostsOfUser(1, id, 28);
            break;
          case 3:
            fetchedPosts = await postService.getRejectedPostsOfUser(1, id, 28);
            break;
          default:
            fetchedPosts = [];
        }
        setPostOfUser(fetchedPosts);
      } catch (error) {
        console.error("Post çekme hatası:", error);
      }
    };

    fetchUsers();
    fetchPosts();
  }, [id, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Stack>
      <Card sx={{ display: "flex" }}>
        {user.profileImageUrl ? (
          <CardMedia
            component="img"
            sx={{
              backgroundPosition: "center",
              width: "40%",
            }}
            image={user.profileImageUrl}
          />
        ) : null}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {user.firstName + " " + user.lastName}
            </Typography>
            <Typography variant="h6" color="text.secondary" component="div">
              {user.username}
            </Typography>
            <Typography variant="h6" color="text.secondary" component="div">
              {user.emailAddress}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Box sx={{ border: "none", borderColor: "divider", mt: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Paylaşılan Öneriler " />
          <Tab label="Bekleyen Öneriler" />
          <Tab label="Onaylanan Öneriler" />
          <Tab label="Reddedilen Önderiler" />
        </Tabs>
      </Box>
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12}>
            <Grid container direction="column" alignItems="center" spacing={4}>
              {postOfUser.map((item) => (
                <Grid item xs={12} key={item.id} sx={{ minWidth: "100%" }}>
                  <ProposalCard post={item} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};
