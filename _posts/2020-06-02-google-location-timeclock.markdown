---
layout: post
title:  "Timeclock"
date:   2020-06-02 11:12:55 -0800
categories: python
---

At some point in my career, I became concerned with tracking my hours worked and being able to show whether or not I was at the office for the required number of hours each day.  Let's see if we can use our Google Location History to back up our story and prove that we were justified in taking off early on Friday afternoon.

# Thought process

We know that we can get the history of our lat/long for as long as we've used a smartphone with google maps.  With that, we can set a point of interest like an office building with a known lat/long.  Then we can ask ourselves the following question: How much time do I spend each day within a given radius of that point?  The distance between lat/long coordinates can be found with the [haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula).  Luckily someone already [did the hard work](https://stackoverflow.com/questions/4913349/haversine-formula-in-python-bearing-and-distance-between-two-gps-points) for us:

```python
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r
```
# We continue on with our output data frame
(see yesterday's post)

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>timestampMs</th>
      <th>timestamp</th>
      <th>latitudeE7</th>
      <th>longitudeE7</th>
      <th>altitude</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1.496705e+09</td>
      <td>2017-06-05 15:26:33</td>
      <td>61.12345</td>
      <td>-149.45678</td>
      <td>70.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1.496705e+09</td>
      <td>2017-06-05 15:25:01</td>
      <td>61.12345</td>
      <td>-149.45678</td>
      <td>70.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1.496705e+09</td>
      <td>2017-06-05 15:24:01</td>
      <td>61.12345</td>
      <td>-149.45678</td>
      <td>70.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.496705e+09</td>
      <td>2017-06-05 15:22:36</td>
      <td>61.12345</td>
      <td>-149.45678</td>
      <td>70.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.496705e+09</td>
      <td>2017-06-05 15:21:36</td>
      <td>61.12345</td>
      <td>-149.45678</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>


<br>


Now we can add a distance column to our dataframe, filtering out values greater than a certain distance and finally group by date to get our daily hours worked.

# Calculate a time delta
A time delta is used to find the time difference between each record in the data which can then be summed by day.  I used to use `.fillna(0)` but pandas no longer accepts an integer here if the data is of datetime64 format.  Instead of *0* we now use `pd.Timedelta(seconds=0)`
```python
output['tdelta'] = (output.timestamp - output.timestamp.shift()).\
    fillna(pd.Timedelta(seconds=0))
output['tdelta'] = output['tdelta'] / np.timedelta64(1, 'm')
```

# Enter a point of interest

```python
ilat = 61.12345
ilong = -149.45678
```

# Radius
Choose a radius large enough to include all points within the area of interest.  In this case, 250 meters covers the building and parking lot where I worked.
```python
radius = 250 #Meters
radius = radius / 1000 #Kilometers
```

# Calculate the distance
This is the distance from the point of interest of every coordinate in the google history file.
```python
output['distance'] = output.apply(lambda x: haversine(ilong, ilat, \
    x.longitudeE7, x.latitudeE7), axis=1)
```

# Filter by distance and group by date
```python
output['date'] = output['timestamp'].dt.floor('d')
output['tdelta'] = output['tdelta'] / 60  #minutes to hours
output = output[output['distance'] < radius]
output = output[['date', 'tdelta']]
output = output.groupby(output['date']).sum()
```

# Plot the data

```python
fig, ax = plt.subplots()
ax.bar(output.index, output.tdelta)
ax.axes.set_xlabel("Date")
ax.axes.set_ylabel("Hours Worked (tdelta)")
fig.show()
```

![Plot](/assets/2020-06-02-plot.png)

It can be seen from the chart that around July 2016, I transitioned from 12 hour shifts to a regular 8 hour work day.  