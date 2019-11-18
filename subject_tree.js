const FL = require('./file_utils.js');

function simplify(subjectList) {
    let list = [];

    subjectList.forEach((subject) => {
        list.push({ id: subject.id, dependencies: subject.dependencies, tree: null, fruit: true, dimension: 0 });
    });

    return list;
}



function SubjectTree(subjectList) {

    this.tree = simplify(subjectList);

    this.process = function() {
        this.tree.forEach((subject) => {
            this.processSubject(subject);
        });
        FL.saveJSONFile("flux.json", this.tree);
    }

    this.processSubject = function(subject, path = []) {
        if (subject == null) {
            return null;
        }

        if (subject.tree == null) {
            subject.tree = [];
            dimensions = [];
            path.push(subject);

            subject.dependencies.split("|").forEach((way) => {
                option = [];
                way.split("&").forEach((dep) => {
                    dep = parseInt(dep);
                    option.push(dep);
                    var optree = this.processSubject(this.getByID(dep), path.slice(0));
                    if (optree != null) {
                        option.push(optree);
                    }
                })
                subject.tree.push(option);
            });

        } else if (path.includes(subject)) {
            console.log("looping bro!");
            // looop???
        }

        return subject.tree;
    }

    this.getByID = function(id) {
        for (i = 0; i < this.tree.length; i++) {
            if (this.tree[i].id == id) return this.tree[i];
        }
        return null;
    }

}

new SubjectTree(FL.readJSONFile("course_1341.json").flux).process();

module.exports = {
    SubjectTree,
};