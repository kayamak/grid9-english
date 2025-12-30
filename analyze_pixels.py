from PIL import Image
import collections

def analyze_pixels(path):
    img = Image.open(path).convert("RGBA")
    pixels = list(img.getdata())
    # Count most common pixels
    counts = collections.Counter(pixels)
    print(f"Top 10 pixels in {path}:")
    for color, count in counts.most_common(10):
        print(f"  {color}: {count}")

files = [
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/void_dragon_v2.png",
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/bit_golem.png"
]

for f in files:
    analyze_pixels(f)
