const express = require('express');

const file_utils = require('./file_utils.js');
const crawler = require('./crawler.js');

var app = express();
var database;
var courses = [];
var loading = [];

function loadDatabase() {
    database = file_utils.readJSONFile('database.json');
}

function saveDatabase() {
    file_utils.saveJSONFile('database.json', database);
}

function loadCourse(id, callback) {
    var ff;
    try {
        console.log("trying to read " + id);
        ff = file_utils.readJSONFile("course_" + id + ".json");
        ff.course = getCourse(id);
        saveCourse(id, ff);
    } catch (e) {
        crawler.loadCourse(id, (data) => {
            if (data != null) {
                data.course = getCourse(id);
                saveCourse(id, data);
                loadCourse(id);
            }
            callback(data);
        });
    }
    if (ff != null && callback != null) {
        callback(ff);
    }
}

function saveCourse(id, data) {
    file_utils.saveJSONFile("course_" + id + ".json", data);
}

function strMatch(str, query) {
    var max = 0;
    for (i = 0; i < str.length - query.length + 1; i++) {
        var pt = 0;
        for (j = 0; j < query.length; j++) {
            if (str.charAt(i + j) == query.charAt(j)) pt++;
        }
        if (pt > max) max = pt;
    }
    return max;
}

function getCourseFull(id) {
    for (i = 0; i < courses.length; i++) {
        if (courses[i].course.id == id) return courses[i];
    }
    return null;
}

function getCourse(id) {
    var courses = database.courses;
    for (i = 0; i < courses.length; i++) {
        if (courses[i].id == id) return courses[i];
    }
    return null;
}

function searchCourse(query, amount = 1) {
    var courses = database.courses;
    var points = [];
    query = query.toLowerCase();
    courses.forEach(function(element, index) {
        var pp = strMatch(element.name.toLowerCase(), query);
        points[index] = { score: pp, index: index, course: element };
    });

    points.sort(function(a, b) { return b.score - a.score; });
    return points.slice(0, amount);
}

function loadCourses(callback) {
    var i = 0;
    var j = 2;
    database.courses.forEach((course) => {
        j++;
        setTimeout(loadCourse, j * 50, course.id, (data) => {
            i++;
            console.log("Coure " + course.id + " loaded. [" + i + "/" + database.courses.length + "]");
            courses.push(data);
            if (i == database.courses.length) callback();
        });
    });
}

function init() {
    if (database == null) loadDatabase();
    if (!database.loaded) {
        loadCourses([1, 2, 3, 4], function(courses) {
            database.loaded = true;
            database.courses = courses;
            saveDatabase(database);
            init();
        });
    } else {
        loadCourses(() => {
            console.log("Courses loaded!");

            app.get('/', function(req, res) {
                res.send("<html>" + file_utils.readFile("script.html").toString());
            });

            app.get('/json/:id', function(req, res) {
                var id = req.params.id;
                if (id != null)
                    res.send(JSON.stringify(getCourseFull(id)));
            });

            app.get('/course_id', function(req, res) {
                var name = req.query.name;
                if (name != null) {
                    var search = searchCourse(req.query.name, database.courses.length);
                    res.send(JSON.stringify(search));
                }
            });

            app.listen(3000);
        });
    }
}

setTimeout(init, 0);