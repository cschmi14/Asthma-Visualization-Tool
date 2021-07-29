import os
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
from boto.s3.connection import S3Connection

#s3 = S3Connection('MONGODB_URI', 'mongodb+srv://user:asthmadatapass@cluster0.6mmas.mongodb.net/asthma?retryWrites=true&w=majority')

app = Flask(__name__)

MONGODB_HOST = 'mongodb+srv://user:asthmadatapass@cluster0.6mmas.mongodb.net/asthma?retryWrites=true&w=majority'
DBS_NAME = 'asthma'
COLLECTION_NAME = 'projects'
FIELDS = {'Year': True, 'State_Name': True, 'Num_Cases': True, 'Percent_Cases': True, "Income": True, '_id': False}

@app.route("/")
def index():
    return render_template("index.html")
#os.getenv("MONGODB_URI"), 
@app.route("/asthma/projects")
def asthma_projects():
    connection = MongoClient(os.getenv("MONGODB_URI"))
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)