---
layout: post
title: "Download USGS Magnetic Observatory Data" 
date:   2020-06-06 10:25:55 -0800
categories: python
---

In my additional role as "survey specialist" at my previous job, I had the unique opportunity to work with real time data from the USGS magnetic observatory in Deadhorse, AK. Without going too much into the details, I can say that our drilling tools also measured the earths' magnetic field and we could further refine our measurements based on the observatory data, reducing the positional uncertainty of the wellbore. 

Let's say however that we want to look at the observatory data for some other scientific purpose.  Historical data is freely available to the public through the InterMagnet organization, and to get it in near real time is also possible but not completely straightforward (See geomag-algorithms on github).

We can modify the API example from their page slightly to get the data into a Pandas DataFrame:

```python
import geomagio
import sys
from obspy.core import UTCDateTime
import pandas as pd
import StringIO

input_factory = geomagio.edge.EdgeFactory()
timeseries = input_factory.get_timeseries(
    observatory = 'DED',
    channels = ('H', 'E', 'Z', 'F'),
    type = 'variation',
    interval = 'minute',
    starttime = UTCDateTime('2017-08-17T00:00:00Z'),
    endtime = UTCDateTime('2017-08-17T23:59:00Z'))

output_factory = geomagio.iaga2002.IAGA2002Factory()
myfile = StringIO.StringIO("")

output_factory.write_file(
    channels = ('H', 'E', 'Z', 'F'),
    fh = myfile,
    timeseries = timeseries)
mystring = StringIO.StringIO(myfile.getvalue())

df = pd.read_csv(mystring, delim_whitespace=True, skiprows=23, header=None)
df.columns = ['Date', 'Time', 'DOY', 'H', 'E', 'Z', 'F']
```
 
