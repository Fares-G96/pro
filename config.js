// Supabase configuration
const supabaseUrl = 'https://jmhqybbiyxkjxqihaixd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHF5YmJpeXhranhxaWhhaXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDQxMDAsImV4cCI6MjA2MzYyMDEwMH0.upze6J9PP7McXnsWZgewPTfB1iA3sX8zOhylmTlIJ-w'

// Initialize Supabase client with proper configuration
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage
    }
})

// Helper function to get the current session
async function getCurrentSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
    } catch (error) {
        console.error('Error getting session:', error.message)
        return null
    }
}

// Helper function to get the current user
async function getCurrentUser() {
    try {
        const session = await getCurrentSession()
        if (!session) return null
        return session.user
    } catch (error) {
        console.error('Error getting user:', error.message)
        return null
    }
} 