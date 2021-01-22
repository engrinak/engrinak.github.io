---
layout: post
title: "Geomagnetic Observatory - Part 1" 
date:   2021-01-21 12:00:00 -0800
categories: python
---

![Title Image](/assets/rm3100.jpg)

I recently purchased this 3 axis magnetometer chip from Amazon for about $37. This is the RM3100, "Military Grade" 3 axis accelerometer from Wit Motion. There are many applications for a sensor like this - drones, robots and navigation, but my main interest is in measuring the earth's magnetic field. What I want to do is set up a real time monitoring station to monitor geomagnetic disturbances. This is a common phenomenon that occurs here in Alaska on a regular basis and I think it would be fun to try to capture some data myself during such an event. The inspiration for this project comes from the BGS' project [Raspberry Pi Magnetometer](http://www.geomag.bgs.ac.uk/education/raspberry_pi_magnetometer.html). I am trying to do the same thing, but with a much cheaper and easier to obtain sensor. 


I also purchased a raspberry pi 4 to control the sensor and perform data acquisition. It's my first time playing with a pi, but so far it is just like a regular computer running linux and runs python. It also supports SSH and VNC out of the box, so the "headless" set up is fairly simple (it has HDMI ports, but there is no need to use them). 

The biggest challenge thus far has been getting the magnetometer connected and getting readings from it. It came with a datasheet and some example c++ code that was written for some other controller board (Arduino, I believe), but it claims to support I2C and SPI communication so it should be able to work with the raspberry pi. I could find no mention of the RM3100 in the raspberry pi world (forums, stack overflow, etc) - so I am pretty much on my own with this thing. The promise of high resolution seems to make it worth the struggle however.

Another challenge has been the physical aspect of mounting everything in an outdoor enclosure - ideally this "observatory" will be located outside in the back yard. That is the goal, but in my next post I will write in more detail.

So stay tuned and watch this space for further updates with regards to my progress on this project!
