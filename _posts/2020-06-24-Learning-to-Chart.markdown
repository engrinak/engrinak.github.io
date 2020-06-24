---
layout: post
title: "Learning how to Chart.js" 
date:   2020-06-24 09:20:00 -0800
categories: python
---
When I woke up this morning, I had no idea what I was doing.  I wanted to put a "live" chart of my weather station data here on my page.  First, I googled if it is even possible to put javascript in [a github page](https://code-maven.com/javascript-on-github-pages).  It turns out that you can.  Below is a simple example of some text that was extracted from a json file using jquery:

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="/assets/json.js"></script>
<div id="text"></div>
<br>
<br>
Now how about a chart? This is a straight copy-paste from the introductory example from the [chart.js](https://www.chartjs.org/docs/latest/) documentation.  The one thing I had to do differently was to include chart.js: `<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>`

<br>

```javascript
<canvas id="myChart" width="400" height="400"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
<script>
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['R', 'B', 'Y', 'G', 'P', 'O'],
        datasets: [{
            label: 'Bar Height',
            data: [3, 13, 6, 15, 4, 7],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
</script>
```
All you have to do is plop the code directly into your markdown file (I am using [Jekyll](https://jekyllrb.com/)) and it will work.  Try it!
<br>

# Chart Example
<canvas id="myChart" width="400" height="400"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
<script>
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['R', 'B', 'Y', 'G', 'P', 'O'],
        datasets: [{
            label: 'Bar Height',
            data: [3, 13, 6, 15, 4, 7],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
</script>

<br>

Now that I've figured out how to copy-paste code, I'm off to try to learn how to plot actual data from the weather station.