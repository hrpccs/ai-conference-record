from flask import Flask, render_template, request
from processFile import *
from helpers import *
from moviepy.editor import VideoFileClip
import openai
import logging
import whisper
from deepgram import Deepgram
import os

app = Flask(__name__)
whisper_model = whisper.load_model('base')
dg_client = Deepgram(os.environ.get('DATABASE_URL'))
prompt = ""
logging.basicConfig(filename='app.log', level=logging.DEBUG)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filename = file.filename
    file.save(f"storage/{filename}")
    # Process the file contents here
    is_audio = is_audio_file(filename)
    is_video = is_video_file(filename)
    if not is_audio and not is_video:
        logging.debug("Not a audio file or video file")
        # TODO : FrontEnd add error message response
        return render_template('index.html', error='Not a audio file or video file')
    if is_video:
        clip = VideoFileClip(f"storage/{filename}")
        audio = clip.audio
        filename = filename.split(".")[0] + ".wav"
        audio.write_audiofile(f"storage/{filename}")
    with open(f"storage/{filename}", "rb") as audio:
        source = {'buffer': audio, 'mimetype' : "audio/wav"}
        result = processingFileWithDeepGram(source,dg_client,prompt)
    return render_template('result.html', result=result)

if __name__ == '__main__':
    promptfile = open("prompt1.txt", "r")
    prompt = promptfile.read()
    app.run(debug=True)
