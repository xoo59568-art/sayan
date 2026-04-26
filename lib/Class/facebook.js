import axios from 'axios';

class Facebook {
  constructor() {
    // ⤷ 𝙱𝚢 𝚈𝚘𝚞𝚛 𝚂𝙰𝙱𝙸𝚁⁷⁷¹⁸ ⤶
    this.apiUrl = "https://social-media-downloader-api-s7.onrender.com/sylove";
  }

  async download(vi) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          url: vi
        }
      });

      const res = response.data;

      if (res.status === "success") {
        return {
          author: "SABIR7718",
          status: 200,
          title: res.title || "No title",
          platform: res.platform,
          data: {
            video: res.video_url
          },
          dev: res.dev
        };
      }

      return {
        author: "SABIR7718",
        status: 400,
        message: "Failed to retrieve video content",
      };

    } catch (error) {
      return {
        author: "SABIR7718",
        status: 500,
        error: error.message,
      };
    }
  }
}

export default Facebook;
