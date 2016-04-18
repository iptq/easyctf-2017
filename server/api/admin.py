from flask import Blueprint, jsonify
from decorators import admins_only, api_wrapper
from models import db, Problems, Files
from schemas import verify_to_schema, check

import settings

import cPickle as pickle

blueprint = Blueprint("admin", __name__)

@blueprint.route("/problems/list", methods=["GET"])
@api_wrapper
@admins_only
def problem_data():
	problems = Problems.query.order_by(Problems.value).all()
	problems_return = [ ]
	for problem in problems:
		problems_return.append({
			"pid": problem.pid,
			"title": problem.title,
			"category": problem.category,
			"description": problem.description,
			"hint": problem.hint,
			"value": problem.value,
			"threshold": problem.threshold,
			"weightmap": problem.weightmap,
			"grader_contents": open(problem.grader, "r").read(),
			"bonus": problem.bonus
		})
	problems_return.sort(key=lambda prob: prob["value"])
	return { "success": 1, "problems": problems_return }

@blueprint.route("/settings", methods=["GET"])
@api_wrapper
@admins_only
def settings_data():
	# data = settings.get_all()
	settings_return = {}
	settings_return["ctf_begin"] = settings.get("ctf_begin")
	settings_return["ctf_end"] = settings.get("ctf_end")
	return { "success": 1, "settings": settings_return }

"""
@blueprint.route("/problems/submit", methods=["POST"])
@api_wrapper
@admins_only
def problem_submit():
	params = utils.flat_multi(request.form)
	verify_to_schema(UserSchema, params)

	title = params.get("title")

ProblemSubmissionSchema = Schema({
	Required("title"): check(
		([str, Length(min=4, max=64)], "The title should be between 4 and 64 characters long."),
	),
}, extra=True)
"""
