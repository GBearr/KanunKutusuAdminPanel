import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  CardHeader,
  Avatar,
  IconButton,
  CircularProgress,
  Box,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { commentService } from "../services/CommentService";

export const ProposalDetail = () => {
  const { state } = useLocation();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const card = state;
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const observer = useRef();
  const lastCommentElementRef = useRef();

  // Session storage'dan kullanıcı bilgilerini alma
  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserProfileClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const fetchComments = async (pageNum) => {
    setLoading(true);
    try {
      const fetchedComments = await commentService.getCommentsofPost(
        pageNum,
        card.post.id
      );
      setComments((prevComments) => [...prevComments, ...fetchedComments]);
      setHasMore(fetchedComments.length > 0);
    } catch (error) {
      console.error("Comment çekme hatası", error);
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return;

    try {
      const newComment = await commentService.insertComment(
        comment,
        card.post.id,
        user.id // Kullanıcı kimliğini ekliyoruz
      );
      if (newComment) {
        setComments((prevComments) => [newComment, ...prevComments]);
        setComment("");
      }
    } catch (error) {
      console.error("Yorum gönderme hatası", error);
    }
  };

  useEffect(() => {
    if (card) {
      fetchComments(page);
    }
  }, [card, page]);

  // useEffect(() => {
  //   if (!card) {
  //     navigate("/"); // Veya istediğiniz başka bir rota
  //   }
  // }, [card, navigate]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (lastCommentElementRef.current) {
      observer.current.observe(lastCommentElementRef.current);
    }
  }, [loading, hasMore]);

  if (!card) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
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
          <Typography variant="h6">Yorumlar</Typography>
          <List>
            {comments.map((comment, index) => (
              <ListItem
                key={index}
                alignItems="flex-start"
                ref={
                  comments.length === index + 1 ? lastCommentElementRef : null
                }
              >
                <ListItemAvatar
                  onClick={() => handleUserProfileClick(comment.userId)}
                >
                  {comment.profileImageURL ? (
                    <Avatar src={comment.profileImageURL} />
                  ) : (
                    <Avatar />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={comment.user_name}
                  secondary={comment.content}
                />
              </ListItem>
            ))}
          </List>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
          <TextField
            label="Yorumunuzu yazın"
            multiline
            rows={1}
            value={comment}
            fullWidth
            sx={{ mt: 2 }}
            variant="outlined"
            onChange={(e) => setComment(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="send" onClick={handleCommentSubmit}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProposalDetail;
