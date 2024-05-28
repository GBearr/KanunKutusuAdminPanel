import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  CardHeader,
  Avatar,
  CircularProgress,
  Box,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import AppBarComponent from "./AppBarComponent";
import postService from "../services/PostService";
import userService from "../services/UserService";

export const ProposalDetail = () => {
  const { state } = useLocation();
  const card = state;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Session storage'dan kullanıcı bilgilerini alma
  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserProfileClick = (id) => {
    navigate(`/profiledetail/${id}`);
  };

  const handleApprove = async () => {
    if (window.confirm("Bu teklifi onaylamak istediğinizden emin misiniz?")) {
      try {
        await postService.approvePost(card.post.id);
        alert("Teklif onaylandı.");
      } catch (error) {
        alert(`Onaylama hatası: ${error.message}`);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("Bu teklifi reddetmek istediğinizden emin misiniz?")) {
      try {
        await postService.rejectPost(card.post.id);
        alert("Teklif reddedildi.");
      } catch (error) {
        alert(`Reddetme hatası: ${error.message}`);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bu teklifi silmek istediğinizden emin misiniz?")) {
      try {
        await postService.deletePost(card.post.id);
        alert("Teklif silindi.");
      } catch (error) {
        alert(`Silme hatası: ${error.message}`);
      }
    }
  };

  if (!card) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  console.log(card.post);

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
      <Card sx={{ maxWidth: "100%", mt: 4 }}>
        <CardHeader
          avatar={
            <Avatar
              src={card.post.profileImageUrl}
              onClick={() => handleUserProfileClick(card.post.userId)}
              sx={{ cursor: "pointer" }}
            />
          }
          title={
            <Typography gutterBottom variant="h5" component="div">
              {card.post.title}
            </Typography>
          }
          subheader={card.post.date}
        />
        {card.post.image && (
          <CardMedia component={"img"} height={194} image={card.post.image} />
        )}
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            {card.post.content}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            {card.post.state == "pending" ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApprove}
                >
                  Onayla
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleReject}
                >
                  Reddet
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Sil
                </Button>
              </>
            ) : card.post.state == "approved" || "rejected" ? (
              <Button variant="contained" color="error" onClick={handleDelete}>
                Sil
              </Button>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProposalDetail;
