import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  MusicNote as MusicNoteIcon,
  Mic as MicIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../../../../services/authService';

export default function SidebarNav({ currentTab, setCurrentTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => setCurrentTab('dashboard')}
          selected={currentTab === 'dashboard'}
          sx={{
            borderRadius: 3,
            py: 1.2,
            px: 2,
            bgcolor: currentTab === 'dashboard' ? 'rgba(1, 242, 234, 0.08)' : 'transparent',
            color: currentTab === 'dashboard' ? '#01F2EA' : '#FFFFFF',
            '&.Mui-selected': { bgcolor: 'rgba(1, 242, 234, 0.08)', color: '#01F2EA' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: currentTab === 'dashboard' ? '#01F2EA' : '#A2A0D5' }}>
            <HomeIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => setCurrentTab('users')}
          selected={currentTab === 'users'}
          sx={{
            borderRadius: 3,
            py: 1.2,
            px: 2,
            bgcolor: currentTab === 'users' ? 'rgba(1, 242, 234, 0.08)' : 'transparent',
            color: currentTab === 'users' ? '#01F2EA' : '#FFFFFF',
            '&.Mui-selected': { bgcolor: 'rgba(1, 242, 234, 0.08)', color: '#01F2EA' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: currentTab === 'users' ? '#01F2EA' : '#A2A0D5' }}>
            <PeopleIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Manage Users" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>
      </ListItem>

      <Divider sx={{ my: 2, borderColor: 'rgba(162,160,213,0.15)' }} />
      <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
        System Mocks
      </Typography>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => setCurrentTab('songs')}
          selected={currentTab === 'songs'}
          sx={{
            borderRadius: 3,
            py: 1.2,
            px: 2,
            bgcolor: currentTab === 'songs' ? 'rgba(1, 242, 234, 0.08)' : 'transparent',
            color: currentTab === 'songs' ? '#01F2EA' : '#FFFFFF',
            '&.Mui-selected': { bgcolor: 'rgba(1, 242, 234, 0.08)', color: '#01F2EA' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: currentTab === 'songs' ? '#01F2EA' : '#A2A0D5' }}>
            <MusicNoteIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Manage Songs" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => setCurrentTab('artists')}
          selected={currentTab === 'artists'}
          sx={{
            borderRadius: 3,
            py: 1.2,
            px: 2,
            bgcolor: currentTab === 'artists' ? 'rgba(1, 242, 234, 0.08)' : 'transparent',
            color: currentTab === 'artists' ? '#01F2EA' : '#FFFFFF',
            '&.Mui-selected': { bgcolor: 'rgba(1, 242, 234, 0.08)', color: '#01F2EA' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: currentTab === 'artists' ? '#01F2EA' : '#A2A0D5' }}>
            <MicIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Manage Artists" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => setCurrentTab('categories')}
          selected={currentTab === 'categories'}
          sx={{
            borderRadius: 3,
            py: 1.2,
            px: 2,
            bgcolor: currentTab === 'categories' ? 'rgba(1, 242, 234, 0.08)' : 'transparent',
            color: currentTab === 'categories' ? '#01F2EA' : '#FFFFFF',
            '&.Mui-selected': { bgcolor: 'rgba(1, 242, 234, 0.08)', color: '#01F2EA' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: currentTab === 'categories' ? '#01F2EA' : '#A2A0D5' }}>
            <CategoryIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Manage Categories" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => setCurrentTab('reports')}
          selected={currentTab === 'reports'}
          sx={{
            borderRadius: 3,
            py: 1.2,
            px: 2,
            bgcolor: currentTab === 'reports' ? 'rgba(1, 242, 234, 0.08)' : 'transparent',
            color: currentTab === 'reports' ? '#01F2EA' : '#FFFFFF',
            '&.Mui-selected': { bgcolor: 'rgba(1, 242, 234, 0.08)', color: '#01F2EA' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: currentTab === 'reports' ? '#01F2EA' : '#A2A0D5' }}>
            <AssessmentIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Reports" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>
      </ListItem>

      <Divider sx={{ my: 2, borderColor: 'rgba(162,160,213,0.15)' }} />
      <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
        Account
      </Typography>

      <ListItem disablePadding>
        <ListItemButton onClick={() => navigate('/profile')} sx={{ borderRadius: 3, py: 1.2, px: 2, color: '#FFFFFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
          <ListItemIcon sx={{ minWidth: 36, color: '#A2A0D5' }}>
            <PersonIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.05)' } }}>
          <ListItemIcon sx={{ minWidth: 36, color: '#EF4444' }}>
            <ExitToAppIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
