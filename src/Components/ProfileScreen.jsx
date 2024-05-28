import React, { useEffect, useState, useRef } from "react";
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
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import userService from "../services/UserService";
import postService from "../services/PostService";
import AppBarComponent from "./AppBarComponent";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const lastProposalElementRef = useRef();
  const navigate = useNavigate();

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
        setProposals(fetchedPosts);
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

  const handleDelete = async (id) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await userService.deleteUser(id);
        alert("Teklif silindi.");
      } catch (error) {
        alert(`Silme hatası: ${error.message}`);
      }
    }
  };

  const handleTableClick = (item) => {
    navigate(`/carddetail/${item.id}`, {
      state: {
        post: item,
      },
    });
  };

  return (
    <Container>
      <AppBarComponent
        user={user}
        pages={["Products", "Pricing", "Blog"]}
        settings={["Profile", "Account", "Dashboard", "Logout"]}
        handleOpenNavMenu={() => {}}
        handleCloseNavMenu={() => {}}
        handleOpenUserMenu={() => {}}
        handleCloseUserMenu={() => {}}
        anchorElNav={null}
        anchorElUser={null}
      />
      <Stack>
        <Card sx={{ maxHeight: 300, display: "flex", position: "relative" }}>
          {user.profileImageUrl ? (
            <CardMedia
              component="img"
              sx={{
                backgroundPosition: "center",
                width: "40%",
                objectFit: "contain",
              }}
              image={user.profileImageUrl}
            />
          ) : null}
          <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
            <CardContent sx={{ flex: "1 0 auto", position: "relative" }}>
              <Typography component="div" variant="h5">
                {user.firstName + " " + user.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary" component="div">
                {user.username}
              </Typography>
              <Typography variant="h6" color="text.secondary" component="div">
                {user.emailAddress}
              </Typography>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
              >
                Sil
              </Button>
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Teklif Başlığı</TableCell>
                  <TableCell>Destek Sayısı</TableCell>
                  <TableCell>Gönderim Tarihi</TableCell>
                  <TableCell>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proposals.map((item, index) => (
                  <TableRow
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleTableClick(item)}
                    key={index}
                    ref={
                      proposals.length === index + 1
                        ? lastProposalElementRef
                        : null
                    }
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.commentCount}</TableCell>
                    <TableCell>{item.timesAgo}</TableCell>
                    <TableCell>
                      {item.state == "pending"
                        ? "Beklemede"
                        : item.state == "approved"
                        ? "Onaylandı"
                        : item.state == "rejected"
                        ? "Reddildi"
                        : "Paylaşımda"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </Container>
      </Stack>
    </Container>
  );
};

export default ProfileScreen;
