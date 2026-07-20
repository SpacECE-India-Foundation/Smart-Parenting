import { useEffect, useState, useRef, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, TextField, Button, Avatar, IconButton,
  Divider, CircularProgress, Alert, Grid, Menu, MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  School as TeacherIcon,
  Face as ParentIcon,
  AttachFile as AttachIcon,
  KeyboardVoice as MicIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getChildProfile } from '../../api/childProfileService';
import { getMessagesForChild, sendMessage, deleteMessage } from '../../api/messageService';
import { getAvatarEmoji, getInitials } from '../../utils/helpers';

const ChatAudioPlayer = ({ src, bubbleTextColor }) => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    if (audio.readyState >= 1) {
      setDuration(audio.duration);
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const formatAudioTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: '220px', py: 0.5 }}>
      <IconButton onClick={togglePlay} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.85)', color: bubbleTextColor, '&:hover': { bgcolor: 'white' } }}>
        {playing ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
      </IconButton>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ width: '100%', height: '4px', bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              height: '100%',
              bgcolor: bubbleTextColor,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 700, color: bubbleTextColor }}>
            {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ROLE_ACCENT = {
  teacher: '#4299E1',
  parent: '#3BB77E',
};

const ChatScreen = ({ childId: childIdProp, embedMode = false }) => {
  const { childId: paramChildId } = useParams();
  const childId = childIdProp || paramChildId;
  const navigate = useNavigate();
  const { userRole, currentUser } = useAuth();
  
  const [child, setChild] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [contextMenu, setContextMenu] = useState(null);

  const messagesEndRef = useRef(null);
  const accent = ROLE_ACCENT[userRole] || ROLE_ACCENT.parent;

  const recordingTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const previewAudioElementRef = useRef(null);
  const longPressTimeoutRef = useRef(null);

  // Auto-scroll to the bottom of the chat list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let active = true;

    const loadChatData = async () => {
      setLoading(true);
      setError('');
      try {
        const [childRes, messagesRes] = await Promise.all([
          getChildProfile(childId),
          getMessagesForChild(childId),
        ]);

        if (!active) return;

        if (childRes.error) {
          setError(childRes.error);
        } else {
          setChild(childRes.data);
        }

        if (messagesRes.error) {
          setError(messagesRes.error);
        } else {
          setMessages(messagesRes.data || []);
        }
      } catch (err) {
        if (active) setError('Failed to load chat details.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadChatData();

    return () => {
      active = false;
    };
  }, [childId]);

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !selectedImage && !recordedAudio) || sending) return;

    setSending(true);
    setError('');
    try {
      const res = await sendMessage(childId, text, selectedImage, recordedAudio);
      if (res.error) {
        setError(res.error);
      } else {
        // Append new message locally
        const localNewMessage = {
          ...res.data,
          senderId: {
            _id: currentUser?.uid || currentUser?._id,
            displayName: currentUser?.displayName || (userRole === 'teacher' ? 'Teacher' : 'Parent'),
          },
        };
        setMessages((prev) => [...prev, localNewMessage]);
        setText('');
        handleClearImage();
        discardAudio();
      }
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    if (userRole === 'teacher') {
      navigate('/teacher/roster');
    } else {
      navigate('/parent/dashboard');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isSameDay = (dateStr1, dateStr2) => {
    if (!dateStr1 || !dateStr2) return false;
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getDateSeparatorLabel = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const today = new Date();
    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return 'Today';
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    ) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, and WEBP formats are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds the 5MB limit.');
      return;
    }

    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl('');
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (previewAudioElementRef.current) {
        previewAudioElementRef.current.pause();
        previewAudioElementRef.current = null;
      }
    };
  }, [imagePreviewUrl, audioPreviewUrl]);

  const startRecording = async () => {
    setError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording.');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/ogg' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: '' };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
          type: audioBlob.type,
          lastModified: Date.now(),
        });
        
        setRecordedAudio(audioFile);
        setAudioPreviewUrl(URL.createObjectURL(audioFile));
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      setError(err.message || 'Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecording(false);
  };

  const discardAudio = () => {
    setRecordedAudio(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
      setAudioPreviewUrl('');
    }
    if (previewAudioElementRef.current) {
      previewAudioElementRef.current.pause();
      previewAudioElementRef.current = null;
    }
    setIsPlayingPreview(false);
  };

  const togglePlayPreview = () => {
    if (!previewAudioElementRef.current) {
      previewAudioElementRef.current = new Audio(audioPreviewUrl);
      previewAudioElementRef.current.onended = () => {
        setIsPlayingPreview(false);
      };
    }

    if (isPlayingPreview) {
      previewAudioElementRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioElementRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const formatRecordingTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getBackendUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
  };

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const loadMessages = async () => {
    try {
      const messagesRes = await getMessagesForChild(childId);
      if (!messagesRes.error) {
        setMessages(messagesRes.data || []);
      }
    } catch (err) {
      console.error('Failed to reload messages', err);
    }
  };

  const handleContextMenu = (event, msg) => {
    if (msg.deletedForEveryone) return;
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      message: msg
    });
  };

  const handleTouchStart = (event, msg) => {
    if (msg.deletedForEveryone) return;
    const touch = event.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    longPressTimeoutRef.current = setTimeout(() => {
      setContextMenu({
        mouseX: clientX,
        mouseY: clientY,
        message: msg
      });
    }, 700);
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteMe = async () => {
    const msg = contextMenu?.message;
    handleCloseMenu();
    if (!msg) return;

    // Optimistic Update: remove from view locally
    setMessages((prev) => prev.filter((m) => m._id !== msg._id));

    try {
      const res = await deleteMessage(msg._id, 'me');
      if (res.error) {
        setError(res.error);
        loadMessages();
      }
    } catch (err) {
      setError('Failed to delete message.');
      loadMessages();
    }
  };

  const handleDeleteEveryone = async () => {
    const msg = contextMenu?.message;
    handleCloseMenu();
    if (!msg) return;

    // Optimistic Update: set as deleted locally
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msg._id
          ? { ...m, deletedForEveryone: true, text: undefined, imageUrl: undefined, audioUrl: undefined }
          : m
      )
    );

    try {
      const res = await deleteMessage(msg._id, 'everyone');
      if (res.error) {
        setError(res.error);
        loadMessages();
      }
    } catch (err) {
      setError('Failed to delete message for everyone.');
      loadMessages();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress sx={{ color: accent }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: embedMode ? '100%' : 'calc(100vh - 120px)', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* ── Chat Header ── */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '20px', mb: 2.5, border: '1.5px solid rgba(0,0,0,0.055)', boxShadow: '0 4px 20px rgba(31,58,104,0.05)' }}>
        <Grid container alignItems="center" spacing={2}>
          {!embedMode && (
            <Grid item>
              <IconButton onClick={handleBack} sx={{ color: 'text.secondary' }}>
                <ArrowBackIcon />
              </IconButton>
            </Grid>
          )}
          <Grid item>
            <Avatar sx={{
              width: 52, height: 52,
              bgcolor: `${accent}15`,
              border: `2px solid ${accent}40`,
              fontSize: '1.8rem',
            }}>
              {getAvatarEmoji(child?.avatar)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" fontWeight={900} sx={{ fontFamily: '"Nunito", sans-serif' }}>
              Chat: {child?.name || 'Child'}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800}>
              {child?.grade ? `Grade: ${child.grade} | ` : ''}Parent & Teacher Discussion
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* ── Messages Display Area ── */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 3,
          borderRadius: '24px',
          overflowY: 'auto',
          bgcolor: '#F9FAFB',
          border: '1.5px solid rgba(0,0,0,0.04)',
          mb: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.6 }}>
            <Typography sx={{ fontSize: '3rem', mb: 1 }}>💬</Typography>
            <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Start the discussion by typing a message below.
            </Typography>
          </Box>
        ) : (
          messages.map((msg, i) => {
            const isTeacher = msg.senderRole === 'teacher';
            const senderName = msg.senderId?.displayName || (isTeacher ? 'Teacher' : 'Parent');
            const bubbleColor = msg.deletedForEveryone
              ? '#F3F4F6'
              : (isTeacher ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' : 'linear-gradient(135deg, #E6FFFA 0%, #D7F9EE 100%)');
            const bubbleBorderColor = msg.deletedForEveryone
              ? '#E5E7EB'
              : (isTeacher ? '#BFDBFE' : '#A7F3D0');
            const bubbleTextColor = msg.deletedForEveryone
              ? '#9CA3AF'
              : (isTeacher ? '#1E3A8A' : '#065F46');
            const alignment = isTeacher ? 'flex-start' : 'flex-end';

            const showDateSeparator = i === 0 || !isSameDay(messages[i - 1]?.createdAt, msg.createdAt);
            const dateLabel = showDateSeparator ? getDateSeparatorLabel(msg.createdAt) : null;

            return (
              <Fragment key={msg._id || i}>
                {showDateSeparator && dateLabel && (
                  <Box
                    sx={{
                      alignSelf: 'center',
                      my: 1.5,
                      px: 2.5,
                      py: 0.6,
                      borderRadius: '20px',
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                      border: '1.5px solid rgba(0, 0, 0, 0.03)',
                      color: 'text.secondary',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      fontFamily: '"Nunito", sans-serif',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {dateLabel}
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: alignment,
                    alignSelf: alignment,
                    maxWidth: '75%',
                  }}
                >
                  {/* Sender Indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, px: 1 }}>
                    {isTeacher ? (
                      <TeacherIcon sx={{ fontSize: 13, color: ROLE_ACCENT.teacher }} />
                    ) : (
                      <ParentIcon sx={{ fontSize: 13, color: ROLE_ACCENT.parent }} />
                    )}
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {senderName} ({isTeacher ? 'Teacher' : 'Parent'})
                    </Typography>
                  </Box>

                  {/* Message Bubble */}
                  <Box
                    onContextMenu={(e) => handleContextMenu(e, msg)}
                    onTouchStart={(e) => handleTouchStart(e, msg)}
                    onTouchEnd={handleTouchEnd}
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      background: bubbleColor,
                      border: `1px solid ${bubbleBorderColor}`,
                      color: bubbleTextColor,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      ...(isTeacher ? { borderTopLeftRadius: '4px' } : { borderTopRightRadius: '4px' }),
                      cursor: msg.deletedForEveryone ? 'default' : 'context-menu',
                    }}
                  >
                    {msg.deletedForEveryone ? (
                      <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600, color: 'text.secondary', opacity: 0.6 }}>
                        🚫 This message was deleted
                      </Typography>
                    ) : (
                      <>
                        {msg.imageUrl && (
                          <Box
                            component="img"
                            src={`${getBackendUrl()}${msg.imageUrl}`}
                            alt="attachment"
                            sx={{
                              maxWidth: '100%',
                              width: '250px',
                              borderRadius: '12px',
                              display: 'block',
                              mb: msg.text ? 1 : 0,
                              cursor: 'pointer',
                            }}
                            onClick={() => window.open(`${getBackendUrl()}${msg.imageUrl}`, '_blank')}
                          />
                        )}
                        {msg.audioUrl && (
                          <Box sx={{ mb: msg.text ? 1 : 0 }}>
                            <ChatAudioPlayer
                              src={`${getBackendUrl()}${msg.audioUrl}`}
                              bubbleTextColor={bubbleTextColor}
                            />
                          </Box>
                        )}
                        {msg.text && (
                          <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                            {msg.text}
                          </Typography>
                        )}
                      </>
                    )}
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.65, fontSize: '0.62rem', fontWeight: 700 }}>
                      {formatTime(msg.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* ── Image Preview Area (if selected) ── */}
      {selectedImage && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            mb: 1.5,
            borderRadius: '16px',
            bgcolor: 'rgba(0,0,0,0.02)',
            border: '1px dashed rgba(0,0,0,0.15)',
            width: 'fit-content',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={imagePreviewUrl}
            alt="Upload Preview"
            sx={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          <Box>
            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ display: 'block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedImage.name}
            </Typography>
            <Button
              size="small"
              color="error"
              onClick={handleClearImage}
              sx={{ mt: 0.5, fontSize: '0.65rem', fontWeight: 800 }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      )}

      {/* ── Audio Preview Area (if recorded) ── */}
      {recordedAudio && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            mb: 1.5,
            borderRadius: '16px',
            bgcolor: 'rgba(0,0,0,0.02)',
            border: '1px dashed rgba(0,0,0,0.15)',
            width: 'fit-content',
          }}
        >
          <IconButton onClick={togglePlayPreview} size="small" sx={{ bgcolor: accent, color: 'white', '&:hover': { bgcolor: accent } }}>
            {isPlayingPreview ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
          </IconButton>
          <Box>
            <Typography variant="caption" fontWeight={800} color="text.secondary">
              Voice note preview ({formatRecordingTime(recordingTime || 0)})
            </Typography>
            <Button
              size="small"
              color="error"
              onClick={discardAudio}
              sx={{ display: 'block', mt: 0.5, fontSize: '0.65rem', fontWeight: 800, p: 0 }}
            >
              Discard
            </Button>
          </Box>
        </Box>
      )}

      {/* ── Input Box & Send Button ── */}
      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {recording ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              bgcolor: '#FFF5F5',
              border: '1.5px solid #FEB2B2',
              borderRadius: '50px',
              px: 3,
              py: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  bgcolor: '#E53E3E',
                  borderRadius: '50%',
                  animation: 'blink 1s infinite',
                  '@keyframes blink': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                    '100%': { opacity: 1 }
                  }
                }}
              />
              <Typography variant="body2" fontWeight={800} color="#C53030" sx={{ fontFamily: '"Nunito", sans-serif' }}>
                Recording voice note... {formatRecordingTime(recordingTime)}
              </Typography>
            </Box>
            <IconButton onClick={stopRecording} sx={{ color: '#E53E3E', p: 0.5 }}>
              <StopIcon />
            </IconButton>
          </Box>
        ) : (
          <>
            <input
              accept="image/png, image/jpeg, image/jpg, image/webp"
              style={{ display: 'none' }}
              id="chat-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="chat-image-upload">
              <IconButton
                component="span"
                disabled={sending}
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderColor: accent,
                  },
                }}
              >
                <AttachIcon sx={{ color: selectedImage ? accent : 'text.secondary' }} />
              </IconButton>
            </label>

            <IconButton
              onClick={startRecording}
              disabled={sending}
              sx={{
                bgcolor: '#FFFFFF',
                border: '1.5px solid rgba(0,0,0,0.1)',
                p: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderColor: accent,
                },
              }}
            >
              <MicIcon sx={{ color: recordedAudio ? accent : 'text.secondary' }} />
            </IconButton>

            <TextField
              fullWidth
              placeholder="Type your message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={sending}
              autoComplete="off"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px',
                  bgcolor: '#FFFFFF',
                  px: 3,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                  '&:hover fieldset': { borderColor: accent },
                  '&.Mui-focused fieldset': { borderColor: accent },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={(!text.trim() && !selectedImage && !recordedAudio) || sending}
              sx={{
                borderRadius: '50px',
                px: 4,
                bgcolor: accent,
                boxShadow: `0 4px 14px ${accent}40`,
                '&:hover': {
                  bgcolor: accent,
                  boxShadow: `0 6px 20px ${accent}55`,
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(0,0,0,0.12)',
                },
              }}
            >
              {sending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            </Button>
          </>
        )}
      </Box>

      {/* ── Context Menu for Message Deletion ── */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleDeleteMe}>Delete for me</MenuItem>
        {contextMenu &&
          (contextMenu.message?.senderId?._id || contextMenu.message?.senderId) === (currentUser?.uid || currentUser?._id) && (
            <MenuItem onClick={handleDeleteEveryone} sx={{ color: 'error.main' }}>
              Delete for everyone
            </MenuItem>
          )}
      </Menu>
    </Box>
  );
};

export default ChatScreen;
