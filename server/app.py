from argparse import ArgumentParser
from flask import Flask

import config
import json
import api

from api.api import api as api_blueprint
from api.user import blueprint as user_blueprint

app = Flask(__name__)
app.secret_key = config.SECRET
app.register_blueprint(api_blueprint)
app.register_blueprint(user_blueprint)

@app.route("/api")
def api_main():
	return json.dumps({ "success": 1, "message": "The API is online." })

if __name__ == "__main__":
	with app.app_context():
		parser = ArgumentParser(description="EasyCTF Server Configuration")
		parser.add_argument("-d", "--debug", action="store_true", help="Run the server in debug mode.", default=False)
		args = parser.parse_args()
		keyword_args, _ = dict(args._get_kwargs()), args._get_args()

		app.debug = keyword_args["debug"]

		app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:i_hate_passwords@localhost/easyctf"
		app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

		from api.models import db
		db.init_app(app)
		db.create_all()

		app.register_blueprint(api.user.blueprint, url_prefix="/api/user")

		app.run(host="0.0.0.0", port=8000)
