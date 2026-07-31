import React from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Card, CardContent, Divider, Switch } from "@mui/material";
import { updateNotificationSettings } from "../../features/catalog/catalogSlice";

export default function ListenerNotificationSettings({ userId, notificationSettings }) {
  const dispatch = useDispatch();

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>Notification Settings</Typography>
      <Card sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
        <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", gap: 3.5 }}>
          
          {/* Master Switch */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ flexGrow: 1, pr: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>Enable Push Notifications</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Toggle all soundwave platform push notification alerts.</Typography>
            </Box>
            <Switch
              checked={notificationSettings.enabled}
              onChange={(e) => dispatch(updateNotificationSettings({ userId, settings: { enabled: e.target.checked } }))}
              color="primary"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#01F2EA" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#01F2EA" }
              }}
            />
          </Box>

          <Divider sx={{ borderColor: "rgba(162,160,213,0.1)" }} />

          {/* New Song Switch */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: notificationSettings.enabled ? 1 : 0.5 }}>
            <Box sx={{ flexGrow: 1, pr: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>New Music Releases</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Notify me when followed artists release a new song.</Typography>
            </Box>
            <Switch
              disabled={!notificationSettings.enabled}
              checked={notificationSettings.enabled && notificationSettings.newSong}
              onChange={(e) => dispatch(updateNotificationSettings({ userId, settings: { newSong: e.target.checked } }))}
              color="primary"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#01F2EA" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#01F2EA" }
              }}
            />
          </Box>

          <Divider sx={{ borderColor: "rgba(162,160,213,0.1)" }} />

          {/* New Album Switch */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: notificationSettings.enabled ? 1 : 0.5 }}>
            <Box sx={{ flexGrow: 1, pr: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>New Album Releases</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Notify me when followed artists release a new album.</Typography>
            </Box>
            <Switch
              disabled={!notificationSettings.enabled}
              checked={notificationSettings.enabled && notificationSettings.newAlbum}
              onChange={(e) => dispatch(updateNotificationSettings({ userId, settings: { newAlbum: e.target.checked } }))}
              color="primary"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#01F2EA" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#01F2EA" }
              }}
            />
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
