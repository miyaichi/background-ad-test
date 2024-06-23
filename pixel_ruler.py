from PIL import Image, ImageDraw, ImageFont

def create_pixel_ruler(size=100, interval=10):
    # 白い背景の画像を作成
    image = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(image)

    # フォントの設定（システムにインストールされているフォントを使用）
    try:
        font = ImageFont.truetype("arial.ttf", 10)
    except IOError:
        font = ImageFont.load_default()

    # メモリと数字を描画
    for i in range(0, size + 1, interval):
        # 縦線
        draw.line([(i, 0), (i, size)], fill='lightgray', width=1)
        # 横線
        draw.line([(0, i), (size, i)], fill='lightgray', width=1)


    # 境界線を描画
    draw.rectangle([0, 0, size - 1, size - 1], outline='black', width=1)

    return image

# 100x100ピクセルの画像を作成し、10ピクセル間隔でメモリを入れる
ruler = create_pixel_ruler(100, 10)

# 画像を保存
ruler.save('pixel_ruler.png')

print("画像が作成されました: pixel_ruler.png")
