'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  TextField,
  Stack,
  Grow,
  Menu,
  MenuItem,
} from '@mui/material';
import Typewriter from 'react-typewriter-effect';
import { AccountCircle, Logout, Send } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // GitHub dark theme for code highlighting
import { useRouter } from 'next/navigation';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '@/firebase';
import withAuth from '../protectedRoute';

const typingEffect = (text, setMessages, index = 0) => {
  if (index < text.length) {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      lastMessage.content = text.slice(0, index + 1);
      return updatedMessages;
    });
    setTimeout(() => typingEffect(text, setMessages, index + 1), ); // Adjust typing speed here
  }
};

function BotIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Hybrid, your personal assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputAtBottom, setInputAtBottom] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userUid, setUserUid] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addUserAndPlaceholderMessages = (message, setMessages) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
  };

  const handleServerResponse = async (reader, decoder, setMessages) => {
    let accumulatedText = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      const text = decoder.decode(value, { stream: true });
      accumulatedText += text;
      typingEffect(accumulatedText, setMessages); // Update the messages with typing effect
    }
  };  

  const updateLastMessage = (text, setMessages) => {
    setMessages((prevMessages) => {
      let lastMessage = prevMessages[prevMessages.length - 1];
      let otherMessages = prevMessages.slice(0, prevMessages.length - 1);

      return [
        ...otherMessages,
        { ...lastMessage, content: lastMessage.content + text },
      ];
    });
  };

  const handleError = (setMessages) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'assistant',
        content: "I'm sorry, but I encountered an error. Please try again later.",
      },
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    addUserAndPlaceholderMessages(message, setMessages);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: message }] }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      await handleServerResponse(reader, decoder, setMessages);
    } catch (error) {
      console.error('Error:', error);
      handleError(setMessages);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setInputAtBottom(true);
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserUid(user.uid);
      } else {
        setUserEmail('');
        setUserUid('');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: 'white' }}>
      <AppBar position="static" elevation={0} style={{ backgroundColor: '#121212', color: 'white' }}>
        <Toolbar>
          

          <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
            HybridChatbot
          </Typography>

          <IconButton onClick={handleMenuOpen} sx={{ marginLeft: 'auto' }}>
            <AccountCircle fontSize="large" sx={{ color: '#afafaf' }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#1e1e1e',
                color: 'white',
              },
            }}
          >
            <MenuItem>
              <Typography variant="body2">{userEmail}</Typography>
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <Logout fontSize="small" />
              <Typography variant="body2" sx={{ marginLeft: 1 }}>
                Sign Out
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '55px' }}>
        {!inputAtBottom ? (
          <Container maxWidth="md" style={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" style={{ color: 'white' }} mt="15vh">
             Hi, I&apos;m Hybrid, your intelligent support assistant
            </Typography>
            <Typography variant="h5" paragraph align="center" style={{ color: '#b0b0b0' }}>
            Get instant solutions, personalized support, effortless interactions, proactive guidance, and 24/7 availability - all in one place, with me, Hybrid, your personal assistant.
            </Typography>
            <Box mt={4} display="flex" justifyContent="center">
              <TextField
                variant="outlined"
                autoComplete="off"
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={sendMessage}>
                      <Send style={{ color: 'white' }} />
                    </IconButton>
                  ),
                }}
                fullWidth
                sx={{
                  backgroundColor: '#333',
                  color: 'white',
                  borderRadius: '50px',
                  width: '600px',

                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',

                    '& fieldset': {
                      borderColor: '#555',
                    },
                    '&:hover fieldset': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#aaa',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white',
                  },
                }}
                ref={inputRef}
              />
            </Box>
          </Container>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Container maxWidth="md" sx={{ flexGrow: 1, overflow: 'auto', paddingBottom: '20px' }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    marginY: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}
                >
                  <Grow in timeout={500}>
                    <Box
                      sx={{
                        bgcolor: msg.role === 'user' ?  '#3f3f3f' : '#333',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '12px',
                        maxWidth: '90%',
                        whiteSpace: 'pre-line',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <Box component="pre" className={className} {...props} style={{ margin: 0 }}>
          <Box component="code" className={className} {...props}>
            {children}
          </Box>
        </Box>
      ) : (
        <Box component="code" className={className} {...props} style={{ backgroundColor: '#555' }}>
          {children}
        </Box>
      );
                       },
                        }}
>
                     {msg.content}
                    </ReactMarkdown>
                    </Box>
                  </Grow>
                </Box>
              ))}
              <Box ref={messagesEndRef} />
            </Container>

            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#121212',
                padding: '20px',
              }}
            >
              <Container maxWidth="md">
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    placeholder="Ask me anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={sendMessage}>
                          <Send style={{ color: 'white' }} />
                        </IconButton>
                      ),
                    }}
                    fullWidth
                    sx={{
                      backgroundColor: '#333',
                      color: 'white',
                      borderRadius: '50px',

                      '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',

                        '& fieldset': {
                          borderColor: '#555',
                        },
                        '&:hover fieldset': {
                          borderColor: '#777',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#aaa',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'white',
                      },
                    }}
                    ref={inputRef}
                  />
                </Stack>
              </Container>
            </Box>
          </Box>
        )}
      </main>
    </div>
  );
};

export default withAuth(ChatPage);
