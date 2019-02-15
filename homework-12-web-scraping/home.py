from flask import Flask, render_template
from flask_pymongo import PyMongo
from scraping.mission_to_mars import outputData

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/mars_db'
mongo = PyMongo(app)

# homepage
@app.route('/')
def index():
    return render_template('home.html')

# scrape data page
@app.route('/scrape')
def data():
    data = outputData()
    return render_template('scrape.html', data = data)

# gallery image page
@app.route('/gallery')
def gallery():
    img_list = mongo.db.Hemispheres.find()
    return render_template('gallery.html', img_list=img_list)

if(__name__ == '__main__'):
    app.run(debug = True)