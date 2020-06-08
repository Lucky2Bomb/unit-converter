"use strict";

let convert_length = 0;
let convert_area = 1;
let convert_volume = 2;
let convert_speed = 3;
let convert_mass = 4;
let convert_time = 5;
let convert_temperature = 6;


function CreateUnit(name, oneUnitWeight, formulas = null) {
    this.name = name;
    this.oneUnitWeight = oneUnitWeight;
    if (formulas != null) this.formulas = formulas;
}

let units = {
    //////////universal translation formula//////////
    length: {
        mm: new CreateUnit("Millimeter", 0.001),
        cm: new CreateUnit("Centimeter", 0.01),
        m: new CreateUnit("Meter", 1),
        km: new CreateUnit("Kilometer", 1000),
    },

    area: {
        mm2: new CreateUnit("Millimeter2", 0.000001),
        cm2: new CreateUnit("Centimeter2", 0.0001),
        m2: new CreateUnit("Meter2", 1),
        km2: new CreateUnit("Kilometer2", 1000000),
    },

    volume: {
        mm3: new CreateUnit("Millimeter3", 0.000000001),
        cm3: new CreateUnit("Centimeter3", 0.000001),
        m3: new CreateUnit("Meter3", 1),
        km3: new CreateUnit("Kilometer3", 1000000000),
    },

    mass: {
        mg: new CreateUnit("Milligram", 0.000001),
        g: new CreateUnit("Gram", 0.001),
        kg: new CreateUnit("Kilogram", 1),
        t: new CreateUnit("Ton", 1000),
        mt: new CreateUnit("Megaton", 1000000),
    },

    speed: {
        kmH: new CreateUnit("KilometerPerHour", 1),
        mpH: new CreateUnit("MilePerHour", 1.609),
        fpH: new CreateUnit("FootPerHour", 0.0003048),
        kn: new CreateUnit("Knot", 1.852),
    },

    time: {
        h: new CreateUnit("Hour", 3600),
        m: new CreateUnit("Minute", 60),
        s: new CreateUnit("Second", 1),
        ms: new CreateUnit("MilliSecond", 0.001),
    },
    /////////////////////////////////////////////////

    temperature: {
        C: new CreateUnit("Celsius", 1, {
            from: (x) => x,
            to: (x) => x,
        }),
        F: new CreateUnit("Fahrenheit", 0, {
            from: (x) => (x - 32) * 0.56,
            to: (x) => x * 1.8 + 32,
        }),
        K: new CreateUnit("Kelvin", 0, {
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
    new CreateConverter(convert_length, "Length", units.length),
    new CreateConverter(convert_area, "Area", units.area),
    new CreateConverter(convert_volume, "Volume", units.volume),
    new CreateConverter(convert_speed, "Speed", units.speed),
    new CreateConverter(convert_mass, "Mass", units.mass),
    new CreateConverter(convert_time, "Time", units.time),
    new CreateConverter(convert_temperature, "Temperature", units.temperature),
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