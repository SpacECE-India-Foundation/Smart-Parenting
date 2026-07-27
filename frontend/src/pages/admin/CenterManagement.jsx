import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, InputAdornment, MenuItem, Select,
  IconButton, Button, Alert, CircularProgress, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TYPE_CONFIG = {
  anganwadi: { label: 'Anganwadi', color: '#10B981', bg: '#DCFCE7', icon: '🏫' },
  preschool: { label: 'Preschool', color: '#2563EB', bg: '#DBEAFE', icon: '🎈' },
  ngo:       { label: 'NGO / Community', color: '#D97706', bg: '#FEF3C7', icon: '🤝' },
};

const STATUS_CONFIG = {
  pending:   { label: 'Pending Review', color: '#D97706', bg: '#FEF3C7' },
  contacted: { label: 'Contacted',      color: '#2563EB', bg: '#DBEAFE' },
  approved:  { label: 'Approved',       color: '#059669', bg: '#D1FAE5' },
};

export default function CenterManagement() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/centers');
      if (res.ok) {
        const data = await res.json();
        setCenters(data.centers || []);
      } else {
        // Fallback to localStorage
        const local = JSON.parse(localStorage.getItem('registered_centers') || '[]');
        setCenters(local.map((item, idx) => ({ _id: `local-${idx}`, status: 'pending', centerType: 'anganwadi', ...item })));
      }
    } catch (_err) {
      const local = JSON.parse(localStorage.getItem('registered_centers') || '[]');
      setCenters(local.map((item, idx) => ({ _id: `local-${idx}`, status: 'pending', centerType: 'anganwadi', ...item })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (!id.startsWith('local-')) {
        await fetch(`http://localhost:5000/api/centers/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      }
      setCenters((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      setAlert({ type: 'success', msg: 'Center status updated successfully!' });
      setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
    } catch (_err) {
      setAlert({ type: 'error', msg: 'Failed to update status on backend.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this center registration record?')) return;
    try {
      if (!id.startsWith('local-')) {
        await fetch(`http://localhost:5000/api/centers/${id}`, { method: 'DELETE' });
      }
      setCenters((prev) => prev.filter((c) => c._id !== id));
      setAlert({ type: 'success', msg: 'Center record removed.' });
      setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
    } catch (_err) {
      setAlert({ type: 'error', msg: 'Failed to delete record.' });
    }
  };

  // Filtered List
  const filtered = centers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (c.centerName || '').toLowerCase().includes(q) ||
      (c.contactPerson || '').toLowerCase().includes(q) ||
      (c.location || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q);

    const matchesType   = filterType === 'all' || c.centerType === filterType;
    const matchesStatus = filterStatus === 'all' || (c.status || 'pending') === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistics
  const totalCount    = centers.length;
  const anganwadis    = centers.filter((c) => c.centerType === 'anganwadi').length;
  const preschools    = centers.filter((c) => c.centerType === 'preschool').length;
  const ngos          = centers.filter((c) => c.centerType === 'ngo').length;
  const pendingReview = centers.filter((c) => (c.status || 'pending') === 'pending').length;

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={950} sx={{ mb: 0.5, fontFamily: '"Nunito", sans-serif', color: '#0F2942' }}>
            🏫 Centers & Anganwadis Management
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={600}>
            View and manage all registered early childhood centers, Anganwadis, and partner NGOs.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchCenters}
          sx={{ borderRadius: 50, fontWeight: 800, borderColor: '#3B82F6', color: '#3B82F6' }}
        >
          Refresh Data
        </Button>
      </Box>

      {alert.msg && (
        <Alert severity={alert.type} sx={{ mb: 3, borderRadius: '16px' }}>
          {alert.msg}
        </Alert>
      )}

      {/* ── Summary Stats Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {[
          { label: 'Total Registered', value: totalCount, icon: '🏫', color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Anganwadi Centers', value: anganwadis, icon: '📍', color: '#059669', bg: '#ECFDF5' },
          { label: 'Private Preschools', value: preschools, icon: '🎈', color: '#9333EA', bg: '#F5F3FF' },
          { label: 'NGO / Community', value: ngos, icon: '🤝', color: '#D97706', bg: '#FFFBEB' },
          { label: 'Pending Review', value: pendingReview, icon: '⏳', color: '#DC2626', bg: '#FEF2F2' },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={stat.label}>
            <Paper elevation={0} sx={{
              p: 2.5, borderRadius: '22px', bgcolor: stat.bg, border: `1.5px solid ${stat.color}30`,
              boxShadow: `0 4px 16px ${stat.color}15`,
            }}>
              <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>{stat.icon}</Typography>
              <Typography variant="h4" fontWeight={950} sx={{ color: stat.color, fontFamily: '"Nunito", sans-serif' }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" fontWeight={800} color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Filters & Search ── */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', mb: 3.5, border: '1.5px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by center name, person, location, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 4 }}>
            <Select
              fullWidth
              size="small"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ borderRadius: 50 }}
            >
              <MenuItem value="all">All Center Types</MenuItem>
              <MenuItem value="anganwadi">🏫 Anganwadis</MenuItem>
              <MenuItem value="preschool">🎈 Preschools</MenuItem>
              <MenuItem value="ngo">🤝 NGOs</MenuItem>
            </Select>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 4 }}>
            <Select
              fullWidth
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ borderRadius: 50 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">⏳ Pending Review</MenuItem>
              <MenuItem value="contacted">📞 Contacted</MenuItem>
              <MenuItem value="approved">✅ Approved</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {/* ── Data Table ── */}
      <Paper elevation={0} sx={{ borderRadius: '24px', overflow: 'hidden', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ color: '#FF9500', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={700}>Loading registered centers from MongoDB...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '3rem', mb: 1 }}>🏫</Typography>
            <Typography variant="h6" fontWeight={800} color="text.primary">No centers found</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Try adjusting your search query or filters.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: '#1E293B' }}>Center Name &amp; Type</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#1E293B' }}>Contact Person</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#1E293B' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#1E293B' }}>Expected Children</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#1E293B' }}>Registered Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#1E293B' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900, color: '#1E293B' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((c) => {
                  const typeInfo   = TYPE_CONFIG[c.centerType] || TYPE_CONFIG.anganwadi;
                  const statusInfo = STATUS_CONFIG[c.status || 'pending'] || STATUS_CONFIG.pending;
                  const formattedDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';

                  return (
                    <TableRow key={c._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{
                            width: 40, height: 40, borderRadius: '12px', bgcolor: typeInfo.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
                          }}>
                            {typeInfo.icon}
                          </Box>
                          <Box>
                            <Typography fontWeight={900} sx={{ color: '#0F2942', fontSize: '0.95rem', lineHeight: 1.2 }}>
                              {c.centerName}
                            </Typography>
                            <Chip
                              label={typeInfo.label}
                              size="small"
                              sx={{
                                height: 20, fontSize: '0.68rem', fontWeight: 800,
                                bgcolor: typeInfo.bg, color: typeInfo.color, mt: 0.5
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={800} sx={{ fontSize: '0.88rem', color: '#1E293B' }}>
                          {c.contactPerson}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}>
                          <PhoneIcon sx={{ fontSize: 13, color: '#10B981' }} />
                          <a href={`tel:${c.phone}`} style={{ color: '#059669', textDecoration: 'none', fontWeight: 800 }}>
                            {c.phone}
                          </a>
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                          {c.location || 'Maharashtra, India'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={<GroupsIcon sx={{ fontSize: '14px !important', color: '#2563EB !important' }} />}
                          label={`${c.expectedChildren || '25-50'} Kids`}
                          size="small"
                          sx={{ bgcolor: '#EFF6FF', color: '#1E40AF', fontWeight: 800, fontSize: '0.75rem' }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          {formattedDate}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Select
                          size="small"
                          value={c.status || 'pending'}
                          onChange={(e) => handleStatusChange(c._id, e.target.value)}
                          sx={{
                            borderRadius: 50, fontSize: '0.78rem', fontWeight: 900,
                            bgcolor: statusInfo.bg, color: statusInfo.color,
                            height: 32,
                            '& .MuiSelect-select': { py: 0.5, px: 1.5 }
                          }}
                        >
                          <MenuItem value="pending">⏳ Pending</MenuItem>
                          <MenuItem value="contacted">📞 Contacted</MenuItem>
                          <MenuItem value="approved">✅ Approved</MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Delete record">
                          <IconButton size="small" onClick={() => handleDelete(c._id)} sx={{ color: '#EF4444' }}>
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
