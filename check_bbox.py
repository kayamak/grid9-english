from PIL import Image, ImageChops

def get_bbox(path):
    img = Image.open(path).convert("RGB")
    # Invert so white becomes black
    bg = Image.new("RGB", img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    return bbox

files = [
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/void_dragon_v2.png",
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/dragon.png",
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/bit_golem.png"
]

for f in files:
    print(f"{f}: {get_bbox(f)}")
