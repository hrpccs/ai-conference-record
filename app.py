from flask import Flask, render_template, request
from processFile import *
from helpers import *
from moviepy.editor import VideoFileClip
import logging
import whisper
import youtube_dl
from deepgram import Deepgram
import os

app = Flask(__name__)
with open('DEEPGRAM_API.env', 'r') as f:
    app.config['DEEPGRAM_API'] = f.read()

whisper_model = whisper.load_model('base')
dg_client = Deepgram(os.environ.get('DEEPGRAM_API'))
prompt = ""
logging.basicConfig(filename='app.log', level=logging.DEBUG)


@app.route('/upload', methods=['POST'])
def upload():
    file = request.json.get('message')
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

def my_hook(d,filename):
    if d['status'] == 'finished':
        filename.append(d['filename'].split("/")[-1])

@app.route('/transcipt/withUrl', methods=['POST'])
def transcriptWithUrl():
    operations = request.json.get('operations')
    tasks = request.json.get('tasks')
    meida_url = request.json.get('media_url')
    # Process the file contents here
    filename = ""
    ydl_opts = {
        'outtmpl': './storage/%(title)s.%(ext)s',
        'progress_hooks': [lambda d: my_hook(d, filename)],
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([meida_url])
    
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
        result = processingFileWithDeepGram(source,dg_client,prompt,tasks)
    return render_template('result.html', result=result)


@app.route('/transcipt/withFile', methods=['POST'])
def transcriptWithFile():
    # operations = request.json.get('operations')
    tasks = request.json.get('tasks')
    file = request.json.get('file')
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
        result = processingFileWithDeepGram(source,dg_client,prompt,tasks)
    return render_template('result.html', result=result)


if __name__ == '__main__':
    promptfile = open("prompt.txt", "r")
    prompt = promptfile.read()
    app.run(debug=True)
