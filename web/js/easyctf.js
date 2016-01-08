var app = angular.module("easyctf", [ "ngRoute" ]);
app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when("/", {
		templateUrl: "pages/home.html",
		controller: "mainController"
	})
	.when("/about", {
		templateUrl: "pages/about.html",
		controller: "mainController"
	})
	.when("/chat", {
		templateUrl: "pages/chat.html",
		controller: "mainController"
	})
	.when("/learn", {
		templateUrl: "pages/learn.html",
		controller: "mainController"
	})
	.when("/login", {
		templateUrl: "pages/login.html",
		controller: "mainController"
	})
	.when("/logout", {
		templateUrl: "pages/blank.html",
		controller: "logoutController"
	})
	.when("/profile", {
		templateUrl: "pages/profile.html",
		controller: "profileController"
	})
	.when("/profile/:username", {
		templateUrl: "pages/profile.html",
		controller: "profileController"
	})
	.when("/register", {
		templateUrl: "pages/register.html",
		controller: "mainController"
	})
	.when("/scoreboard", {
		templateUrl: "pages/scoreboard.html",
		controller: "mainController"
	})
	.when("/settings", {
		templateUrl: "pages/settings.html",
		controller: "mainController"
	})
	.when("/admin/problems", {
		templateUrl: "pages/admin/problems.html",
		controller: "adminProblemsController"
	})
	.otherwise({
		templateUrl: "pages/404.html",
		controller: "mainController"
	});
	$locationProvider.html5Mode(true);
});

app.controller("mainController", ["$scope", "$http", function($scope, $http) {
	$scope.config = { navbar: { } };
	$.get("/api/user/status", function(result) {
		if (result["success"] == 1) {
			$scope.config.navbar.logged_in = result["logged_in"];
			$scope.config.navbar.username = result["username"];
			$scope.config.navbar.admin = result["admin"];
			$scope.$emit("adminStatus");
		} else {
			$scope.config.navbar.logged_in = false;
		}
		$scope.$apply();
	}).fail(function() {
		$scope.config.navbar.logged_in = false;
		$scope.$apply();
	});
}]);

app.controller("logoutController", function() {
	$.get("/api/user/logout", function(result) {
		location.href = "/";
	});
});

app.controller("profileController", ["$controller", "$scope", "$http", "$routeParams", function($controller, $scope, $http, $routeParams) {
	var data = { };
	if ("username" in $routeParams) data["username"] = $routeParams["username"];
	$controller("mainController", { $scope: $scope });
	$.get("/api/user/info", data, function(result) {
		if (result["success"] == 1) {
			$scope.user = result["user"];
		}
		$scope.$apply();
		$(".timeago").timeago();
	});
}]);

app.controller("adminController", ["$controller", "$scope", "$http", function($controller, $scope, $http) {
	$controller("mainController", { $scope: $scope });
	$scope.$on("adminStatus", function() {
		if ($scope.config["navbar"].logged_in != true) {
			location.href = "/login";
			return;
		}
		if ($scope.config["navbar"].admin != true) {
			location.href = "/profile";
			return;
		}
	});
}]);

app.controller("adminProblemsController", ["$controller", "$scope", "$http", function($controller, $scope, $http) {
	$controller("adminController", { $scope: $scope });
	$.get("/api/admin/problems/list", function(result) {
		if (result["success"] == 1) {
			$scope.problems = result["problems"];
		}
		$scope.$apply();
	});
}]);

function display_message(containerId, alertType, message, callback) {
	$("#" + containerId).html("<div class=\"alert alert-" + alertType + "\">" + message + "</div>");
	$("#" + containerId).hide().slideDown("fast", "swing", function() {
		window.setTimeout(function () {
			$("#" + containerId).slideUp("fast", "swing", callback);
		}, message.length * 75);
	});
};

$.fn.serializeObject = function() {
	var a, o;
	o = {};
	a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			return o[this.name].push(this.value || "");
		} else {
			return o[this.name] = this.value || "";
		}
	});
	return o;
};

// register page

var register_form = function() {
	var input = "#register_form input";
	var data = $("#register_form").serializeObject();
	data["csrf_token"] = $.cookie("csrf_token");
	$.post("/api/user/register", data, function(result) {
		if (result["success"] == 1) {
			location.href = "/profile";
		} else {
			display_message("register_msg", "danger", result["message"]);
		}
	}).fail(function(jqXHR, status, error) {
		var result = JSON.parse(jqXHR["responseText"]);
		display_message("register_msg", "danger", "Error " + jqXHR["status"] + ": " + result["message"]);
	});
};

// login page

var login_form = function() {
	var input = "#login_form input";
	var data = $("#login_form").serializeObject();
	data["csrf_token"] = $.cookie("csrf_token");
	$.post("/api/user/login", data, function(result) {
		if (result["success"] == 1) {
			location.href = "/profile";
		} else {
			display_message("login_msg", "danger", result["message"]);
		}
	}).fail(function(jqXHR, status, error) {
		var result = JSON.parse(jqXHR["responseText"]);
		display_message("login_msg", "danger", "Error " + jqXHR["status"] + ": " + result["message"]);
	});
};