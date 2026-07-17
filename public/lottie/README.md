Place 6 Lottie JSON files here: cricket.json, swimming.json, badminton.json,
tennis.json, squash.json, gym.json.

Source from lottiefiles.com — search sport name + "minimal" or "loop".
Target style: dark-background compatible, minimal/geometric, not cartoonish.
See docs/3D.md § Sourcing Lottie Files.

Until a file is added, `LottieScenePlayer` fetches `/lottie/<sport>.json`,
gets a 404, and falls back to a lucide-react icon placeholder automatically —
no code changes needed once the real file is dropped in.
