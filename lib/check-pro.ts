// Utility function to check if user is Pro
export async function checkProStatus(): Promise<boolean> {
  try {
    // Get user info from cookie
    if (typeof window === 'undefined') return false;
    
    const cookies = document.cookie.split(';');
    const googleUserCookie = cookies.find(c => c.trim().startsWith('google_user='));
    
    if (!googleUserCookie) return false;
    
    let userInfo;
    try {
      userInfo = JSON.parse(decodeURIComponent(googleUserCookie.split('=')[1]));
    } catch {
      return false;
    }

    if (!userInfo?.id && !userInfo?.email) return false;

    // Check Pro status via API
    const response = await fetch('/api/check-pro-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userInfo.id,
        email: userInfo.email,
      }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.isPro === true;
  } catch (error) {
    console.error('Error checking Pro status:', error);
    return false;
  }
}

