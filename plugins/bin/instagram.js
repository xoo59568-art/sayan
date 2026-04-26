import fetch from 'node-fetch';

/**
 * Diegoson 
 * Updated to use the Social Media Downloader API ⤷ 𝙱𝚢 𝚈𝚘𝚞𝚛 𝚂𝙰𝙱𝙸𝚁⁷⁷¹⁸ ⤶
 */
async function instaSave(url) {
  try {
    const apiUrl = `https://social-media-downloader-api-s7.onrender.com/sylove?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'API request failed');
    }

    const info = data.post_info || {};

    return {
      JPEG: null,
      MP4: data.video_url ? data.video_url[0] : null,
      likes: info.likes || 0,
      comments: null,
      description: info.caption || null,
      profileName: info.owner_username || null,
      fullName: info.owner_fullname || null,
      isVerified: info.is_verified || false
    };
  } catch (error) {
    console.error('Error fetching Instagram content:', error);
    throw error;
  }
}

export default instaSave;
