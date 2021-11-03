import json
import os

from flask import jsonify, request, Flask

app = Flask(__name__, static_folder='../build', static_url_path='/')
here = os.path.dirname(__file__)
app.config['data'] = os.path.join(here, 'data')


def createBGCJson(dataset, comparison):
    BGCfiles = [f.path for f in
                os.scandir(os.path.join(app.config['data'], dataset, comparison, 'final_results', 'bgcs'))]
    BGCobject = {}
    for filePath in BGCfiles:
        with open(filePath) as f:
            data = json.load(f)
            BGCobject[os.path.basename(filePath)] = data
    return BGCobject


@app.route('/api/BGCs', methods=['GET'])
def get_BGCs():
    dataset = request.args.get('dataset')
    comparison = request.args.get('comparison')
    return createBGCJson(dataset, comparison)


@app.route('/api/comparisons', methods=['GET'])
def get_comparisons():
    dataset = request.args.get('dataset')
    subfolders = [f.path for f in os.scandir(os.path.join(app.config['data'], dataset)) if f.is_dir()]
    filteredFolders = []
    for subfolder in subfolders:
        basename = os.path.basename(subfolder)
        if basename != 'combined':
            filteredFolders.append(basename)
    return jsonify(filteredFolders)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(host=os.getenv('IP', '0.0.0.0'),
            port=int(os.getenv('PORT', 4444)))
