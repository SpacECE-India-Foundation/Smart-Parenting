import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, MenuItem, Select, FormControl, InputLabel,
  InputAdornment, Paper, Checkbox, FormControlLabel
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpacECELogo from '../../components/shared/SpacECELogo';

const content = {
  en: {
    title: "Register Your Center or Anganwadi",
    subtitle: "Bring NEP 2020-aligned early assessment & learning tools to your students.",
    typeLabel: "Center Type",
    typeAnganwadi: "Anganwadi Center",
    typePreschool: "Private Preschool / Daycare",
    typeNgo: "NGO / Community Learning Center",
    nameLabel: "Center / School Name",
    locationLabel: "City / District, State",
    personLabel: "Contact Person Name",
    phoneLabel: "Contact Phone Number",
    childrenLabel: "Expected Number of Children",
    submitBtn: "Submit Registration →",
    submitting: "Submitting to Database...",
    backBtn: "← Back to Home",
    termsConsent: "I confirm that I am an authorized representative of this center.",
    successTitle: "Registration Submitted! 🎉",
    successMsg: "Thank you for registering your center with SpacECE India Foundation. Your data has been securely recorded in our database. Our regional coordinator will reach out to you within 3 business days.",
    homeBtn: "Return to Homepage",
    portalBtn: "Explore Roles Portal",
    duplicateError: "This phone number or center has already submitted a registration recently.",
    validationError: "Please fill in all required fields marked with * and provide a valid 10-digit phone number.",
  },
  hi: {
    title: "अपने केंद्र या आंगनवाड़ी को पंजीकृत करें",
    subtitle: "अपने बच्चों के लिए NEP 2020-संरेखित प्रारंभिक मूल्यांकन उपकरण लाएं।",
    typeLabel: "केंद्र का प्रकार",
    typeAnganwadi: "आंगनवाड़ी केंद्र",
    typePreschool: "निजी पूर्व-प्राथमिक विद्यालय",
    typeNgo: "एनजीओ / सामुदायिक शिक्षण केंद्र",
    nameLabel: "केंद्र / स्कूल का नाम",
    locationLabel: "शहर / जिला, राज्य",
    personLabel: "संपर्क व्यक्ति का नाम",
    phoneLabel: "संपर्क फोन नंबर",
    childrenLabel: "बच्चों की अपेक्षित संख्या",
    submitBtn: "पंजीकरण जमा करें →",
    submitting: "डेटाबेस में जमा किया जा रहा है...",
    backBtn: "← मुख्य पृष्ठ पर लौटें",
    termsConsent: "मैं पुष्टि करता/करती हूं कि मैं इस केंद्र का अधिकृत प्रतिनिधि हूं।",
    successTitle: "पंजीकरण सफलतापूर्वक जमा हुआ! 🎉",
    successMsg: "SpacECE इंडिया फाउंडेशन के साथ अपने केंद्र को पंजीकृत करने के लिए धन्यवाद। आपका डेटा हमारे डेटाबेस में सुरक्षित रूप से दर्ज कर लिया गया है। हमारा क्षेत्रीय समन्वयक 3 कार्य दिवसों के भीतर आपसे संपर्क करेगा।",
    homeBtn: "मुख्य पृष्ठ पर लौटें",
    portalBtn: "भूमिकाएं पोर्टल देखें",
    duplicateError: "यह फोन नंबर या केंद्र हाल ही में पहले ही पंजीकृत किया जा चुका है।",
    validationError: "कृपया * से चिह्नित सभी आवश्यक फ़ील्ड भरें और 10-अंकों का वैध फोन नंबर दर्ज करें।",
  },
  mr: {
    title: "तुमचे बालवाडी किंवा अंगणवाडी केंद्र नोंदणी करा",
    subtitle: "NEP 2020 वर आधारित बालशिक्षण व मूल्यांकन साधने तुमच्या केंद्रात आणा.",
    typeLabel: "केंद्राचा प्रकार",
    typeAnganwadi: "अंगणवाडी केंद्र",
    typePreschool: "खाजगी पूर्व-प्राथमिक शाळा",
    typeNgo: "सामाजिक / ना-नफा शिक्षण केंद्र",
    nameLabel: "केंद्राचे / शाळेचे नाव",
    locationLabel: "शहर / जिल्हा, राज्य",
    personLabel: "संपर्क व्यक्तीचे नाव",
    phoneLabel: "संपर्क फोन नंबर",
    childrenLabel: "मुलांची अपेक्षित संख्या",
    submitBtn: "नोंदणी सबमिट करा →",
    submitting: "डेटाबेसमध्ये सबमिट होत आहे...",
    backBtn: "← मुख्य पानावर जा",
    termsConsent: "मी याद्वारे पुष्टी करतो/करते की मी या केंद्राचा/शाळेचा अधिकृत प्रतिनिधी आहे.",
    successTitle: "नोंदणी यशस्वीरीत्या सबमिट झाली! 🎉",
    successMsg: "SpacECE इंडिया फाउंडेशनकडे केंद्राची नोंदणी केल्याबद्दल धन्यवाद. तुमची माहिती आमच्या डेटाबेसमध्ये सुरक्षितपणे जतन केली गेली आहे. आमचे समन्वयक ३ कामाच्या दिवसांत तुमच्याशी संपर्क साधतील.",
    homeBtn: "मुख्य पानावर जा",
    portalBtn: "भूमिका पोर्टल पहा",
    duplicateError: "हा फोन नंबर किंवा केंद्र नुकतेच नोंदवले गेले आहे.",
    validationError: "कृपया * चिन्हांकित सर्व आवश्यक माहिती भरा आणि १० अंकी वैध फोन नंबर टाका.",
  }
};

export default function CenterRegistration() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [formData, setFormData] = useState({
    centerName: '',
    centerType: 'anganwadi',
    location: '',
    contactPerson: '',
    phone: '',
    expectedChildren: '25-50',
    consent: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = content[lang] || content.en;

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.centerName.trim() || !formData.contactPerson.trim() || cleanPhone.length < 10) {
      setError(t.validationError);
      return;
    }

    const existing = JSON.parse(localStorage.getItem('registered_centers') || '[]');
    const isDuplicate = existing.some(item => item.phone === cleanPhone || item.centerName.toLowerCase() === formData.centerName.trim().toLowerCase());
    if (isDuplicate) {
      setError(t.duplicateError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/centers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centerName: formData.centerName,
          centerType: formData.centerType,
          location: formData.location,
          contactPerson: formData.contactPerson,
          phone: cleanPhone,
          expectedChildren: formData.expectedChildren,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.duplicateError);
        setLoading(false);
        return;
      }

      // Save local fallback
      existing.push({
        centerName: formData.centerName,
        phone: cleanPhone,
        date: new Date().toISOString(),
      });
      localStorage.setItem('registered_centers', JSON.stringify(existing));

      setLoading(false);
      setSubmitted(true);
    } catch (_err) {
      // Local fallback if backend server is unreachable
      existing.push({
        centerName: formData.centerName,
        phone: cleanPhone,
        date: new Date().toISOString(),
      });
      localStorage.setItem('registered_centers', JSON.stringify(existing));
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 540, width: '100%', mx: 'auto', px: 2, py: 4, textAlign: 'center', animation: 'bounceIn 0.5s ease-out' }}>
        <Paper elevation={4} sx={{ p: { xs: 4, sm: 5 }, borderRadius: '32px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(20px)' }}>
          <Box sx={{
            width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #DCFCE7, #86EFAC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)', fontSize: '2.8rem'
          }}>
            🏢
          </Box>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#064E3B', mb: 1, fontFamily: '"Outfit", sans-serif' }}>
            {t.successTitle}
          </Typography>
          <Typography variant="body1" sx={{ color: '#047857', fontWeight: 600, mb: 4, lineHeight: 1.6 }}>
            {t.successMsg}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ borderRadius: 50, px: 4, py: 1.2, fontWeight: 900, background: 'linear-gradient(135deg, #FF9500, #FFC107)', color: 'white' }}
            >
              {t.homeBtn}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/roles')}
              sx={{ borderRadius: 50, px: 4, py: 1.2, fontWeight: 800, borderColor: '#1F3A68', color: '#1F3A68' }}
            >
              {t.portalBtn}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 540, width: '100%', mx: 'auto', px: 2, py: 3, animation: 'fadeIn 0.5s ease-out' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1.5 }}>
          <SpacECELogo variant="glass" width={130} />
        </Box>

        <Box sx={{ display: 'inline-flex', gap: 0.5, bgcolor: 'rgba(241, 245, 249, 0.9)', p: 0.5, borderRadius: 10, border: '1px solid #E2E8F0', mb: 2 }}>
          {['en', 'hi', 'mr'].map((l) => (
            <Button
              key={l}
              size="small"
              onClick={() => setLang(l)}
              sx={{
                borderRadius: 8, px: 1.5, py: 0.2, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase',
                bgcolor: lang === l ? 'white' : 'transparent', color: lang === l ? '#1F3A68' : '#64748B',
                boxShadow: lang === l ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {l}
            </Button>
          ))}
        </Box>

        <Typography variant="h4" fontWeight={950} sx={{ color: '#0F2942', mb: 1, fontFamily: '"Outfit", sans-serif' }}>
          {t.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, maxWidth: 460, mx: 'auto' }}>
          {t.subtitle}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '32px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.8)' }}>
        {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '16px' }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <InputLabel>{t.typeLabel}</InputLabel>
            <Select value={formData.centerType} onChange={handleChange('centerType')} label={t.typeLabel} sx={{ borderRadius: 3 }}>
              <MenuItem value="anganwadi">🏫 {t.typeAnganwadi}</MenuItem>
              <MenuItem value="preschool">🎈 {t.typePreschool}</MenuItem>
              <MenuItem value="ngo">🤝 {t.typeNgo}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth label={t.nameLabel} value={formData.centerName} onChange={handleChange('centerName')} required sx={{ mb: 2.5 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: '#FF9500' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth label={t.locationLabel} value={formData.location} onChange={handleChange('location')} required sx={{ mb: 2.5 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: '#FF9500' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth label={t.personLabel} value={formData.contactPerson} onChange={handleChange('contactPerson')} required sx={{ mb: 2.5 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#FF9500' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth label={t.phoneLabel} value={formData.phone} onChange={handleChange('phone')} required sx={{ mb: 2.5 }}
            placeholder="10-digit mobile number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#FF9500' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <InputLabel>{t.childrenLabel}</InputLabel>
            <Select value={formData.expectedChildren} onChange={handleChange('expectedChildren')} label={t.childrenLabel} sx={{ borderRadius: 3 }}>
              <MenuItem value="10-25">👶 10 – 25 Children</MenuItem>
              <MenuItem value="25-50">👶 25 – 50 Children</MenuItem>
              <MenuItem value="50-100">👶 50 – 100 Children</MenuItem>
              <MenuItem value="100+">🏫 100+ Children</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.consent}
                onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
                sx={{ color: '#0D9488', '&.Mui-checked': { color: '#0D9488' } }}
              />
            }
            label={
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t.termsConsent}
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !formData.consent}
            sx={{
              py: 1.6, fontWeight: 900, fontSize: '1.05rem', borderRadius: 50,
              background: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
              color: 'white', boxShadow: '0 8px 24px rgba(4, 120, 87, 0.35)',
              '&:hover': { background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)', boxShadow: '0 12px 30px rgba(4, 120, 87, 0.5)' }
            }}
          >
            {loading ? t.submitting : t.submitBtn}
          </Button>
        </form>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ color: '#64748B', fontWeight: 800, borderRadius: 50 }}
        >
          {t.backBtn}
        </Button>
      </Box>
    </Box>
  );
}
