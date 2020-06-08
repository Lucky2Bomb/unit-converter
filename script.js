"use strict";

let convert_length = 0;
let convert_area = 1;
let convert_volume = 2;
let convert_speed = 3;
let convert_mass = 4;
let convert_time = 5;
let convert_temperature = 6;


function CreateUnit(name, fullname, oneUnitWeight, formulas = null) {
    this.name = name;
    this.fullname = fullname;
    this.oneUnitWeight = oneUnitWeight;
    if (formulas != null) this.formulas = formulas;
}

let units = {
    /////////////////////////////////////////////////
    length: {
        mm: new CreateUnit("mm", "Millimeter", 0.001),
        cm: new CreateUnit("cm", "Centimeter", 0.01),
        m: new CreateUnit("m", "Meter", 1),
        km: new CreateUnit("km", "Kilometer", 1000),
    },

    area: {
        mm2: new CreateUnit("mm2", "Millimeter2", 0.000001),
        cm2: new CreateUnit("cm2", "Centimeter2", 0.0001),
        m2: new CreateUnit("m2", "Meter2", 1),
        km2: new CreateUnit("km2", "Kilometer2", 1000000),
    },

    volume: {
        mm3: new CreateUnit("mm3", "Millimeter3", 0.000000001),
        cm3: new CreateUnit("cm3", "Centimeter3", 0.000001),
        m3: new CreateUnit("m3", "Meter3", 1),
        km3: new CreateUnit("km3", "Kilometer3", 1000000000),
    },

    mass: {
        mg: new CreateUnit("mg", "Milligram", 0.000001),
        g: new CreateUnit("g", "Gram", 0.001),
        kg: new CreateUnit("kg", "Kilogram", 1),
        t: new CreateUnit("t", "Ton", 1000),
        mt: new CreateUnit("mt", "Megaton", 1000000),
    },

    speed: {
        kmH: new CreateUnit("kmH", "KilometerPerHour", 1),
        mpH: new CreateUnit("mpH", "MilePerHour", 1.609),
        fpH: new CreateUnit("fpH", "FootPerHour", 0.0003048),
        kn: new CreateUnit("kn", "Knot", 1.852),
    },

    time: {
        h: new CreateUnit("h", "Hour", 3600),
        m: new CreateUnit("m", "Minute", 60),
        s: new CreateUnit("s", "Second", 1),
        ms: new CreateUnit("ms", "MilliSecond", 0.001),
    },
    /////////////////////////////////////////////////

    temperature: {
        C: new CreateUnit("C", "Celsius", 1, {
            from: (x) => x,
            to: (x) => x,
        }),
        F: new CreateUnit("F", "Fahrenheit", 0, {
            from: (x) => (x - 32) * 0.56,
            to: (x) => x * 1.8 + 32,
        }),
        K: new CreateUnit("K", "Kelvin", 0, {
            from: (x) => x - 273.15,
            to: (x) => x + 273.15,
        }),
    },
};

function CreateConverter(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;
}

let converters = [
    new CreateConverter(convert_length, "length", units.length),
    new CreateConverter(convert_area, "area", units.area),
    new CreateConverter(convert_volume, "volume", units.volume),
    new CreateConverter(convert_speed, "speed", units.speed),
    new CreateConverter(convert_mass, "mass", units.mass),
    new CreateConverter(convert_time, "time", units.time),
    new CreateConverter(convert_temperature, "temperature", units.temperature),
];

function convert(type, unitFrom, unitTo, value) {
    if (type.hasOwnProperty(unitFrom) && type.hasOwnProperty(unitTo)) {
        if (type[unitFrom].formulas == null) {
            return value * type[unitFrom].oneUnitWeight / type[unitTo].oneUnitWeight;
        }
        else {
            return type[unitTo].formulas.to(type[unitFrom].formulas.from(value));
        }
    }
    else {
        throw new Error("Type mismatch for conversion.");
    }
}

//EXAMPLE
//console.log(convert(units.length, "cm", "m", 150));
//console.log(convert(units["speed"], "mpH", "kmH", 60));
//console.log(convert(units.temperature, "F", "C", 80));

let selectUnit = document.getElementById("selectUnit");
let selectFrom = document.getElementById("selectFrom");
let selectTo = document.getElementById("selectTo");
let inputValue = document.getElementById("inputValue");
let spanResult = document.getElementById("spanResult");

function fillSelectByObject(select, obj) {
    let options = [];
    select.innerHTML = "";

    for (let key in obj) {
        options[key] = document.createElement("option");
        options[key].innerHTML = obj[key].name;
        options[key].value = obj[key].name;

        select.append(options[key]);
    }
    return options;
}

let options_selectUnit = fillSelectByObject(selectUnit, converters);
let options_selectFrom = fillSelectByObject(selectFrom, units[selectUnit.value]);
let options_selectTo = fillSelectByObject(selectTo, units[selectUnit.value]);

function spanResult_update() {
    spanResult.innerHTML = convert(
        units[selectUnit.value],
        selectFrom.value,
        selectTo.value,
        inputValue.value) + ` ${selectTo.value}`;
}

function selectUnit_update() {
    options_selectFrom = fillSelectByObject(selectFrom, units[selectUnit.value]);
    options_selectTo = fillSelectByObject(selectTo, units[selectUnit.value]);
}

selectUnit.addEventListener("change", selectUnit_update);
inputValue.addEventListener("input", spanResult_update);
selectUnit.addEventListener("change", spanResult_update);
selectFrom.addEventListener("change", spanResult_update);
selectTo.addEventListener("change", spanResult_update);