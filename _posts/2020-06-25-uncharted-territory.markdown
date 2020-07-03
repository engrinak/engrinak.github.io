---
layout: post
title: "Uncharted Territory" 
date:   2020-06-25 08:00:00 -0800
categories: python
---

In my previous post about the weather station hack, I learned how to collect data via 433Mhz radio signal with my RTL-SDR device.  Now I want to create a useful display of the current temperature readings in my house, accessible by mobile device.   

## Script Improvement  
In my previous post, I wrote about handling the data in csv format and creating an SQLite database.  I quickly found out that my script was very slow once the data began to accumulate, sometimes taking 2-3 minutes just to update the database with new data.  This could quickly become unacceptable.  Using the time module in python, I investigated what was taking so long in the code. 

Execution time 19 minutes!
```shell
sfell@sfell-MacBookPro:~$ time python3 rtl_csv_to_sql.py weather11.csv

real	19m0.677s
user	14m49.099s
sys	0m2.917s
```

The problem was in this bit of code. 

```python
for row in df.itertuples(name=None): 
        if row[0] not in DateTimes: 
            print('executing' + str(row[0])) 
            c.execute('INSERT INTO data VALUES(' + insQmrks + ')', row) 
```
For each iteration through every row in the dataframe, it also iterates through every time stamp in the database.  While this attempt to avoid duplicates in the database has worked, it ended up costing a lot of time.  Now I have taken the approach of filtering the input csv data by checking the latest time stamp in the DB and then appending only the new data to the DB.  There was also a need to filter out the occasional duplicate header row. 

I was previously not parsing any of the date strings but in order to filter, I had to set up a couple of date parsers; one to parse the dates and do the filtering, and another to unparse back to string format to write into the DB. Here are two simple date parsing and unparsing functions.
```python
def dateparse(x):
    return datetime.strptime(x, '%Y-%m-%d %H:%M:%S')

def undateparse(x):
    return datetime.strftime(x, '%Y-%m-%d %H:%M:%S')
```

And here I do some filtering.  First I take out some repeated headers by using the `'time'` key and also removing all empty `'notnull()'` rows.  The `DateTimes[]` list is populated earlier in the script (see previous post) with all timestamps in the DB.  Here I simply filter the input data for all dates greater than the latest timestamp in the database.
```python
    df = df[df.index != 'time']
    df = df[df.index.notnull()]
    df.index = df.index.map(dateparse)
    df = df[df.index > datetime.strptime(DateTimes[-1], '%Y-%m-%d %H:%M:%S')]
```

And now the script runs orders of magnitude faster. I should mention however, the 19 minutes time above was slightly exaggerated because I was writing to another version of the database and there were several days of data to fill in. This way of filtering the data is still much much faster though.  
```shell
sfell@sfell-MacBookPro:~$ time python3 rtl_csv_to_sql2.py weather11.csv

real	0m13.000s
user	0m8.088s
sys	0m0.958s
```


Following [this example](https://github.com/HandsOnDataViz/chartjs-templates/tree/master/line-chart)


Get rid of null values [modifying this example](https://jsfiddle.net/beaver71/u4wto8z1/)

Parse dates [example](https://stackoverflow.com/questions/54334676/chart-js-format-date-in-label)

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  
<!-- Load Chart.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js"></script>
<script src="https://unpkg.com/chartjs-plugin-colorschemes@0.4.0/dist/chartjs-plugin-colorschemes.min.js"></script>

<!-- Load Data Labels-->
<!-- <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0"></script> -->
<!-- Load PapaParse to read csv files -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.1.0/papaparse.min.js"></script>
<div><canvas id="chart-container" style="height: 400px; width: 100%"></canvas></div>
<script src="/assets/script.js"></script>

Get last not null value from array [link](https://stackoverflow.com/questions/49190873/get-the-last-non-null-element-of-an-array)

Set up a Cron Job to process the data every 15 minutes [link](https://phoenixnap.com/kb/set-up-cron-job-linux)

Run an HTTP server [link](https://docs.python.org/3/library/http.server.html)

Do some debugging along the way.  `pdb.pm()` provides a really cool way to be able to see variables inside a function where the exception occurred. [Link](https://docs.python.org/3/library/pdb.html)


# Display Last Values
 <table style="width:70%">
  <tr>
    <th>T0</th>
    <th>T1</th>
    <th>T2</th>
    <th>T3</th>
    <th>TC</th>
  </tr>
  <tr>
    <td style="text-align:center"><div id="T0"></div></td>
    <td style="text-align:center"><div id="T1"></div></td>
    <td style="text-align:center"><div id="T2"></div></td>
    <td style="text-align:center"><div id="T3"></div></td>
    <td style="text-align:center"><div id="T4"></div></td>
  </tr>
</table> 

<br><br>

