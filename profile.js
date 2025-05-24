// Check if user is logged in
async function checkAuth() {
    const user = await getCurrentUser()
    if (!user) {
        window.location.href = 'index.html'
        return
    }
    return user
}

// Load user profile data
async function loadProfile() {
    const user = await checkAuth()
    if (!user) return

    try {
        // Get user profile data
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) throw error

        // Update profile elements
        document.getElementById('profileImage').style.backgroundImage = `url(${profile.profile_picture})`
        document.getElementById('userName').textContent = profile.name
        document.getElementById('userRegion').textContent = profile.region
        document.getElementById('userJobTitle').textContent = profile.job_title
        document.getElementById('userProjects').textContent = profile.projects

    } catch (error) {
        console.error('Error loading profile:', error.message)
        alert('Error loading profile data')
    }
}

// Handle logout
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        window.location.href = 'index.html'
    } catch (error) {
        console.error('Error logging out:', error.message)
        alert('Error logging out')
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load profile data
    loadProfile()

    // Add logout button listener
    const logoutButton = document.getElementById('logoutButton')
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout)
    }
}) 