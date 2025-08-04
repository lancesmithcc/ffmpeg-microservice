const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');
const os = require('os');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { voice_url, background_url } = JSON.parse(event.body);

  if (!voice_url || !background_url) {
    return { statusCode: 400, body: 'Missing audio URLs' };
  }

  const voiceFilePath = path.join(os.tmpdir(), 'voice.mp3');
  const backgroundFilePath = path.join(os.tmpdir(), 'background.mp3');
  const outputFilePath = path.join(os.tmpdir(), 'mixed-audio.mp3');

  try {
    await downloadFile(voice_url, voiceFilePath);
    await downloadFile(background_url, backgroundFilePath);

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(voiceFilePath)
        .input(backgroundFilePath)
        .complexFilter([
          '[0:a]adelay=10000|10000[voice]',
          '[1:a]volume=-12dB,afade=t=in:st=0:d=10,afade=t=out:st=290:d=10[bg]',
          '[voice][bg]amix=inputs=2:duration=first:dropout_transition=1'
        ])
        .output(outputFilePath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    const mixedAudio = fs.readFileSync(outputFilePath).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
      body: mixedAudio,
      isBase64Encoded: true
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Error processing audio' };
  } finally {
    fs.unlinkSync(voiceFilePath);
    fs.unlinkSync(backgroundFilePath);
    fs.unlinkSync(outputFilePath);
  }
};

async function downloadFile(url, dest) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}
