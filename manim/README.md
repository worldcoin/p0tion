# Trusted Setup Video (ManimCE)

This folder contains Manim Community Edition scenes for the "Trusted Setup, Explained" video.

## Render

```bash
manim -pql trusted_setup_video.py Scene01_Groth16Basics
manim -pqm trusted_setup_video.py Scene04_UpdatableMPC
manim -pql -a trusted_setup_video.py
```

## Notes

- If you hit installation issues, run `manim checkhealth`.
- If your system Python is too new for Manim, use a supported version (commonly 3.10-3.12) in a venv.

