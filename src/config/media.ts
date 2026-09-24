/**
 * Auto-generated Media Assets from Pexels API
 * Project: sylvie-scale
 * Zero attribution clutter on UI (Enterprise Clean Standard)
 */

export interface PhotoAsset {
  id: string;
  url: string;
  alt: string;
  avg_color: string;
}

export interface VideoAsset {
  id: string;
  videoUrl: string;
  posterUrl: string;
  width: number;
  height: number;
}

export interface MediaConfig {
  caseStudyPhoto: PhotoAsset;
  editorialPhotos: PhotoAsset[];
  ambientVideo: VideoAsset;
}

export const mediaConfig: MediaConfig = {
  caseStudyPhoto: {
    "id": "35630647",
    "url": "https://images.pexels.com/photos/35630647/pexels-photo-35630647.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "alt": "Intricate architectural model showcasing a futuristic modern city with unique building designs.",
    "avg_color": "#6A7A79"
},
  editorialPhotos: [
    {
    "id": "35630637",
    "url": "https://images.pexels.com/photos/35630637/pexels-photo-35630637.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "alt": "Close-up view of a futuristic architectural model showcasing urban design elements.",
    "avg_color": "#647D79"
},
    {
    "id": "35630642",
    "url": "https://images.pexels.com/photos/35630642/pexels-photo-35630642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "alt": "Intricate futuristic architectural model showcasing modern design elements and innovative structure.",
    "avg_color": "#3A595C"
},
    {
    "id": "7883875",
    "url": "https://images.pexels.com/photos/7883875/pexels-photo-7883875.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "alt": "Detailed wooden model showcasing the interior layout of a multi-story building with miniature figures.",
    "avg_color": "#8D6E52"
}
  ],
  ambientVideo: {
    "id": "31352191",
    "videoUrl": "https://videos.pexels.com/video-files/31352191/13380469_360_640_24fps.mp4",
    "posterUrl": "https://images.pexels.com/videos/31352191/pexels-photo-31352191.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=630",
    "width": 360,
    "height": 640
}
};
