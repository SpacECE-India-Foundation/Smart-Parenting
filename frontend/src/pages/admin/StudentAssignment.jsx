import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemButton,
  ListItemAvatar, ListItemText, Avatar, Divider, Grid, Card, CardContent,
  Button, IconButton, Select, MenuItem, FormControl, InputLabel,
  Alert, CircularProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  PersonRemove as RemoveIcon,
  ChildCare as ChildCareIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { getAvatarEmoji, getInitials } from '../../utils/helpers';
import {
  getAssignmentsData,
  assignStudent,
  unassignStudent,
} from '../../api/assignmentService';

const StudentAssignment = () => {
  const [teachers, setTeachers] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [assignChildId, setAssignChildId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const adminAccent = '#8B5CF6'; // Violet theme for admin

  const loadData = async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await getAssignmentsData();
    if (err) {
      setError(err);
    } else {
      setTeachers(data?.teachers || []);
      setChildren(data?.children || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedTeacher = teachers.find((t) => t.uid === selectedTeacherId);

  // Helper to find all child IDs assigned to any teacher
  const allAssignedChildIds = new Set(
    teachers.flatMap((t) => t.linked_child_profiles || [])
  );

  // Filter children who are not assigned to any teacher
  const unassignedChildren = children.filter(
    (c) => !allAssignedChildIds.has(c._id || c.id)
  );

  // Get full child details for currently selected teacher's assigned profiles
  const assignedChildrenDetails = selectedTeacher
    ? children.filter((c) =>
        (selectedTeacher.linked_child_profiles || []).includes(c._id || c.id)
      )
    : [];

  const handleAssign = async () => {
    if (!selectedTeacherId || !assignChildId) return;
    setActionLoading(true);
    setError('');
    setSuccess('');

    const { error: err } = await assignStudent(selectedTeacherId, assignChildId);
    if (err) {
      setError(err);
    } else {
      setSuccess('Student assigned successfully.');
      setAssignChildId('');
      await loadData();
    }
    setActionLoading(false);
  };

  const handleUnassign = async (childId) => {
    if (!selectedTeacherId || !childId) return;
    setActionLoading(true);
    setError('');
    setSuccess('');

    const { error: err } = await unassignStudent(selectedTeacherId, childId);
    if (err) {
      setError(err);
    } else {
      setSuccess('Student unassigned successfully.');
      await loadData();
    }
    setActionLoading(false);
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.01em' }}>
            Student Assignment 🏫
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Link student child profiles to registered teachers
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadData}
          disabled={loading}
          variant="contained"
          color="secondary"
          sx={{ borderRadius: '12px' }}
        >
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: adminAccent }} />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ height: 'calc(100% - 70px)' }} alignItems="stretch">
          
          {/* Left Column: Teacher list */}
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
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5, fontFamily: '"Nunito", sans-serif' }}>
                Teachers ({teachers.length})
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

              <List sx={{ flex: 1, overflowY: 'auto', px: 0, py: 0 }}>
                {teachers.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 5 }}>
                    <SchoolIcon sx={{ fontSize: '2.5rem', color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={800}>
                      No teachers found.
                    </Typography>
                  </Box>
                ) : (
                  teachers.map((teacher) => {
                    const isSelected = selectedTeacherId === teacher.uid;
                    const studentCount = (teacher.linked_child_profiles || []).length;

                    return (
                      <ListItem key={teacher.uid} disablePadding sx={{ mb: 1.5 }}>
                        <ListItemButton
                          onClick={() => {
                            setSelectedTeacherId(teacher.uid);
                            setSuccess('');
                            setError('');
                          }}
                          sx={{
                            borderRadius: '16px',
                            p: 2,
                            bgcolor: isSelected ? `${adminAccent}10` : 'transparent',
                            border: isSelected
                              ? `1.5px solid ${adminAccent}35`
                              : '1.5px solid rgba(0,0,0,0.03)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: isSelected ? `${adminAccent}15` : 'rgba(0,0,0,0.02)',
                              border: `1.5px solid ${isSelected ? `${adminAccent}45` : 'rgba(0,0,0,0.1)'}`,
                            },
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 48 }}>
                            <Avatar
                              sx={{
                                width: 42,
                                height: 42,
                                bgcolor: isSelected ? adminAccent : 'rgba(0,0,0,0.05)',
                                color: isSelected ? 'white' : 'text.primary',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                              }}
                            >
                              {getInitials(teacher.displayName || teacher.email)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={teacher.displayName || 'No Name Set'}
                            secondary={`${teacher.email} • ${studentCount} child${studentCount !== 1 ? 'ren' : ''}`}
                            primaryTypographyProps={{
                              fontWeight: isSelected ? 900 : 700,
                              color: isSelected ? adminAccent : 'text.primary',
                              fontSize: '0.92rem',
                            }}
                            secondaryTypographyProps={{
                              fontWeight: 600,
                              fontSize: '0.72rem',
                            }}
                          />
                          <ChevronRightIcon
                            sx={{
                              color: isSelected ? adminAccent : 'text.disabled',
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

          {/* Right Column: Manage Assignments */}
          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            {selectedTeacherId && selectedTeacher ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                
                {/* Teacher Summary Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    border: '1.5px solid rgba(0,0,0,0.055)',
                    boxShadow: '0 4px 20px rgba(31,58,104,0.05)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: adminAccent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Selected Teacher
                  </Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5, mb: 0.5, fontFamily: '"Nunito", sans-serif' }}>
                    {selectedTeacher.displayName || 'No Name Set'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {selectedTeacher.email}
                  </Typography>
                </Paper>

                {/* Section 1: Assigned Students List */}
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
                    overflow: 'hidden',
                  }}
                >
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5, fontFamily: '"Nunito", sans-serif' }}>
                    Assigned Students ({assignedChildrenDetails.length})
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

                  {assignedChildrenDetails.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <ChildCareIcon sx={{ fontSize: '3rem', color: 'text.disabled', mx: 'auto', mb: 1.5 }} />
                      <Typography variant="subtitle1" fontWeight={800} color="text.secondary">
                        No students assigned yet.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 0.5 }}>
                        Use the section below to link children to this teacher.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontWeight: 800 }}>Student</TableCell>
                            <TableCell style={{ fontWeight: 800 }}>Age Group</TableCell>
                            <TableCell style={{ fontWeight: 800 }} align="right">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {assignedChildrenDetails.map((child) => (
                            <TableRow key={child._id || child.id} hover>
                              <TableCell style={{ fontWeight: 700, padding: '12px 8px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Typography sx={{ fontSize: '1.5rem' }}>
                                    {getAvatarEmoji(child.avatar)}
                                  </Typography>
                                  <Box>
                                    <Typography variant="body2" fontWeight={800}>
                                      {child.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                      {child.grade ? `Grade: ${child.grade}` : 'No Grade'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell style={{ fontWeight: 600 }}>{child.age_group || '4-6'}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="error"
                                  onClick={() => handleUnassign(child._id || child.id)}
                                  disabled={actionLoading}
                                  sx={{
                                    bgcolor: 'rgba(239,68,68,0.08)',
                                    '&:hover': { bgcolor: 'rgba(239,68,68,0.18)' },
                                  }}
                                  size="small"
                                >
                                  <RemoveIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>

                {/* Section 2: Assign New Student Dropdown */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    border: '1.5px solid rgba(0,0,0,0.055)',
                    boxShadow: '0 4px 20px rgba(31,58,104,0.05)',
                  }}
                >
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5, fontFamily: '"Nunito", sans-serif' }}>
                    Assign New Student 👦
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 2 }}>
                    Only students who are not currently assigned to any teacher are listed below.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ flex: 1, minWidth: 220 }}>
                      <InputLabel>Select Student</InputLabel>
                      <Select
                        value={assignChildId}
                        onChange={(e) => setAssignChildId(e.target.value)}
                        label="Select Student"
                        disabled={actionLoading || unassignedChildren.length === 0}
                      >
                        {unassignedChildren.length === 0 ? (
                          <MenuItem value="" disabled>
                            No unassigned students available
                          </MenuItem>
                        ) : (
                          unassignedChildren.map((c) => (
                            <MenuItem key={c._id || c.id} value={c._id || c.id}>
                              {getAvatarEmoji(c.avatar)} {c.name} ({c.age_group || '4-6'})
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      onClick={handleAssign}
                      disabled={actionLoading || !assignChildId}
                      sx={{
                        borderRadius: '12px',
                        bgcolor: adminAccent,
                        px: 3.5,
                        '&:hover': { bgcolor: '#7c4dff' },
                      }}
                    >
                      {actionLoading ? 'Assigning...' : 'Assign'}
                    </Button>
                  </Box>
                </Paper>

              </Box>
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
                  minHeight: '300px',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      bgcolor: `${adminAccent}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto mb-3',
                      color: adminAccent,
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={900} sx={{ mb: 1, fontFamily: '"Nunito", sans-serif' }}>
                    No teacher selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ maxWidth: 320, margin: '0 auto' }}>
                    Select a teacher from the list on the left to manage their assigned students and assign new children.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

        </Grid>
      )}
    </Box>
  );
};

export default StudentAssignment;
