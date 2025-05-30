
interface DetectionResult {
  id: string;
  type: 'thief' | 'person';
  confidence: number;
  timestamp: Date;
  videoPath?: string;
}

interface UploadProgress {
  percentage: number;
  stage: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    // You'll need to update this to your Flask backend URL
    this.baseURL = 'http://localhost:5000';
  }

  async uploadVideo(file: File, onProgress: (progress: UploadProgress) => void): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 50); // Upload is 50% of total
          onProgress({ percentage, stage: 'Uploading video...' });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          onProgress({ percentage: 100, stage: 'Processing complete!' });
          resolve(xhr.responseURL);
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      // Simulate processing stages
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 3) {
          onProgress({ percentage: 75, stage: 'Analyzing video for threats...' });
        }
      });

      xhr.open('POST', `${this.baseURL}/upload`);
      xhr.send(formData);
    });
  }

  // WebSocket connection for live notifications
  connectToNotifications(onNotification: (notification: any) => void) {
    // You would implement WebSocket connection here
    // For now, we'll simulate it
    console.log('Connected to notification service');
    return () => console.log('Disconnected from notification service');
  }

  async getLiveStream(): Promise<string> {
    return `${this.baseURL}/live`;
  }
}

export const apiService = new ApiService();
export type { DetectionResult, UploadProgress };
