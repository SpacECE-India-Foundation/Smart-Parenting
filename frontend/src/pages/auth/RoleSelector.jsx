import { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SpacECELogo from '../../components/shared/SpacECELogo';
import logoImg from '../../assets/spaceece-logo.png';
import LoadingScreen from './LoadingScreen';

const rolesContent = {
  en: {
    heroTitle: "Explore, Learn & Grow Through Fun Adventures",
    chooseRoleBadge: "✨ Who are you today? Pick your role to begin!",
    continueBtn: "Continue to Portal →",
    selectFirstBtn: "Choose Your Role First 👆",
    newToText: "New to SpacECE?",
    createFreeAccount: "Create a free account →",
    registerCenterLink: "Register Center or Anganwadi →",
    childTitle: "I'm a Child",
    childSub: "Little Explorer",
    childDesc: "Play fun games, collect stars, and start exciting adventures!",
    parentTitle: "I'm a Parent",
    parentSub: "For Families",
    parentDesc: "Track your child's learning at home & celebrate achievements!",
    teacherTitle: "I'm a Teacher",
    teacherSub: "For Educators",
    teacherDesc: "Manage your classroom's progress & guide little learners!",
    adminTitle: "Administrator",
    adminSub: "Platform Admin",
    adminDesc: "Platform administration, security & system settings.",
  },
  hi: {
    heroTitle: "मजेदार कारनामों के माध्यम से खोजें, सीखें और बढ़ें",
    chooseRoleBadge: "✨ आज आप कौन हैं? शुरू करने के लिए अपनी भूमिका चुनें!",
    continueBtn: "पोर्टल पर आगे बढ़ें →",
    selectFirstBtn: "पहले अपनी भूमिका चुनें 👆",
    newToText: "SpacECE में नए हैं?",
    createFreeAccount: "नि:शुल्क खाता बनाएं →",
    registerCenterLink: "केंद्र या आंगनवाड़ी पंजीकृत करें →",
    childTitle: "मैं एक बच्चा हूं",
    childSub: "छोटे खोजकर्ता",
    childDesc: "मजेदार खेल खेलें, सितारे एकत्र करें और रोमांचक कारनामे शुरू करें!",
    parentTitle: "मैं माता-पिता हूं",
    parentSub: "परिवारों के लिए",
    parentDesc: "घर पर अपने बच्चे की शिक्षा को ट्रैक करें और प्रगति का जश्न मनाएं!",
    teacherTitle: "मैं शिक्षक हूं",
    teacherSub: "शिक्षकों के लिए",
    teacherDesc: "अपनी कक्षा की प्रगति प्रबंधित करें और छोटे शिक्षार्थियों का मार्गदर्शन करें!",
    adminTitle: "प्रशासक",
    adminSub: "प्लेटफ़ॉर्म व्यवस्थापक",
    adminDesc: "प्लेटफ़ॉर्म प्रशासन, सुरक्षा और सिस्टम सेटिंग्स।",
  },
  mr: {
    heroTitle: "रंजक खेळांच्या माध्यमातून शोधा, शिका आणि प्रगती करा",
    chooseRoleBadge: "✨ आज तुम्ही कोण आहात? सुरू करण्यासाठी तुमची भूमिका निवडा!",
    continueBtn: "पोर्टलवर पुढे जा →",
    selectFirstBtn: "आधी तुमची भूमिका निवडा 👆",
    newToText: "SpacECE वर नवीन आहात?",
    createFreeAccount: "मोफत खाते तयार करा →",
    registerCenterLink: "बालवाडी किंवा अंगणवाडी केंद्र नोंदवा →",
    childTitle: "मी लहान मूल आहे",
    childSub: "लहान शोधक",
    childDesc: "मजेदार खेळ खेळा, तारे गोळा करा आणि नवीन प्रवास सुरू करा!",
    parentTitle: "मी पालक आहे",
    parentSub: "कुटुंबांसाठी",
    parentDesc: "घरी आपल्या पाल्याचा शिकण्याचा प्रवास ट्रॅक करा आणि प्रगती साजरी करा!",
    teacherTitle: "मी शिक्षक आहे",
    teacherSub: "शिक्षकांसाठी",
    teacherDesc: "तुमच्या वर्गाची प्रगती व्यवस्थापित करा आणि लहान मुलांना मार्गदर्शन करा!",
    adminTitle: "प्रशासक",
    adminSub: "प्लॅटफॉर्म प्रशासक",
    adminDesc: "प्लॅटफॉर्म प्रशासन, सुरक्षा आणि प्रणाली सेटिंग्ज.",
  }
};

const getRoleDefinitions = (t) => [
  {
    key: 'child',
    label: t.childTitle,
    subtitle: t.childSub,
    emoji: '🧒',
    description: t.childDesc,
    path: '/login/child',
    gradient: 'linear-gradient(145deg, #FEF9C3 0%, #FEF08A 60%, #FDE047 100%)',
    border: '#FACC15',
    accent: '#D97706',
    glow: 'rgba(217,119,6,0.35)',
    bg: 'rgba(254,249,195,0.9)',
    floatEmoji: ['🚀', '⭐', '🎨'],
    badgeBg: 'rgba(217,119,6,0.15)',
  },
  {
    key: 'parent',
    label: t.parentTitle,
    subtitle: t.parentSub,
    emoji: '👨‍👩‍👧',
    description: t.parentDesc,
    path: '/login/parent',
    gradient: 'linear-gradient(145deg, #DCFCE7 0%, #BBF7D0 60%, #86EFAC 100%)',
    border: '#4ADE80',
    accent: '#3BB77E',
    glow: 'rgba(59,183,126,0.35)',
    bg: 'rgba(220,252,231,0.9)',
    floatEmoji: ['❤️', '📊', '🌟'],
    badgeBg: 'rgba(59,183,126,0.15)',
  },
  {
    key: 'teacher',
    label: t.teacherTitle,
    subtitle: t.teacherSub,
    emoji: '👩‍🏫',
    description: t.teacherDesc,
    path: '/login/teacher',
    gradient: 'linear-gradient(145deg, #DBEAFE 0%, #BFDBFE 60%, #93C5FD 100%)',
    border: '#60A5FA',
    accent: '#4299E1',
    glow: 'rgba(66,153,225,0.35)',
    bg: 'rgba(219,234,254,0.9)',
    floatEmoji: ['📚', '✏️', '🎓'],
    badgeBg: 'rgba(66,153,225,0.15)',
  },
  {
    key: 'admin',
    label: t.adminTitle,
    subtitle: t.adminSub,
    emoji: '🔐',
    description: t.adminDesc,
    path: '/login/admin',
    gradient: 'linear-gradient(145deg, #F3E8FF 0%, #E9D5FF 60%, #D8B4FE 100%)',
    border: '#C084FC',
    accent: '#9F7AEA',
    glow: 'rgba(159,122,234,0.35)',
    bg: 'rgba(243,232,255,0.9)',
    floatEmoji: ['⚙️', '🛡️', '📋'],
    badgeBg: 'rgba(159,122,234,0.15)',
  },
];

const RoleSelector = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [selected, setSelected] = useState(null);
  const [hovering, setHovering] = useState(null);
  const [started, setStarted] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const t = rolesContent[lang] || rolesContent.en;
  const rolesList = getRoleDefinitions(t);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user  = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user?.role) {
      const dashboards = {
        parent:  '/parent/dashboard',
        teacher: '/teacher/dashboard',
        admin:   '/admin/dashboard',
        child:   '/child/dashboard',
      };
      const dest = dashboards[user.role];
      if (dest) {
        navigate(dest, { replace: true });
      }
    }
  }, [navigate]);

  const handleContinue = () => {
    if (selected) navigate(selected.path);
  };

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <Box sx={{
      maxWidth: 580, width: '100%',
      textAlign: 'center',
      px: { xs: 1, sm: 0 },
      mx: 'auto',
    }}>

      {!started ? (
        /* Splash Welcome Intro Screen */
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.6s ease-out',
        }}>
          <Box sx={{
            position: 'relative',
            width: 150,
            height: 150,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(31,58,104,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <Box
              component="img"
              src={logoImg}
              alt="SpacECE Logo"
              sx={{
                width: 110,
                height: 110,
                objectFit: 'contain',
                borderRadius: '16px',
              }}
            />
          </Box>

          <Typography variant="h3" fontWeight={950} sx={{ mb: 1, color: '#111111', fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.02em' }}>
            Spac<span style={{ color: '#FF9500' }}>ECE</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 700, mb: 4, maxWidth: 360, mx: 'auto' }}>
            {t.heroTitle}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setStarted(true)}
            sx={{
              px: 5, py: 1.8, fontSize: '1.1rem', fontWeight: 900,
              borderRadius: 50,
              background: 'linear-gradient(135deg, #FF9500 0%, #FFC107 100%)',
              color: 'white',
              boxShadow: '0 10px 32px rgba(255,149,0,0.45)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05) translateY(-2px)',
                boxShadow: '0 14px 40px rgba(255,149,0,0.6)',
              },
            }}
          >
            Start Learning Journey →
          </Button>

          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, mt: 5, opacity: 0.85 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={900} color="primary">50,000+</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>Children</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(31,58,104,0.1)' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={900} color="secondary">250+</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>Centers</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(31,58,104,0.1)' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={900} sx={{ color: '#3BB77E' }}>NEP 2020</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>Aligned</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        /* Role Selection Grid */
        <Box sx={{ animation: 'slideInUp 0.5s ease-out' }}>
          <Box sx={{ mx: 'auto', mb: 3, display: 'flex', justifyContent: 'center' }}>
            <SpacECELogo variant="glass" width={150} />
          </Box>

          <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5, color: '#111111', lineHeight: 1.2, fontFamily: '"Outfit", sans-serif' }}>
            Welcome to Spac<span style={{ color: '#F5A623' }}>ECE</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
            {t.heroTitle}
          </Typography>
          <Typography variant="body2" sx={{
            color: '#FF9500', fontWeight: 800, mb: 3,
            display: 'inline-flex', alignItems: 'center', gap: 0.5,
            bgcolor: 'rgba(255,149,0,0.1)', px: 2, py: 0.5, borderRadius: 10,
          }}>
            {t.chooseRoleBadge}
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 3,
          }}>
            {rolesList.map((role, index) => {
              const isSelected = selected?.key === role.key;
              const isHovered  = hovering === role.key;

              return (
                <Box
                  key={role.key}
                  onClick={() => setSelected(role)}
                  onMouseEnter={() => setHovering(role.key)}
                  onMouseLeave={() => setHovering(null)}
                  sx={{
                    borderRadius: '24px',
                    cursor: 'pointer',
                    background: isSelected ? role.gradient : `rgba(255,255,255,0.85)`,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: `2.5px solid ${isSelected ? role.accent : isHovered ? role.border + '80' : 'rgba(226,232,240,0.8)'}`,
                    boxShadow: isSelected
                      ? `0 12px 36px ${role.glow}, 0 4px 12px rgba(0,0,0,0.06)`
                      : isHovered
                        ? `0 8px 24px ${role.glow}`
                        : '0 4px 16px rgba(31,58,104,0.08)',
                    transform: isSelected
                      ? 'scale(1.04) translateY(-6px)'
                      : isHovered ? 'translateY(-5px)' : 'none',
                    transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: `slideInUp 0.5s ease-out ${index * 0.09}s both`,
                    p: { xs: 2, sm: 2.5 },
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isSelected && (
                    <CheckCircleIcon sx={{
                      position: 'absolute', top: 10, right: 10,
                      fontSize: 22, color: role.accent,
                      bgcolor: 'white', borderRadius: '50%',
                      boxShadow: `0 2px 8px ${role.glow}`,
                    }} />
                  )}

                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{
                      fontSize: { xs: '2.6rem', sm: '3.2rem' }, mb: 1,
                      lineHeight: 1, display: 'block',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
                    }}>
                      {role.emoji}
                    </Box>

                    <Typography fontWeight={900} sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      color: isSelected ? role.accent : '#0F2942',
                      mb: 0.25, lineHeight: 1.2,
                    }}>
                      {role.label}
                    </Typography>

                    <Typography variant="caption" sx={{
                      color: role.accent, fontWeight: 800,
                      mb: 0.5, fontSize: '0.7rem',
                      bgcolor: role.badgeBg,
                      borderRadius: 10, px: 1.5, py: 0.25,
                      display: 'inline-block',
                    }}>
                      {role.subtitle}
                    </Typography>

                    <Typography variant="caption" sx={{
                      color: '#64748B', lineHeight: 1.4, fontWeight: 600,
                      display: 'block', fontSize: '0.73rem', mt: 0.5,
                    }}>
                      {role.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Button
            variant="contained"
            size="large"
            disabled={!selected}
            onClick={handleContinue}
            startIcon={<RocketLaunchIcon />}
            sx={{
              px: 5, py: 1.8, fontSize: '1.05rem', fontWeight: 900,
              borderRadius: 50, mb: 2.5,
              background: selected
                ? `linear-gradient(135deg, ${selected.accent} 0%, ${selected.border} 100%)`
                : 'linear-gradient(135deg, #CBD5E0 0%, #E2E8F0 100%)',
              color: selected ? 'white' : 'text.secondary',
              boxShadow: selected ? `0 8px 28px ${selected?.glow || 'rgba(0,0,0,0.15)'}` : 'none',
              transition: 'all 0.3s ease',
              letterSpacing: '0.01em',
              '&:hover': {
                transform: selected ? 'scale(1.04) translateY(-3px)' : 'none',
                boxShadow: selected ? `0 14px 36px ${selected?.glow}` : 'none',
              },
            }}
          >
            {selected ? `${t.continueBtn}` : `${t.selectFirstBtn}`}
          </Button>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {t.newToText}{' '}
              <Typography
                component="span" variant="body2"
                sx={{
                  color: '#FF9500', fontWeight: 900, cursor: 'pointer',
                  bgcolor: 'rgba(255,149,0,0.1)', px: 1.5, py: 0.25, borderRadius: 10,
                  '&:hover': { bgcolor: 'rgba(255,149,0,0.2)', textDecoration: 'underline' },
                }}
                onClick={() => navigate('/register')}
              >
                {t.createFreeAccount}
              </Typography>
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: '#047857', fontWeight: 800, cursor: 'pointer',
                bgcolor: 'rgba(16,185,129,0.1)', px: 1.5, py: 0.3, borderRadius: 10,
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate('/register-center')}
            >
              🏫 {t.registerCenterLink}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RoleSelector;
