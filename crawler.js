const cheerio = require("cheerio");
const request = require("request");
const UNB = require('./unb.js');

const BASE_URL = "https://matriculaweb.unb.br/graduacao/";
const COURSES_URL = BASE_URL + "curso_rel.aspx?cod=";
const COURSE_URL = BASE_URL + "curso_dados.aspx?cod=";
const SUBJECT_URL = BASE_URL + "disciplina.aspx?cod=";

// Like $.get from JQuery
function getFull(url, callback, tries = 5) {
    request.get(url,
        function(error, response, data) {
            if (error) {
                console.log(error);
                if (tries > 1)
                    getFull(url, callback, tries - 1);
                else return callback(null);
            } else {
                callback(cheerio.load(data));
            }
        });
}

function loadCampus(campus_id, callback) {
    var courses = [];

    console.log("loading campus " + campus_id);

    getFull(COURSES_URL + campus_id, function($) {
        $("#datatable").find("tr").each(function() {
            var course = $(this).find("td");
            var ID = $(course[1]).text();
            var NAME = $(course[2]).text();
            var TIME = $(course[3]).text();
            var TYPE = $(course[0]).text();
            if (ID.toString().length > 0)
                courses.push(new UNB.Course(campus_id, ID, NAME, TIME, TYPE));
        });
        callback(courses);
    });
}

function loadCampusList(campus_list, ret) {
    if (!Array.isArray(campus_list)) {
        campus_list = [campus_list];
    }
    var courses = [];
    var i = 0;

    campus_list.forEach((campus_id) => {
        loadCampus(campus_id, (c_list) => {
            courses = courses.concat(c_list);
            i++;
            if (i == campus_list.length) {
                courses.sort(function(a, b) { return a.id - b.id; });
                ret(courses);
            }
        });
    });
}

function loadSubjectDependencies(subject, ret) {
    getFull(SUBJECT_URL + subject.id, function($) {
        var depend = "";
        $($(".card").find("tbody tr")[5]).find("td strong").each(function() {
            depend += $(this).text() + " ";
        });
        subject.dependencies = depend.replace(/\s/g, '').replace(/E/gi, "&").replace(/OU/gi, "|");
        ret(subject);
    });
}

function loadFlux(href, callback) {
    if (href == null) {
        callback(null);
        return;
    }

    console.log("loading flux " + href);
    getFull(BASE_URL + href, function($) {
        var subjects = [];
        $(".body").find("table").each(function() {
            var thead = $(this).find("thead tr th");
            var period = $(thead[1]).text();
            $(this).find("tbody tr").each(function() {
                var cols = $(this).find("td");
                var type = $(cols[1]).text();
                var id = $(cols[3]).text();
                var name = $(cols[4]).text().replace(/\s*$/, '');
                if (type.length > 0) {
                    subjects.push(new UNB.FluxSubject(period, type, id, name));
                }
            });
        });
        var i = 0;
        subjects.forEach((subject) => {
            loadSubjectDependencies(subject, (subject) => {
                i++;
                if (i == subjects.length) {
                    callback(subjects);
                }
            });
        });
    });
}

function loadCurriculum(href, callback) {
    // #TODO
}

function loadCourse(id, callback) {

    console.log("loading course " + id);

    getFull(COURSE_URL + id, function($) {
        var description = [];
        var flux;
        var curr;

        $(".body").find("a").each(function() {
            var href = $(this).attr("href");
            if (href.startsWith("./fluxo")) flux = href.substr(2, href.length);
            if (href.startsWith("./curriculo")) curr = href.substr(2, href.length);
        });

        $(".body").find("#datatable tbody tr").each(function() {
            var k = $(this).find("th").text();
            var v = $(this).find("td").text();
            description.push({ key: k, value: v });
        });
        // var data = { course: course, flux: flux_subjects, description: description };
        // saveJSONFile("course_" + course.id + ".json", data);

        loadFlux(flux, (flux_subjects) => {
            callback({ course: id, flux: flux_subjects, description: description });
        });
    });
}


module.exports = {
    loadCampus,
    loadCampusList,
    loadCourse,
};