This repository contains examples of using Web Bluetooth with micro:bit.

## [Scan](https://ngammarano.github.io/microbit-web-bluetooth/microbit-web-bluetooth-scan.html)

Scan Bluetooth devices whose name starts with "BBC micro:bit". After connecting to a micro:bit via BLE, it prints all the available services and characteristics.

## [LEDs](https://ngammarano.github.io/microbit-web-bluetooth/microbit-web-bluetooth-leds.html)

Scan Bluetooth devices whose name starts with "BBC micro:bit". After connecting to a micro:bit via BLE, it allows to interact with the micro:bit through its Bluetooth LED service.
* **LED Matrix State**: read or write the state of the 5x5 LED matrix.
* **LED Text**: write a text to be displayed in the LED matrix.
* **Scrolling Delay** : read or write the delay in milliseconds for scrolling the text.

## [Buttons](https://ngammarano.github.io/microbit-web-bluetooth/microbit-web-bluetooth-button.html)

Scan Bluetooth devices whose name starts with "BBC micro:bit". After connecting to a micro:bit via BLE, it allows to interact with the micro:bit through its Bluetooth Button service.
* **Button A State**: notify state of button A (0=not pressed, 1=short pressed, 2=long pressed).
* **Button B State**: notify state of button B (0=not pressed, 1=short pressed, 2=long pressed).
