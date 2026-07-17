Place `gsc-hero.mp4` here. Target size < 8MB. See `docs/3D.md` § Video Hero for the ffmpeg compress command.

```bash
curl -o public/videos/gsc-hero.mp4 https://www.gsc.in/public/user/images/GSC.mp4
ffmpeg -i gsc-hero.mp4 -vcodec h264 -acodec aac -crf 28 -vf scale=1920:-1 gsc-hero-compressed.mp4
```
