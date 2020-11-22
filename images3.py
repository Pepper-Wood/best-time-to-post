from colorthief import ColorThief

def rgb_to_hex(rgb_array):
    hexcode = ""
    for c in rgb_array:
        hexstr = str(hex(c))
        hexcode += hexstr.replace("0x", "").zfill(2)
    return hexcode

color_thief = ColorThief('twitterglobal.png')

palette = color_thief.get_palette(color_count=20)


for color in palette:
    hexcode = rgb_to_hex([color[0], color[1], color[2]])
    print(f"<div class='square' style='background-color:#{hexcode}'></div>")
