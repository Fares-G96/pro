// Function to generate a random number between min and max values
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to animate the bubbles in the banner
function animateBubbles() {
    // Get all bubble elements
    const bubbles = document.querySelectorAll('.bubble');
    
    // Apply animation to each bubble
    bubbles.forEach(bubble => {
        // Set initial random position
        const startX = getRandomNumber(-100, window.innerWidth);
        const startY = getRandomNumber(-100, window.innerHeight);
        
        // Set random movement speed for each bubble
        const speedX = getRandomNumber(-2, 2);
        const speedY = getRandomNumber(-2, 2);
        
        // Set initial position
        bubble.style.left = `${startX}px`;
        bubble.style.top = `${startY}px`;
        
        // Function to animate individual bubble
        function moveBubble() {
            // Get current position
            const currentX = parseFloat(bubble.style.left);
            const currentY = parseFloat(bubble.style.top);
            
            // Calculate new position
            let newX = currentX + speedX;
            let newY = currentY + speedY;
            
            // Bounce off edges of the screen
            if (newX < -100 || newX > window.innerWidth) {
                newX = getRandomNumber(-100, window.innerWidth);
            }
            if (newY < -100 || newY > window.innerHeight) {
                newY = getRandomNumber(-100, window.innerHeight);
            }
            
            // Update bubble position
            bubble.style.left = `${newX}px`;
            bubble.style.top = `${newY}px`;
            
            // Continue animation
            requestAnimationFrame(moveBubble);
        }
        
        // Start animation for this bubble
        moveBubble();
    });
}

// Function to create typing animation effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = ''; // Clear the text
    
    // Function to type each character
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Start typing animation
    type();
}

// Start all animations when page loads
window.addEventListener('load', () => {
    // Start bubble animations
    animateBubbles();
    
    // Start typing animation for name
    const nameElement = document.querySelector('.name');
    typeWriter(nameElement, 'Fares Abdel Sattar', 150);
});

// Supabase configuration
const SUPABASE_URL = 'https://jmhqybbiyxkjxqihaixd.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHF5YmJpeXhranhxaWhhaXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDQxMDAsImV4cCI6MjA2MzYyMDEwMH0.upze6J9PP7McXnsWZgewPTfB1iA3sX8zOhylmTlIJ-w'; // Replace with your Supabase public key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Get form and profile card elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const profileCard = document.getElementById('profile-card');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');

// Function to show the login form and hide others
function showLoginForm() {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    profileCard.style.display = 'none';
}

// Function to show the sign-up form and hide others
function showSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    profileCard.style.display = 'none';
}

// Function to show the profile card and hide forms
function showProfileCard() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    profileCard.style.display = 'block'; // Use 'block' for profile card layout
}

// Initial check for user session and display appropriate view
async function checkUserSession() {
    const { data, error } = await supabase.auth.getSession();

    if (data.session) {
        // User is logged in, show profile card
        fetchUserProfile(data.session.user.id);
    } else {
        // No user session, show login form
        showLoginForm();
    }
}

// Add event listeners to switch between forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Call checkUserSession on page load
window.addEventListener('load', checkUserSession);

// Handle Sign-up
const signupButton = document.getElementById('signup-button');

signupButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const nameInput = document.getElementById('signup-name');
    const jobInput = document.getElementById('signup-job');
    const locationInput = document.getElementById('signup-location');
    const projectsInput = document.getElementById('signup-projects');
    const avatarInput = document.getElementById('signup-avatar');

    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;
    const job = jobInput.value;
    const location = locationInput.value;
    const projects = parseInt(projectsInput.value, 10);
    const avatarFile = avatarInput.files[0];

    // Basic validation
    if (!email || !password || !name || !job || !location || isNaN(projects) || !avatarFile) {
        alert('Please fill in all fields and select an avatar.');
        return;
    }

    // Supabase Sign-up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        alert(authError.message);
        return;
    }

    const user = authData.user;
    let avatarUrl = null;

    // Upload avatar to Supabase Storage
    if (avatarFile && user) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars') // Replace 'avatars' with your storage bucket name
            .upload(filePath, avatarFile);

        if (uploadError) {
            console.error('Error uploading avatar:', uploadError.message);
            // Continue without avatar URL if upload fails, or handle as needed
        } else {
            // Get the public URL of the uploaded file
            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);
            avatarUrl = publicUrlData.publicUrl;
        }
    }

    // Insert user profile data into 'profiles' table
    if (user) {
        const { error: profileError } = await supabase
            .from('profiles') // Replace 'profiles' with your table name
            .insert([
                {
                    id: user.id,
                    name: name,
                    job: job,
                    location: location,
                    projects: projects,
                    avatar_url: avatarUrl,
                },
            ]);

        if (profileError) {
            console.error('Error saving profile data:', profileError.message);
            // Handle profile saving error, maybe delete the user created in auth?
        } else {
            alert('Sign up successful! Please log in.');
            showLoginForm(); // Redirect to login after successful sign-up
        }
    }
});

// Handle Login
const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const email = emailInput.value;
    const password = passwordInput.value;

    // Basic validation
    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }

    // Supabase Login
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert(error.message);
    } else {
        // Login successful, fetch and display profile
        fetchUserProfile(data.user.id);
    }
});

// Function to fetch user profile data and display it
async function fetchUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles') // Replace 'profiles' with your table name
        .select('name, job, location, projects, avatar_url')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error.message);
        // Handle error, maybe show a message to the user
    } else if (data) {
        // Profile data fetched successfully, update the profile card
        const nameElement = document.querySelector('#profile-card .name');
        const locationElement = document.querySelector('#profile-card .location');
        const titleElement = document.querySelector('#profile-card .title');
        const projectsElement = document.querySelector('#profile-card .stat-number');
        const avatarElement = document.querySelector('#profile-card .profile-img');

        // Display the fetched name
        typeWriter(nameElement, data.name || '', 150);

        locationElement.textContent = data.location || '';
        titleElement.textContent = data.job || '';
        projectsElement.textContent = data.projects !== null ? data.projects : '';

        if (data.avatar_url) {
            avatarElement.style.backgroundImage = `url(${data.avatar_url})`;
        } else {
             // Set a default avatar or clear the background image
             avatarElement.style.backgroundImage = 'none';
        }

        showProfileCard(); // Show the profile card after data is loaded
    }
}

// Handle Logout
const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error logging out:', error.message);
    } else {
        // Logout successful, show login form
        showLoginForm();
        // Optionally clear the profile card data
        document.querySelector('#profile-card .name').textContent = '';
        document.querySelector('#profile-card .location').textContent = '';
        document.querySelector('#profile-card .title').textContent = '';
        document.querySelector('#profile-card .stat-number').textContent = '';
        document.querySelector('#profile-card .profile-img').style.backgroundImage = 'none';
    }
}); 
