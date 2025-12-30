import os
from PIL import Image, ImageChops

def smart_crop(path):
    # Open as RGBA to support transparency
    img = Image.open(path).convert("RGBA")
    
    # Convert white-ish pixels to transparent
    datas = img.getdata()
    new_data = []
    for item in datas:
        # item is (r, g, b, a)
        # Threshold: if r, g, b are all high, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    
    # Find bounding box of non-transparent content
    alpha = img.getchannel('A')
    bbox = alpha.getbbox()
    
    if bbox:
        # Crop to the content
        cropped = img.crop(bbox)
        
        cw = bbox[2] - bbox[0]
        ch = bbox[3] - bbox[1]
        
        # New square size (max of cw, ch)
        size = max(cw, ch)
        # Create a new transparent image
        new_img = Image.new("RGBA", (size, size), (255, 255, 255, 0))
        # Paste in center
        offset = ((size - cw) // 2, (size - ch) // 2)
        new_img.paste(cropped, offset)
        
        # Resize to 512x512 for consistency
        new_img = new_img.resize((512, 512), Image.LANCZOS)
        
        # Save back as PNG
        new_img.save(path, "PNG")
        print(f"Processed {path} (transparency + crop)")
    else:
        print(f"No content found in {path}")

# Find all PNGs in monsters, heroes, and items
asset_dirs = [
    "/Users/k1/study/myapp/grid9-english/public/assets/monsters",
    "/Users/k1/study/myapp/grid9-english/public/assets/heroes",
    "/Users/k1/study/myapp/grid9-english/public/assets/items"
]

files = []
for d in asset_dirs:
    if os.path.exists(d):
        for f in os.listdir(d):
            if f.endswith(".png"):
                files.append(os.path.join(d, f))

for f in files:
    smart_crop(f)
