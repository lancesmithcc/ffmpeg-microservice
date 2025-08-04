# FFmpeg Microservice

A serverless microservice for mixing audio files using FFmpeg. This service combines voice recordings with background music, applying audio processing effects like delays, volume adjustments, and fades.

## Features

- **Audio Mixing**: Combines voice and background audio files
- **Audio Processing**: Applies delays, volume adjustments, and fade effects
- **Serverless**: Deployed on Netlify Functions
- **Base64 Response**: Returns processed audio as base64-encoded data

## Architecture

This microservice is built as a Netlify Function that:
1. Accepts POST requests with voice and background audio URLs
2. Downloads the audio files
3. Processes them using FFmpeg with custom filters
4. Returns the mixed audio as base64-encoded data

## API Usage

### Endpoint
```
POST /functions/mix-audio
```

### Request Body
```json
{
  "voice_url": "https://example.com/voice.mp3",
  "background_url": "https://example.com/background.mp3"
}
```

### Response
- **Success (200)**: Base64-encoded audio data with `Content-Type: audio/mpeg`
- **Error (400)**: Missing audio URLs
- **Error (405)**: Method not allowed
- **Error (500)**: Processing error

## Audio Processing

The service applies the following audio effects:

1. **Voice Delay**: 10-second delay on voice track
2. **Background Volume**: -12dB volume reduction
3. **Background Fades**: 10-second fade-in and fade-out
4. **Audio Mixing**: Combines tracks with dropout transition

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Testing Locally
```bash
# Start Netlify dev server
netlify dev
```

## Deployment

This service is configured for deployment on Netlify:

1. Connect your repository to Netlify
2. The `netlify.toml` file configures the functions directory
3. Deploy automatically on push to main branch

## Dependencies

- `@ffmpeg-installer/ffmpeg`: FFmpeg binary for audio processing
- `fluent-ffmpeg`: Node.js wrapper for FFmpeg

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub. 