/**
 * Connects to a Bluetooth device.
 * The background color shows if a Bluetooth device is connected (green) or
 * disconnected (red).
 * Allows to interact with the characteristics of the micro:bit Bluetooth
 * Magnetometer service.
 */

var bluetoothDevice;



/**
 * Object containing the Bluetooth UUIDs of all the services and
 * characteristics of the micro:bit.
 */
microbitUuid = {
    /**
     * Services
     */
    genericAccess:                              ["00001800-0000-1000-8000-00805f9b34fb", "Generic Access"],
    genericAttribute:                           ["00001801-0000-1000-8000-00805f9b34fb", "Generic Attribute"],
    deviceInformation:                          ["0000180a-0000-1000-8000-00805f9b34fb", "Device Information"],
    accelerometerService:                       ["e95d0753-251d-470a-a062-fa1922dfa9a8", "Accelerometer Service"],
    magnetometerService:                        ["e95df2d8-251d-470a-a062-fa1922dfa9a8", "Magnetometer Service"],
    buttonService:                              ["e95d9882-251d-470a-a062-fa1922dfa9a8", "Button Service"],
    ioPinService:                               ["e95d127b-251d-470a-a062-fa1922dfa9a8", "IO Pin Service"],
    ledService:                                 ["e95dd91d-251d-470a-a062-fa1922dfa9a8", "LED Service"],
    eventService:                               ["e95d93af-251d-470a-a062-fa1922dfa9a8", "Event Service"],
    dfuControlService:                          ["e95d93b0-251d-470a-a062-fa1922dfa9a8", "DFU Control Service"],
    temperatureService:                         ["e95d6100-251d-470a-a062-fa1922dfa9a8", "Temperature Service"],
    uartService:                                ["6e400001-b5a3-f393-e0a9-e50e24dcca9e", "UART Service"],
    /**
     * Characteristics
     */
    deviceName:                                 ["00002a00-0000-1000-8000-00805f9b34fb", "Device Name"],
    appearance:                                 ["00002a01-0000-1000-8000-00805f9b34fb", "Appearance"],
    peripheralPreferredConnectionParameters:    ["00002a04-0000-1000-8000-00805f9b34fb", "Peripheral Preferred Connection Parameters"],
    serviceChanged:                             ["00002a05-0000-1000-8000-00805f9b34fb", "Service Changed"],
    modelNumberString:                          ["00002a24-0000-1000-8000-00805f9b34fb", "Model Number String"],
    serialNumberString:                         ["00002a25-0000-1000-8000-00805f9b34fb", "Serial Number String"],
    hardwareRevisionString:                     ["00002a27-0000-1000-8000-00805f9b34fb", "Hardware Revision String"],
    firmwareRevisionString:                     ["00002a26-0000-1000-8000-00805f9b34fb", "Firmware Revision String"],
    manufacturerNameString:                     ["00002a29-0000-1000-8000-00805f9b34fb", "Manufacturer Name String"],
    accelerometerData:                          ["e95dca4b-251d-470a-a062-fa1922dfa9a8", "Accelerometer Data"],
    accelerometerPeriod:                        ["e95dfb24-251d-470a-a062-fa1922dfa9a8", "Accelerometer Period"],
    magnetometerData:                           ["e95dfb11-251d-470a-a062-fa1922dfa9a8", "Magnetometer Data"],
    magnetometerPeriod:                         ["e95d386c-251d-470a-a062-fa1922dfa9a8", "Magnetometer Period"],
    magnetometerBearing:                        ["e95d9715-251d-470a-a062-fa1922dfa9a8", "Magnetometer Bearing"],
    magnetometerCalibration:                    ["e95db358-251d-470a-a062-fa1922dfa9a8", "Magnetometer Calibration"],
    buttonAState:                               ["e95dda90-251d-470a-a062-fa1922dfa9a8", "Button A State"],
    buttonBState:                               ["e95dda91-251d-470a-a062-fa1922dfa9a8", "Button B State"],
    pinData:                                    ["e95d8d00-251d-470a-a062-fa1922dfa9a8", "Pin Data"],
    pinADConfiguration:                         ["e95d5899-251d-470a-a062-fa1922dfa9a8", "Pin AD Configuration"],
    pinIOConfiguration:                         ["e95db9fe-251d-470a-a062-fa1922dfa9a8", "Pin IO Configuration"],
    pwmControl:                                 ["e95dd822-251d-470a-a062-fa1922dfa9a8", "PWM Control"],
    ledMatrixState:                             ["e95d7b77-251d-470a-a062-fa1922dfa9a8", "LED Matrix State"],
    ledText:                                    ["e95d93ee-251d-470a-a062-fa1922dfa9a8", "LED Text"],
    scrollingDelay:                             ["e95d0d2d-251d-470a-a062-fa1922dfa9a8", "Scrolling Delay"],
    microbitRequirements:                       ["e95db84c-251d-470a-a062-fa1922dfa9a8", "MicroBit Requirements"],
    microbitEvent:                              ["e95d9775-251d-470a-a062-fa1922dfa9a8", "MicroBit Event"],
    clientRequirements:                         ["e95d23c4-251d-470a-a062-fa1922dfa9a8", "Client Requirements"],
    clientEvent:                                ["e95d5404-251d-470a-a062-fa1922dfa9a8", "Client Event"],
    dfuControl:                                 ["e95d93b1-251d-470a-a062-fa1922dfa9a8", "DFU Control"],
    temperature:                                ["e95d9250-251d-470a-a062-fa1922dfa9a8", "Temperature"],
    temperaturePeriod:                          ["e95d1b25-251d-470a-a062-fa1922dfa9a8", "Temperature Period"],
    txCharacteristic:                           ["6e400002-b5a3-f393-e0a9-e50e24dcca9e", "Tx Characteristic"],
    rxCharacteristic:                           ["6e400003-b5a3-f393-e0a9-e50e24dcca9e", "Rx Characteristic"],
    /**
     * Method that searches an UUID among the UUIDs of all the services and
     * characteristics and returns:
     * - in HTML blue color the name of the service/characteristic found.
     * - in HTML red color a message if the UUID has not been found.
     * @param uuid The service or characteristic UUID.
     * @param serviceOrCharacteristic True (or 1) if it is a service, and false
     * (or 0) if it is a characteristic.
     */
    searchUuid(uuid, serviceOrCharacteristic) {
        for (const key in microbitUuid) {
            if (uuid === microbitUuid[key][0]) {
                return "<font color='blue'>" + microbitUuid[key][1] + "</font>";
            }
        }
        if (serviceOrCharacteristic) {
            return "<font color='red'>Unknown Micro:Bit Service</font>";
        } else {
            return "<font color='red'>Unknown Micro:Bit Characteristic</font>";
        }
    },
}



/**
 * Function that adds string to the log. If newLine is true, it adds a new line
 * at the end of the string.
 * @param string String to print to the log.
 * @param newLine Boolean that specifies whether to start a new line or not.
 */
function addLog(string, newLine) {
    document.getElementById("log").innerHTML += string;
    if (newLine) {
        document.getElementById("log").innerHTML += "<br>";
    };
}

/**
 * Function that adds string (and newline) to the log in bold and red color.
 * @param string String to print to the log.
 */
function addLogError(string) {
    addLog("<b><font color='red'>" + string + "</font></b>", true);
}

/**
 * Function that empties the log.
 */
function clearLog() {
    document.getElementById("log").innerHTML = "";
}



/**
 * Function that turns the background color red.
 */
function onDisconnected() {
    document.getElementById("body").style = "background-color:#FFD0D0";
}



var magnetometerDataCharacteristic;
var magnetometerPeriodCharacteristic;
var magnetometerBearingCharacteristic;
var magnetometerCalibrationCharacteristic;

/**
 * Function that updates the HTML element according to the magnetometer data
 * characteristic.
 */
function magnetometerDataChanged(event) {
    document.getElementById("magnetometerX").innerHTML = event.target.value.getInt16(0, true); // Little Endian
    document.getElementById("magnetometerY").innerHTML = event.target.value.getInt16(2, true); // Little Endian
    document.getElementById("magnetometerZ").innerHTML = event.target.value.getInt16(4, true); // Little Endian
}

/**
 * Function that updates the HTML element according to the magnetometer bearing
 * characteristic.
 */
function magnetometerBearingChanged(event) {
    document.getElementById("bearing").innerHTML = event.target.value.getUint16(0, true); // Little Endian
}

/**
 * Function that updates the HTML element according to the magnetometer
 * calibration characteristic.
 */
function magnetometerCalibrationChanged(event) {
    switch (event.target.value.getUint8(0)) {
        case 0:
            document.getElementById("calibration").innerHTML = "State unknown";
            break;
        case 1:
            document.getElementById("calibration").innerHTML = "Calibration requested";
            break;
        case 2:
            document.getElementById("calibration").innerHTML = "Calibration completed OK";
            break;
        case 3:
            document.getElementById("calibration").innerHTML = "Calibration completed with error";
            break;
        default:
            document.getElementById("calibration").innerHTML = "???: the received number is not 0, 1, 2 nor 3.";
    };
}

/**
 * Function that updates the HTML number input according to the magnetometer
 * period given by the Bluetooth characteristic.
 */
function readMagnetometerPeriod() {
    addLog("Reading magnetometer period... ", false);
    if (!bluetoothDevice) {
        addLogError("There is no device connected.");
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!magnetometerPeriodCharacteristic) {
                addLogError("There is no Magnetometer Period characteristic.");
            } else {
                magnetometerPeriodCharacteristic.readValue()
                .then(value => {
                    addLog("<font color='green'>OK</font>", true);
                    document.getElementById("magnetometerPeriodText").value = value.getUint16(0, true); // Little Endian
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLogError("There is no device connected.");
        };
    };
}

/**
 * Function that updates the magnetometer period using the corresponding
 * micro:bit Bluetooth characteristic.
 */
function writeMagnetometerPeriod() {
    addLog("Writing magnetometer period... ", false);
    if (!bluetoothDevice) {
        addLogError("There is no device connected.");
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!magnetometerPeriodCharacteristic) {
                addLogError("There is no Magnetometer Period characteristic.");
            } else {
                let buffer = new ArrayBuffer(2);
                let magnetometerPeriod = new DataView(buffer);
                magnetometerPeriod.setUint16(0, document.getElementById("magnetometerPeriodSelect").value, true); // Little Endian
                magnetometerPeriodCharacteristic.writeValue(magnetometerPeriod)
                .then(_ => {
                    addLog("<font color='green'>OK</font>", true);
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLogError("There is no device connected.");
        };
    };
}

/**
 * Function that updates the magnetometer calibration using the corresponding
 * micro:bit Bluetooth characteristic.
 */
function writeMagnetometerCalibration() {
    addLog("Writing magnetometer calibration... ", false);
    if (!bluetoothDevice) {
        addLogError("There is no device connected.");
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!magnetometerCalibrationCharacteristic) {
                addLogError("There is no Magnetometer Period characteristic.");
            } else {
                let buffer = new ArrayBuffer(1);
                let magnetometerCalibration = new DataView(buffer);
                magnetometerCalibration.setUint8(0, document.getElementById("magnetometerCalibrationSelect").value);
                magnetometerCalibrationCharacteristic.writeValue(magnetometerCalibration)
                .then(_ => {
                    addLog("<font color='green'>OK</font>", true);
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLogError("There is no device connected.");
        };
    };
}

/**
 * Function that connects to a Bluetooth device, and saves the characteristics
 * associated with the Magnetometer service.
 */
function connect() {
    addLog("Requesting micro:bit Bluetooth devices... ", false);
    if (!navigator.bluetooth) {
        addLogError("Bluetooth not available in this browser or computer.");
    } else {
        navigator.bluetooth.requestDevice({
            // To accept all devices, use acceptAllDevices: true and remove filters.
            filters: [{namePrefix: "BBC micro:bit"}],
            optionalServices: [microbitUuid.genericAccess[0], microbitUuid.genericAttribute[0], microbitUuid.deviceInformation[0], microbitUuid.accelerometerService[0], microbitUuid.magnetometerService[0], microbitUuid.buttonService[0], microbitUuid.ioPinService[0], microbitUuid.ledService[0], microbitUuid.eventService[0], microbitUuid.dfuControlService[0], microbitUuid.temperatureService[0], microbitUuid.uartService[0]],
        })
        .then(device => {
            addLog("<font color='green'>OK</font>", true);
            bluetoothDevice = device;
            addLog("Connecting to GATT server (name: <font color='blue'>" + device.name + "</font>, ID: <font color='blue'>" + device.id + "</font>)... ", false);
            device.addEventListener('gattserverdisconnected', onDisconnected);
            document.getElementById("body").style = "background-color:#D0FFD0";
            return device.gatt.connect();
        })
        .then(server => {
            addLog("<font color='green'>OK</font>", true);
            addLog("Getting Magnetometer service (UUID: " + microbitUuid.magnetometerService[0] + ")... ", false);
            return server.getPrimaryService(microbitUuid.magnetometerService[0]);
        })
        .then(service => {
            addLog("<font color='green'>OK</font>", true);
            addLog("Getting Magnetometer data characteristic... ", false);
            service.getCharacteristic(microbitUuid.magnetometerData[0])
            .then(dataChar => {
                addLog("<font color='green'>OK</font>", true);
                magnetometerDataCharacteristic = dataChar;
                addLog("Starting magnetometer data notifications... ", false);
                return dataChar.startNotifications()
                .then(_ => {
                    addLog("<font color='green'>OK</font>", true);
                    dataChar.addEventListener('characteristicvaluechanged', magnetometerDataChanged);
                    addLog("Getting Magnetometer period characteristic... ", false);
                    service.getCharacteristic(microbitUuid.magnetometerPeriod[0])
                    .then(periodChar => {
                        addLog("<font color='green'>OK</font>", true);
                        magnetometerPeriodCharacteristic = periodChar;
                        addLog("Getting Magnetometer bearing characteristic... ", false);
                        service.getCharacteristic(microbitUuid.magnetometerBearing[0])
                        .then(bearingChar => {
                            addLog("<font color='green'>OK</font>", true);
                            magnetometerBearingCharacteristic = bearingChar;
                            addLog("Starting magnetometer bearing notifications... ", false);
                            return bearingChar.startNotifications()
                            .then(_ => {
                                addLog("<font color='green'>OK</font>", true);
                                bearingChar.addEventListener('characteristicvaluechanged', magnetometerBearingChanged);
                                addLog("Getting Magnetometer calibration characteristic... ", false);
                                service.getCharacteristic(microbitUuid.magnetometerCalibration[0])
                                .then(characteristic => {
                                    addLog("<font color='green'>OK</font>", true);
                                    magnetometerCalibrationCharacteristic = characteristic;
                                    addLog("Starting magnetometer calibration notifications... ", false);
                                    return characteristic.startNotifications()
                                    .then(_ => {
                                        characteristic.addEventListener('characteristicvaluechanged', magnetometerCalibrationChanged);
                                        addLog("<font color='green'>OK</font>", true);
                                    })
                                    .catch(error => {
                                        addLogError(error);
                                    });
                                })
                                .catch(error => {
                                    addLogError(error);
                                });
                            })
                            .catch(error => {
                                addLogError(error);
                            });
                        })
                        .catch(error => {
                            addLogError(error);
                        });
                    })
                    .catch(error => {
                        addLogError(error);
                    });
                })
                .catch(error => {
                    addLogError(error);
                });
            })
            .catch(error => {
                addLogError(error);
            });
        })
        .catch(error => {
            addLogError(error);
        });
    };
}



/**
 * Function that disconnects from the Bluetooth device (if connected).
 */
function disconnect() {
    addLog("Disconnecting... ", false);
    if (!bluetoothDevice) {
        addLogError("There is no device connected.");
    } else {
        if (bluetoothDevice.gatt.connected) {
            bluetoothDevice.gatt.disconnect();
            if (!bluetoothDevice.gatt.connected) {
                addLog("<font color='green'>OK</font>", true);
            };
        } else {
            addLogError("There is no device connected.");
        };
    };
}
