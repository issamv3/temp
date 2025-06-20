
const https = require('https');
const fs = require('fs');
const path = require('path');

const videoUrl = 'https://github.com/issamv3/Jake-boy-v2/raw/refs/heads/main/anime.mp4';
const outputPath = 'anime.mp4';

function downloadVideo(url, outputPath) {
  console.log('بدء تحميل الفيديو...');
  
  const file = fs.createWriteStream(outputPath);
  
  https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      return downloadVideo(response.headers.location, outputPath);
    }
    
    if (response.statusCode !== 200) {
      console.error(`خطأ في التحميل: ${response.statusCode}`);
      return;
    }
    
    const totalSize = parseInt(response.headers['content-length'], 10);
    let downloadedSize = 0;
    
    response.on('data', (chunk) => {
      downloadedSize += chunk.length;
      const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
      process.stdout.write(`\rجاري التحميل: ${progress}%`);
    });
    
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log('\nتم تحميل الفيديو بنجاح في ملف anime.mp4');
    });
    
  }).on('error', (err) => {
    console.error('خطأ في التحميل:', err.message);
    fs.unlink(outputPath, () => {});
  });
}
downloadVideo(videoUrl, outputPath);
