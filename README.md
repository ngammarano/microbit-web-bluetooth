# micro:bit Web Bluetooth

This repository contains examples of using Web Bluetooth with micro:bit.

## Scan

Scan Bluetooth devices whose name starts with "BBC micro:bit". After connecting to a micro:bit via BLE, it prints all the available services and characteristics.

## LEDs

Scan Bluetooth devices whose name starts with "BBC micro:bit". After connecting to a micro:bit via BLE, it allows to interact with the micro:bit through its Bluetooth LED service.
* **LED Matrix State**: read or write the state of the 5x5 LED matrix.
* **LED Text**: send a text to be displayed in the LED matrix.
* **Scrolling Delay** : read or write the delay in milliseconds for scrolling the text.
