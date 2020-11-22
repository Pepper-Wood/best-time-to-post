from PIL import Image
from colormath.color_objects import sRGBColor, LabColor
from colormath.color_diff import delta_e_cmc
from colormath.color_conversions import convert_color

def main():
    colors = Image.open('twitterglobal.png').getcolors()
    print("Loaded colors.")
    lab_colors = {}
    for color in colors:
        rgbColor = sRGBColor(color[1][0], color[1][1], color[1][2])
        lab_colors[(convert_color(rgbColor, LabColor))] = 0
    print("Assembled LAB colors.")

    while True:
        for color1 in lab_colors:
            for color2 in lab_colors:
                if color1 == color2:
                    continue
                delta_e = delta_e_cmc(color1, color2)
                if delta_e <= 2:
                    # Colors are similar
                    lab_colors[color1] += 1
        # Remove the color with the highest number of collisions
        key_to_delete = max(lab_colors, key=lambda k: lab_colors[k])
        if lab_colors[key_to_delete] == 0:
            return lab_colors
        del lab_colors[key_to_delete]
        print(f"Finished iteration. Current color count: {len(lab_colors)}")

if __name__ == "__main__":
    lab_colors = main()
    print("-"*30)
    for lab_color in lab_colors:
        rgb_color = convert_color(lab_color, sRGBColor)
        print(rgb_color.get_rgb_hex())
