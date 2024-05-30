import React, { useState, useEffect, useRef } from "react";
import postService from "../services/PostService";
import {
  Box,
  Container,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import AppBarComponent from "./AppBarComponent";

const AdminPanel = () => {
  const [proposals, setProposals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const observer = useRef();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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
        } else if (tabValue === 1) {
          data = await postService.getApprovedPosts(page, user.id);
        } else {
          data = await postService.getRejectedPosts(page, user.id);
        }
        if (data && Array.isArray(data)) {
          setProposals((prevProposals) => [...prevProposals, ...data]);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Beklenmeyen veri yapısı");
        }
      } catch (error) {
        console.error("Veri getirme hatası:", error);
        setHasMore(false);
      }
      setLoading(false);
    };

    if (user) {
      fetchProposals();
    }
  }, [tabValue, page, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
    setProposals([]);
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

  const navigate = useNavigate();

  const handleTableClick = (item) => {
    navigate(`/carddetail/${item.id}`, {
      state: {
        post: item,
      },
    });
  };

  console.log(proposals);
  return (
    <Container>
      <AppBarComponent
        user={user}
        handleOpenUserMenu={handleOpenUserMenu}
        handleCloseUserMenu={handleCloseUserMenu}
        anchorElUser={anchorElUser}
      />
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
                      : null}
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
    </Container>
  );
};

export default AdminPanel;
