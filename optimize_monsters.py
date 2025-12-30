from PIL import Image, ImageChops

def smart_crop(path):
    img = Image.open(path).convert("RGB")
    # Use a threshold to find the character. 
    # Background is roughly (255, 255, 255)
    # Convert to grayscale and threshold
    gray = img.convert("L")
    # Anything below 250 is "content"
    content_mask = gray.point(lambda p: 255 if p < 250 else 0)
    bbox = content_mask.getbbox()
    
    if bbox:
        # Give a small margin (5%)
        w, h = img.size
        # content size
        cw = bbox[2] - bbox[0]
        ch = bbox[3] - bbox[1]
        
        # Crop
        cropped = img.crop(bbox)
        
        # New square size (max of cw, ch)
        size = max(cw, ch)
        new_img = Image.new("RGB", (size, size), (255, 255, 255))
        # Paste in center
        offset = ((size - cw) // 2, (size - ch) // 2)
        new_img.paste(cropped, offset)
        
        # Resize to 512x512 for consistency
        new_img = new_img.resize((512, 512), Image.LANCZOS)
        
        # Save back
        new_img.save(path, "PNG") # Keep it PNG format
        print(f"Cropped {path} to {bbox}")

files = [
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/void_dragon_v2.png",
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/dragon.png",
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters/bit_golem.png"
]

for f in files:
    smart_crop(f)
