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
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";

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
        handleOpenUserMenu={() => {}}
        handleCloseUserMenu={() => {}}
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
            <>
              <Typography gutterBottom variant="h5" component="div">
                {card.post.title}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {card.post.getDate}
              </Typography>
            </>
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
          <Stack direction="row" sx={{ mt: 1 }} spacing={2}>
            <Button
              disableRipple
              sx={{
                cursor: "default",
                "&:hover": { backgroundColor: "transparent" },
              }}
              color="inherit"
            >
              <ThumbUpAltOutlinedIcon sx={{ mr: 1 }} /> {card.post.supportCount}
            </Button>
            <Button
              disableRipple
              sx={{
                cursor: "default",
                "&:hover": { backgroundColor: "transparent" },
              }}
              color="inherit"
            >
              <ModeCommentOutlinedIcon sx={{ mr: 1 }} />{" "}
              {card.post.commentCount}
            </Button>
          </Stack>
        </CardContent>
        <Divider />

        {card.post.state === "pending" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Stack direction="row" spacing={1}>
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
              <Button variant="contained" color="error" onClick={handleDelete}>
                Sil
              </Button>
            </Stack>
          </Box>
        )}
        {(card.post.state === "approved" ||
          card.post.state === "rejected" ||
          card.post.state === "none") && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Sil
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default ProposalDetail;
