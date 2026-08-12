from pathlib import Path
import sys

from PIL import Image


source = Path(sys.argv[1])
destination = Path(sys.argv[2])
destination.mkdir(parents=True, exist_ok=True)
frames = sorted(source.glob("frame_*.png"))

for index, frame in enumerate(frames, 1):
    with Image.open(frame) as image:
        image.save(
            destination / f"{frame.stem}.webp",
            "WEBP",
            quality=86,
            method=6,
        )
    if index % 50 == 0 or index == len(frames):
        print(index, "/", len(frames), flush=True)
