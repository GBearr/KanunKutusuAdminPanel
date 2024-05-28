import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  IconButton,
  CardHeader,
  Avatar,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import { postService } from "../services/PostService";

export const ProposalCard = ({ post }) => {
  const navigate = useNavigate();
  const [isSupported, setIsSupported] = useState(post.isSupported);
  const [supportCount, setSupportCount] = useState(post.supportCount);

  const userId = JSON.parse(sessionStorage.getItem("currentUser")).id;

  const handleClick = () => {
    navigate(`/carddetail/${post.id}`, {
      state: {
        post: post,
      },
    });
  };

  const handleSupportClick = async () => {
    const result = await postService.support(userId, post.id);
    if (result.length > 0) {
      setIsSupported(result[0].is_supported);
      setSupportCount(result[0].support_count);
    }
  };

  return (
    <Card
      sx={{ maxWidth: "100%", border: "none", borderRadius: "16px" }}
      style={{ cursor: "pointer" }}
      variant="outlined"
    >
      <CardHeader
        onClick={handleClick}
        avatar={<Avatar src={post.profileImageUrl} />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography gutterBottom variant="h5" component="div">
            {post.title}
          </Typography>
        }
        subheader={post.date}
      />
      {post.imageUrl ? (
        <CardMedia component={"img"} height={"100%"} image={post.imageUrl} />
      ) : null}

      <CardContent onClick={handleClick}>
        <Typography
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
          variant="body2"
          color="text.secondary"
        >
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button color="inherit" onClick={handleSupportClick}>
          {isSupported ? (
            <ThumbUpIcon sx={{ mr: 1 }} />
          ) : (
            <ThumbUpAltOutlinedIcon sx={{ mr: 1 }} />
          )}
          {supportCount}
        </Button>
        <Button color="inherit">
          <ModeCommentOutlinedIcon sx={{ mr: 1 }} />
          {post.commentCount}
        </Button>
      </CardActions>
    </Card>
  );
};
