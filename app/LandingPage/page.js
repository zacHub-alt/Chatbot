'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Box, Container, Grid, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Assistant from '@mui/icons-material/Assistant';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';

// Custom SVG Icons
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

function FeatureCard({ icon, title, description }) {
	return (
		<Grid item xs={12} sm={6} lg={4}>
			<Card sx={{
				textAlign: 'center',
				boxShadow: 5,
				background: 'linear-gradient(145deg, #2a2a2a, #1c1c1c)',
				borderRadius: 4,
				transition: 'transform 0.3s ease',
				'&:hover': { transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)' }
			}}>
				<CardContent sx={{ p: 2 }}>
					{icon}
					<Typography variant="h6" fontWeight="bold" color="white" sx={{ mb: 2 }}>{title}</Typography>
					<Typography variant="body1" color="white">
						{description}
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}

const features = [
	{
		icon: <Assistant style={{ fontSize: 30, marginBottom: 10, color: 'white' }} />,
		title: 'Talk to Me',
		description: 'Have a conversation with Hybrid, your AI friend, and get personalized support that feels effortless.'
	},
	{
		icon: <SearchIcon style={{ fontSize: 30, marginBottom: 10, color: 'white' }} />,
		title: 'Instant Insights',
		description: 'Tap into my vast knowledge base and get swift answers to your burning questions.'
	},
	{
		icon: <AutoAwesome style={{ fontSize: 30, marginBottom: 10, color: 'white' }} />,
		title: 'Your Personal Support Buddy',
		description: 'Let me, Hybrid, help you navigate solutions and provide guidance tailored to your needs.'
	}
];

const LandingPage = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const router = useRouter();

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSignIn = () => {
		router.push('/signin');
	};

	const handleSignUp = () => {
		router.push('/signup');
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<AppBar position="static" sx={{ backgroundColor: '#121212' }}>
				<Toolbar>
					<Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold', color: 'white' }}>HybridChatbot</Typography>
					<Box sx={{ flexGrow: 1 }} />
					{isMobile ? (
						<>
							<IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
								<MenuIcon />
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								sx={{ '& .MuiPaper-root': { backgroundColor: '#121212' } }}
							>
								<MenuItem onClick={handleSignIn} component="a" href="#" sx={{ color: 'white' }}>Sign In</MenuItem>
								<MenuItem onClick={handleSignUp} component="a" href="#" sx={{ color: 'white' }}>Sign Up</MenuItem>
							</Menu>
						</>
					) : (
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Button
								onClick={handleSignIn}
								sx={{
									mr: 2,
									color: '#9a9a9a',
									textTransform: 'none',
									'&:hover': {
										color: '#ffffff'
									}
								}}
								href="#"
							>
								Sign In
							</Button>
							<Button
								onClick={handleSignUp}
								variant="outlined"
								sx={{
									borderColor: '#9a9a9a',
									color: '#121212',
									textTransform: 'none',
									backgroundColor: '#ffffff',
									'&:hover': {
										color: 'white',
										borderColor: '#121212',
										backgroundColor: '#313131'
									}
								}}
								href="#"
							>
								Sign Up
							</Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			{/* Hero Section */}
			<Box
				component="main"
				sx={{
					flex: 1,
					background: '#121212',
					color: 'white',
					textAlign: 'center',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					minHeight: '100vh',
					py: { xs: 10, md: 15 },
				}}
			>
				<Container maxWidth="md">
					<Typography variant="h3" fontWeight="bold" gutterBottom>
						HybridChatbot: Your Personal Customer Service Assistant
					</Typography>
					<Typography variant="h6" sx={{ mb: 4 }}>
						"Meet Hybrid, your AI-powered companion for effortless customer service. Get instant answers, personalized support, and seamless interactions &mdash; all in one conversation."
					</Typography>
					<Button
						onClick={handleSignUp}
						variant="contained"
						size="large"
						sx={{
							textTransform: 'none',
							color: '#121212',
							border: '2px solid white',
							background: 'white',
							'&:hover': {
								background: 'var(--primary)', // Keep the background color unchanged
								border: '2px solid #121212', // Change only the border color
								color: 'white'
							},
						}}
					>
						Get Started
					</Button>
				</Container>
			</Box>

			{/* AI Capabilities Section */}
			<Box sx={{ py: 10, background: '#1e1e1e', color: 'white', minHeight: '100vh' }}>
				<Container maxWidth="lg">
					<Typography color="white" variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
						HybridChatbot: Your Ultimate Support Companion
					</Typography>
					<Box sx={{ mb: 6 }} /> {/* Additional space between heading and cards */}
					<Grid container spacing={4}>
						{features.map((feature, index) => (
							<FeatureCard key={index} {...feature} />
						))}
					</Grid>
				</Container>
			</Box>
			
			{/* Product Contributors Section */}
			<Box sx={{ py: 5, background: '#121212', color: 'white', height: 'auto' }}>
				<Container maxWidth="md">
					<Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
						Product Contributors
					</Typography>
					<Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
						This project was made possible due to the contribution from my teammates Utta and Sharif.
					</Typography>
					{/* Add team member details or links here */}
				</Container>
			</Box>

			{/* Footer Section */}
			<Box
				sx={{
					background: '#0d0d0d',
					color: 'white',
					p: 2,
					textAlign: 'center',
					mb: 2,
					position: 'relative',
					bottom: 0,
					width: '100%',
				}}
			>
				<Typography variant="body2">
					&copy; 2024 HybridChatbot. All rights reserved.
				</Typography>
			</Box>
		</Box>
	);
};

export default LandingPage;
