import mimetypes

def is_audio_file(filename):
    mimetype, encoding = mimetypes.guess_type(filename)
    return mimetype and mimetype.startswith('audio/')

def is_video_file(filename):
    mimetype, encoding = mimetypes.guess_type(filename)
    return mimetype and mimetype.startswith('video/')