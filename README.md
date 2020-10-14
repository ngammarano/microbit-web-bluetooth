# micro:bit Web Bluetooth

This repository contains examples of using Web Bluetooth with micro:bit.

## Scan

This example scans for Bluetooth devices whose name start with "BBC micro:bit". After connecting to a micro:bit via BLE, it prints all the available services and characteristics.

## LEDs

This example scans for Bluetooth devices whose name start with "BBC micro:bit". After connecting to a micro:bit via BLE, it allows to interact with the characteristics of the LED service:
* LED Matrix State
State of the 5x5 LED matrix.
* LED Text
Allows to send a text to be displayed in the LEDs. The text is scrolled with the delay defined by the Scrolling Delay characteristic (see next characteristic).
* Scrolling Delay
Delay for scrolling the text.

