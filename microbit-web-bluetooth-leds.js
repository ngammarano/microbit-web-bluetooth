/**
 * Connects to a Bluetooth device.
 * The background color shows if a Bluetooth device is connected (green) or
 * disconnected (red).
 * Allows to interact with the characteristics of the micro:bit Bluetooth LED
 * service.
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



var ledMatrixCharacteristic;
var ledTextCharacteristic;
var scrollingDelayCharacteristic;

/**
 * Function that connects to a Bluetooth device, prints all its services and
 * all its characteristics.
 */
function connect() {
    addLog("Requesting micro:bit Bluetooth devices...", true);
    navigator.bluetooth.requestDevice({
        // To accept all devices, use acceptAllDevices: true and remove filters.
        filters: [{namePrefix: "BBC micro:bit"}],
        optionalServices: [microbitUuid.genericAccess[0], microbitUuid.genericAttribute[0], microbitUuid.deviceInformation[0], microbitUuid.accelerometerService[0], microbitUuid.magnetometerService[0], microbitUuid.buttonService[0], microbitUuid.ioPinService[0], microbitUuid.ledService[0], microbitUuid.eventService[0], microbitUuid.dfuControlService[0], microbitUuid.temperatureService[0], microbitUuid.uartService[0]],
    })
    .then(device => {
        bluetoothDevice = device;
        addLog("Connecting to GATT server (name: <font color='blue'>" + device.name + "</font>, ID: <font color='blue'>" + device.id + "</font>)...", true);
        device.addEventListener('gattserverdisconnected', onDisconnected);
        document.getElementById("body").style = "background-color:#D0FFD0";
        return device.gatt.connect();
    })
    .then(server => {
        addLog("Getting LED service (UUID: " + microbitUuid.ledService[0] + ")...", true);
        return server.getPrimaryService(microbitUuid.ledService[0]);
    })
    .then(service => {
        addLog("Getting LED matrix state characteristic...", true);
        service.getCharacteristic(microbitUuid.ledMatrixState[0])
        .then(characteristic => {
            ledMatrixCharacteristic = characteristic;
        })
        .catch(error => {
            addLogError(error);
        });
        addLog("Getting LED text characteristic...", true);
        service.getCharacteristic(microbitUuid.ledText[0])
        .then(characteristic => {
            ledTextCharacteristic = characteristic;
        })
        .catch(error => {
            addLogError(error);
        });
        addLog("Getting scrolling delay characteristic...", true);
        service.getCharacteristic(microbitUuid.scrollingDelay[0])
        .then(characteristic => {
            scrollingDelayCharacteristic = characteristic;
        })
        .catch(error => {
            addLogError(error);
        });
    })
    .catch(error => {
        addLogError(error);
    });
}



/**
 * Function that disconnects from the Bluetooth device (if connected).
 */
function disconnect() {
    if (!bluetoothDevice) {
        addLog("There is no device connected.", true);
    } else {
        if (bluetoothDevice.gatt.connected) {
            addLog("Disconnecting...", true);
            bluetoothDevice.gatt.disconnect();
        } else {
            addLog("There is no device connected.", true);
        };
    };
}



/**
 * Function that updates the checkboxes according to the LED matrix state given
 * by the Bluetooth characteristics.
 */
function readLedMatrix() {
    if (!bluetoothDevice) {
        addLog("There is no device connected.", true);
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!ledMatrixCharacteristic) {
                addLog("There is no LED Matrix characteristic.", true);
            } else {
                ledMatrixCharacteristic.readValue()
                .then(value => {
                    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
                        let row = value.getUint8(rowIndex);
                        for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
                            document.getElementById((rowIndex+1).toString() + (5-columnIndex).toString()).checked = ((row >>> columnIndex) % 2 === 1);
                        };
                    };
                    addLog("LED matrix read...", true);
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLog("There is no device connected.", true);
        };
    };
}

/**
 * Function that updates the LED matrix of the micro:bit according to the HTML
 * checkboxes through the LED matrix state Bluetooth characteristic.
 */
function writeLedMatrix() {
    if (!bluetoothDevice) {
        addLog("There is no device connected.", true);
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!ledMatrixCharacteristic) {
                addLog("There is no LED Matrix characteristic.", true);
            } else {
                let buffer = new ArrayBuffer(5);
                let ledMatrix = new DataView(buffer);
                for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
                    ledMatrix.setUint8(rowIndex, 0);
                    for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
                        ledMatrix.setUint8(rowIndex, ledMatrix.getUint8(rowIndex) | (document.getElementById((rowIndex+1).toString() + (5-columnIndex).toString()).checked << columnIndex));
                    };
                };
                ledMatrixCharacteristic.writeValue(ledMatrix)
                .then(_ => {
                    addLog("LED matrix written...", true);
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLog("There is no device connected.", true);
        };
    };
}



/**
 * Function that writes a string to the LED text characteristic.
 */
function writeLedText() {
    if (!bluetoothDevice) {
        addLog("There is no device connected.", true);
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!ledTextCharacteristic) {
                addLog("There is no LED Text characteristic.", true);
            } else {
                if (!("TextEncoder" in window)) {
                    addLogError("Sorry, this browser does not support TextEncoder...");
                } else {
                    let enc = new TextEncoder();
                    ledTextCharacteristic.writeValue(enc.encode(document.getElementById("ledTextText").value))
                    .then(_ => {
                        addLog("LED text sent...", true);
                    })
                    .catch(error => {
                        addLogError(error);
                    });
                };
            };
        } else {
            addLog("There is no device connected.", true);
        };
    };
}



/**
 * Function that updates the HTML number input according to the scrolling delay
 * given by the Bluetooth characteristic.
 */
function readScrollingDelay() {
    if (!bluetoothDevice) {
        addLog("There is no device connected.", true);
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!scrollingDelayCharacteristic) {
                addLog("There is no Scolling Delay characteristic.", true);
            } else {
                scrollingDelayCharacteristic.readValue()
                .then(value => {
                    addLog("Scrolling delay read...", true);
                    document.getElementById("scrollingDelayText").value = value.getUint16(0, true); // Little Endian
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLog("There is no device connected.", true);
        };
    };
}

/**
 * Function that updates the scrolling delay using the corresponding micro:bit
 * Bluetooth characteristic.
 */
function writeScrollingDelay() {
    if (!bluetoothDevice) {
        addLog("There is no device connected.", true);
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!scrollingDelayCharacteristic) {
                addLog("There is no Scrolling Delay characteristic.", true);
            } else {
                let buffer = new ArrayBuffer(2);
                let scrollingDelay = new DataView(buffer);
                scrollingDelay.setUint16(0, document.getElementById("scrollingDelayText").value, true); // Little Endian
                scrollingDelayCharacteristic.writeValue(scrollingDelay)
                .then(_ => {
                    addLog("Scrolling delay updated...", true);
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLog("There is no device connected.", true);
        };
    };
}