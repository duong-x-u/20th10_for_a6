from flask import Flask, render_template, jsonify
from whitenoise import WhiteNoise
import os
import random

app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app)

# Danh sách lời chúc (bạn có thể thêm nhiều hơn)
WISHES = [
    "Chúc các bạn nữ luôn xinh đẹp, rạng rỡ và tràn đầy năng lượng! 🌸",
    "20/10 - Ngày của những bông hoa đẹp nhất! Chúc các bạn luôn hạnh phúc! 💐",
    "Chúc các chị em luôn vui vẻ, thành công và may mắn nhe! 🌺",
    "Gửi đến các Sò nữ những lời chúc tốt đẹp nhất nhân ngày 20/10! 🌷",
    "Chúc các bạn nữ luôn tự tin, mạnh mẽ và tỏa sáng! ✨",
    "20/10 - Chúc các bạn nữ trong lớp luôn xinh đẹp và thành công rực rỡ! 🌹",
    "Chúc các bạn nữ một ngày 20/10 thật ý nghĩa và đáng nhớ! 🎀",
    "Chúc các bạn luôn là những bông hoa đẹp nhất trong vườn đời! 🌼",
    "Gửi đến các bạn nữ lời chúc ngọt ngào như tiếng cười của các bạn! 💖",
    "20/10 - Chúc các bạn Sò nữ luôn vui vẻ, yêu đời và đạt được mọi ước mơ! 🌟",
    "Chúc các bạn nữ luôn được yêu thương, trân trọng và che chở! 💝",
    "Chúc các cô gái của lớp ta luôn rạng ngời và hạnh phúc! 🎉",
    "Chúc các bạn nữ nhà Sò A6 luôn thành công nhó!!!!!"
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/photos')
def get_photos():
    """Lấy danh sách ảnh từ thư mục assets/photos"""
    photos_dir = os.path.join('static', 'assets', 'photos')
    
    # Tạo thư mục nếu chưa tồn tại
    if not os.path.exists(photos_dir):
        os.makedirs(photos_dir)
    
    # Lấy danh sách file ảnh
    photo_files = []
    if os.path.exists(photos_dir):
        photo_files = [f for f in os.listdir(photos_dir) 
                      if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))]
    
    # Trả về đường dẫn tương đối
    photos = [f'/static/assets/photos/{photo}' for photo in photo_files]
    
    return jsonify({'photos': photos})

@app.route('/api/wish')
def get_random_wish():
    """Lấy một lời chúc ngẫu nhiên"""
    wish = random.choice(WISHES)
    return jsonify({'wish': wish})

@app.route('/api/music')
def get_music():
    """Lấy file nhạc từ thư mục assets/musics"""
    musics_dir = os.path.join('static', 'assets', 'musics')
    
    # Tạo thư mục nếu chưa tồn tại
    if not os.path.exists(musics_dir):
        os.makedirs(musics_dir)
    
    # Lấy file nhạc đầu tiên (hoặc random nếu có nhiều)
    music_files = []
    if os.path.exists(musics_dir):
        music_files = [f for f in os.listdir(musics_dir) 
                      if f.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a'))]
    
    if music_files:
        music = f'/static/assets/musics/{music_files[0]}'
        return jsonify({'music': music})
    else:
        return jsonify({'music': None})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)