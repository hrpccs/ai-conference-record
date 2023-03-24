from flask import Flask, render_template, request
from processFile import *
from helpers import *
import openai
import logging
import whisper

app = Flask(__name__)
whisper_model = whisper.load_model('base')
prompt = ""
logging.basicConfig(filename='app.log', level=logging.DEBUG)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
async def upload():
    file = request.files['file']
    filename = file.filename
    file_contents = file.read()
    # Process the file contents here
    is_audio = is_audio_file(filename)
    is_video = is_video_file(filename)
    if not is_audio and not is_video:
        return render_template('index.html', error='Not a audio file or video file')
    # TODO : add wait prompt 
    result = await processingFile(file_contents,is_video,whisper_model,prompt)
    return render_template('result.html', result=file_contents)

if __name__ == '__main__':
    promptfile = open("prompt.txt", "r")
    prompt = promptfile.read()
    app.run(debug=True)
