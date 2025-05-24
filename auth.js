// Check if user is logged in
async function checkAuth() {
    const user = await getCurrentUser()
    if (user) {
        window.location.href = 'profile.html'
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')
    const region = formData.get('region')
    const jobTitle = formData.get('jobTitle')
    const projects = formData.get('projects')
    const profilePicture = formData.get('profilePicture')

    try {
        // First, register the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    region,
                    job_title: jobTitle,
                    projects
                }
            }
        })

        if (authError) throw authError

        // Wait a moment to ensure the user is created
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Upload profile picture
        const fileExt = profilePicture.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(fileName, profilePicture)

        if (uploadError) throw uploadError

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(fileName)

        // Store user profile data
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert([
                {
                    id: authData.user.id,
                    name,
                    region,
                    job_title: jobTitle,
                    projects,
                    profile_picture: publicUrl,
                }
            ])

        if (profileError) throw profileError

        // Redirect to login page
        window.location.href = 'index.html'
    } catch (error) {
        console.error('Registration error:', error)
        alert(error.message)
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        // Redirect to profile page
        window.location.href = 'profile.html'
    } catch (error) {
        console.error('Login error:', error)
        alert(error.message)
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm')
    const loginForm = document.getElementById('loginForm')

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister)
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin)
    }

    // Check if user is already logged in
    checkAuth()
}) 