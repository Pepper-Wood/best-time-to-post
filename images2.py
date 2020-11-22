import colorgram

def rgb_to_hex(rgb_array):
    hexcode = ""
    for c in rgb_array:
        hexstr = str(hex(c))
        hexcode += hexstr.replace("0x", "").zfill(2)
    return hexcode

# Extract 6 colors from an image.
colors = colorgram.extract('twitterglobal.png', 20)

for color in colors:
    hexcode = rgb_to_hex([color.rgb[0], color.rgb[1], color.rgb[2]])
    print(f"<div class='square' style='background-color:#{hexcode}'></div>")
