from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    file_contents = file.read()
    # Process the file contents here
    return render_template('result.html', result=file_contents)

if __name__ == '__main__':
    app.run(debug=True)
