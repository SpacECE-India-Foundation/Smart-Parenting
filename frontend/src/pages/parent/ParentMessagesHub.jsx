import { useState } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemButton,
  ListItemAvatar, ListItemText, Avatar, Divider, Grid, Card, CardContent,
} from '@mui/material';
import {
  Message as MessageIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useChildProfile } from '../../context/ChildProfileContext';
import ChatScreen from '../chat/ChatScreen';
import { getAvatarEmoji } from '../../utils/helpers';

const ParentMessagesHub = () => {
  const { childProfiles } = useChildProfile();
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Theme accent colors
  const parentAccent = '#3BB77E';

  const selectedChild = childProfiles.find(
    (c) => (c._id || c.id) === selectedChildId
  );

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out', height: 'calc(100vh - 120px)' }}>
      <Grid container spacing={3} sx={{ height: '100%' }} alignItems="stretch">
        
        {/* ── Left Column: Child Selector list ── */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '24px',
              border: '1.5px solid rgba(0,0,0,0.055)',
              boxShadow: '0 4px 20px rgba(31,58,104,0.05)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" fontWeight={900} sx={{ fontFamily: '"Nunito", sans-serif' }}>
                Messages Hub 💬
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ display: 'block', mt: 0.5 }}>
                Select a child to discuss with their teacher
              </Typography>
            </Box>

            <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

            {/* List of children */}
            <List sx={{ flex: 1, overflowY: 'auto', px: 0, py: 0 }}>
              {childProfiles.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>👧</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={800}>
                    No child profiles found.
                  </Typography>
                </Box>
              ) : (
                childProfiles.map((child) => {
                  const childId = child._id || child.id;
                  const isSelected = selectedChildId === childId;

                  return (
                    <ListItem key={childId} disablePadding sx={{ mb: 1.5 }}>
                      <ListItemButton
                        onClick={() => setSelectedChildId(childId)}
                        sx={{
                          borderRadius: '16px',
                          p: 2,
                          bgcolor: isSelected ? `${parentAccent}10` : 'transparent',
                          border: isSelected
                            ? `1.5px solid ${parentAccent}35`
                            : '1.5px solid rgba(0,0,0,0.03)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: isSelected ? `${parentAccent}15` : 'rgba(0,0,0,0.02)',
                            border: `1.5px solid ${isSelected ? `${parentAccent}45` : 'rgba(0,0,0,0.1)'}`,
                          },
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 48 }}>
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              bgcolor: isSelected ? parentAccent : 'rgba(0,0,0,0.05)',
                              border: isSelected ? '2px solid white' : '2px solid transparent',
                              boxShadow: isSelected ? `0 2px 8px ${parentAccent}40` : 'none',
                              fontSize: '1.5rem',
                            }}
                          >
                            {getAvatarEmoji(child.avatar)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={child.name}
                          secondary={child.grade ? `Grade: ${child.grade}` : 'No Grade Set'}
                          primaryTypographyProps={{
                            fontWeight: isSelected ? 900 : 700,
                            color: isSelected ? parentAccent : 'text.primary',
                            fontSize: '0.92rem',
                          }}
                          secondaryTypographyProps={{
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        />
                        <ChevronRightIcon
                          sx={{
                            color: isSelected ? parentAccent : 'text.disabled',
                            transition: 'transform 0.2s ease',
                            transform: isSelected ? 'translateX(4px)' : 'none',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })
              )}
            </List>
          </Paper>
        </Grid>

        {/* ── Right Column: Embedded Chat Pane ── */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {selectedChildId ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                border: '1.5px solid rgba(0,0,0,0.055)',
                boxShadow: '0 4px 20px rgba(31,58,104,0.05)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <ChatScreen childId={selectedChildId} embedMode={true} />
            </Paper>
          ) : (
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: '24px',
                border: '1.5px solid rgba(0,0,0,0.055)',
                boxShadow: '0 4px 20px rgba(31,58,104,0.05)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#FFFFFF',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: `${parentAccent}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto mb-3',
                    color: parentAccent,
                  }}
                >
                  <MessageIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 1, fontFamily: '"Nunito", sans-serif' }}>
                  No discussion selected
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ maxWidth: 300, margin: '0 auto' }}>
                  Select one of your children from the list on the left to start talking with their assigned teacher.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

      </Grid>
    </Box>
  );
};

export default ParentMessagesHub;
