---
layout: post
title:  "Google Location History"
date:   2020-06-01 11:01:55 -0800
categories: python
---
# Geotagging photos with Google Location History

Geotagging photos can be very useful and while most smartphones take care of this automatically, many modern DSLR cameras do not.  Using the approach below, we can tag photos from our library using our google location history assuming that use the google map service and had our smartphone with us while shooting with the DSLR.

To download google location history in json format, visit [google takeout](https://takeout.google.com/?hl=en).

Additional considerations:
* Images taken with DSLR set to the correct local time
* Android Phone present while photos were taken
* iPhone with google maps with permission set to "always allow" access to device location


We can start by importing some things that we know we're going to need.  And then we can load the json data with pandas using json_normalize.  By examining the json data, we can see that 'locations' is probably the root note so we can start with that.


```python
import pandas as pd
import numpy as np
import json

with open ('History.json') as f:
    d = json.load(f)

data = pd.json_normalize(d['locations'])
data.head(3)
```




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
      <th>latitudeE7</th>
      <th>longitudeE7</th>
      <th>accuracy</th>
      <th>altitude</th>
      <th>activity</th>
      <th>velocity</th>
      <th>heading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1496705193030</td>
      <td>611923950</td>
      <td>-1498647164</td>
      <td>26</td>
      <td>70.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1496705101727</td>
      <td>611923950</td>
      <td>-1498647164</td>
      <td>26</td>
      <td>70.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1496705041669</td>
      <td>611923950</td>
      <td>-1498647164</td>
      <td>26</td>
      <td>70.0</td>
      <td>[{'timestampMs': '1496705043690', 'activity': ...</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>



## Cleaning up and converting number formats

Next we can do some cleanup of data and convert some of the number formats.  One thing that is sort of magic about this is that datetime.fromtimestamp seems to automatically recognize the timestamp after it has been converted from milliseconds to seconds.  One other thing to mention is that the altitude needs to be an 'int' later on but we can start with 'double' for now.

Note: There is an 'activity' column with varying amounts of nested dictionaries and lists that seem to contain some useful information about the motion of the phone at the time (resting, walking, driving).  We'll skip this data for now since we don't need it for this purpose.  Out of curiousity, I was able to flatten it out into strings in csv format, however there were sometimes misaligned columns and it became increasingly difficult to deal with these.  


```python
#output = data[['timestampMs', 'latitudeE7', 'longitudeE7']]
from datetime import datetime
def timefmt(x):
    #return datetime.fromtimestamp(int(x)).strftime("%Y-%m-%dT%H:%m")
    return datetime.fromtimestamp(int(x))
output = pd.DataFrame()
output['timestampMs'] = data['timestampMs'].astype('float') / 1000
output['timestamp'] = output['timestampMs'].apply(timefmt)
output['latitudeE7'] = data['latitudeE7'].astype('float') / 10000000
output['longitudeE7'] = data['longitudeE7'].astype('float') / 10000000
output['altitude'] = data['altitude'].astype('double')
output.head()
```




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




```python
#just checking what we're dealing with
output.dtypes
```




    timestampMs           float64
    timestamp      datetime64[ns]
    latitudeE7            float64
    longitudeE7           float64
    altitude              float64
    dtype: object



## Get the timestamp from the image

We can use the exif package to read the timestamp from an image.  We can test it out on a single image here.


```python
#Using exif to read timestamp from image.  I tried using exif also to write back the GPS coordinates, however it seemed that GPSPhoto is a much easier option.
from exif import Image
with open("./img/DSC_1850.jpg", 'rb') as image_file:
    my_image = Image(image_file)

#list all the information available in the image
print(dir(my_image))
print(' ')
print(my_image.datetime_original)
```

    ['_exif_ifd_pointer', '_gps_ifd_pointer', '_segments', 'artist', 'cfa_pattern', 'color_space', 'components_configuration', 'compression', 'contrast', 'copyright', 'custom_rendered', 'datetime', 'datetime_digitized', 'datetime_original', 'digital_zoom_ratio', 'exif_version', 'exposure_bias_value', 'exposure_mode', 'exposure_program', 'exposure_time', 'f_number', 'file_source', 'flash', 'flashpix_version', 'focal_length', 'focal_length_in_35mm_film', 'gain_control', 'get', 'get_file', 'gps_version_id', 'has_exif', 'jpeg_interchange_format', 'jpeg_interchange_format_length', 'light_source', 'make', 'maker_note', 'max_aperture_value', 'metering_mode', 'model', 'orientation', 'photographic_sensitivity', 'pixel_x_dimension', 'pixel_y_dimension', 'reference_black_white', 'resolution_unit', 'saturation', 'scene_capture_type', 'scene_type', 'sensing_method', 'sensitivity_type', 'sharpness', 'software', 'subject_distance_range', 'subsec_time', 'subsec_time_digitized', 'subsec_time_original', 'user_comment', 'white_balance', 'x_resolution', 'y_and_c_positioning', 'y_resolution']
     
    2015:05:27 21:50:22
    

## Find the matching timestamp in the google data

Next, we want to match the timestamp of an image with a timestamp in the google history to find out our coordinates at the time a particular photo was taken.  The challenge here is that a timestamp from a photo may not match exactly with our data so we can use pandas .get_loc function to find the nearest match.  But first we'll have to clean up the data a bit by sorting it and removing some duplicate entries as .get_loc requires.

Note that 'n' is the row number or index in our sorted data where the match was found.



```python
from datetime import datetime

dt = datetime.strptime(my_image.datetime_original, '%Y:%m:%d %H:%M:%S')
print(dt)

output = output.sort_values(by=['timestamp'], axis=0)
output = output.drop_duplicates(subset=['timestamp'], keep='first')

idx = pd.Index(output['timestamp'])
n = idx.get_loc(dt, method='nearest')
output.iloc[n]
```

    2015-05-27 21:50:22
    
    timestampMs            1.43279e+09
    timestamp      2015-05-27 21:49:55
    latitudeE7                 60.1058
    longitudeE7               -149.434
    altitude                       NaN
    Name: 397104, dtype: object



## Write GPS Exif data back to an image.

We can use a package called GPSPhoto to easily write lat long in decimal format.  

Note: GPSPhoto has several dependencies and was a little tricky to satisfy them all.  One of the dependencies is 'PIL' (Python Image Library) but the newer fork 'pillow' will work.


```python
#Now we'll use GPSPhoto to write some GPS coordinates to the image
from GPSPhoto import gpsphoto
photo = gpsphoto.GPSPhoto('./img/DSC_1368.JPG')
info = gpsphoto.GPSInfo((61.123, -148.456), alt=10, timeStamp=dt)
photo.modGPSData(info, './img/DSC_1368.JPG')
```

# Put it all together

```python
#Get list of image files in image directory
from exif import Image
from datetime import datetime
import os
from GPSPhoto import gpsphoto

root = ".\\img"
file_list = []

for path, subdirs, files in os.walk(root):
     for name in files:
        #print(name)
        file_list.append(os.path.join(path, name))

for file in file_list:
    with open(file, 'rb') as image_file:
        my_image = Image(image_file)
    
    dt = datetime.strptime(my_image.datetime_original, '%Y:%m:%d %H:%M:%S')
    
    #get_loc requires values to be sorted and without duplicates
    output = output.sort_values(by=['timestamp'], axis=0)
    output = output.drop_duplicates(subset=['timestamp'], keep='first')

    idx = pd.Index(output['timestamp'])
    n = idx.get_loc(dt, method='nearest')
    lat = output.iloc[n]['latitudeE7']
    lon = output.iloc[n]['longitudeE7']
    altd = output.iloc[n]['altitude']
    
    #Filter out some bad values in the altitude after getting an error.   
    #This would have been better done in the source data but for now this works.
    if altd != np.nan:
        if altd == 'NaN':
            altd = 0
        else:
            altd = int(np.int_(altd))
            if not 0 < altd < 5000:  #sometimes the altitude in google is weird
                altd = 0          
    else:
        altd = 0
            
    photo = gpsphoto.GPSPhoto(file)
    info = gpsphoto.GPSInfo((lat, lon), alt=altd, timeStamp=dt)
    photo.modGPSData(info, file)
    
    print('Modified image: ' + file + ' with lat=' + str(lat) + ' long=' + str(lon) + ' alt=' + str(altd))


```

### Results

```
    Modified image: .\img\2016-01-06_DSC_6237.JPG with lat=61.2064548 long=-149.9151696 alt=0
    Modified image: .\img\2016-01-15_DSC_6501.JPG with lat=61.5779418 long=-149.1482996 alt=133
    Modified image: .\img\DSC_1850.jpg with lat=60.1057598 long=-149.4343206 alt=0
```

I did not realize until I did this project but Adobe Lightroom has a map feature that displays photos from the library on a map, so this would be very useful for updating the library for that purpose.  
    
