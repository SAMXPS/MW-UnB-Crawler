// Enum Type Campus
const CAMPUS = {
    DARCY: 1,
    PLANALTINA: 2,
    CEILANDIA: 3,
    GAMA: 4,
};

// Object Type Course
function Course(campus, id, name, time, type) {
    this.campus = campus;
    this.id = id;
    this.name = name;
    this.time = time;
    this.type = type;
}

// Object Type FluxSubject
function FluxSubject(period, type, id, name, dependencies) {
    this.period = period;
    this.type = type;
    this.id = id;
    this.name = name;
    this.dependencies = dependencies;
}

module.exports = {
    CAMPUS,
    Course,
    FluxSubject,
}; 
