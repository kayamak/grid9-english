from PIL import Image

def check_corner(path):
    img = Image.open(path).convert("RGB")
    data = img.getpixel((0,0))
    print(f"{path} at (0,0): {data}")

files = [
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/void_dragon_v2.png",
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/dragon.png",
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/bit_golem.png"
]

for f in files:
    check_corner(f)
