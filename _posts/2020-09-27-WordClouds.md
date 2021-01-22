---
layout: post
title: "Word Clouds in Python" 
date:   2020-09-27 12:00:00 -0800
categories: python
---
![Word Cloud](/assets/wcexample.png)

Today, I am going to show you how to make it rain data with word clouds. Sure, there are free and paid resources out there with more advanced features but if all you want is something simple, private and free then why not roll your own? 

You’ll need Python 3.x, wordcloud, natural language toolkit (nltk), pyperclip, collections, and regex (re).
```python
1: from wordcloud import WordCloud
2: from collections import Counter
3: from nltk.corpus import words
4: import pyperclip
5: import re
```

Like many of my friends, I am in the middle of a job search and my hope is that this little demonstration might help some of you guys out there in your search as well.
This python script is an attempt do the following things:
* Generate a word cloud from a job description, filtering out stop words and common English words
* Get the top 20 words from the word cloud.
* Try to find keywords by searching all capitalized words and filtering out common English words
* Get the top 20 capitalized words from the word cloud.
* Add the Top word and Capitalized words to a csv text file for later analysis in excel


Beginning in the main part of the script, on line 45 it opens the stop words text file and reads it into the `stops` list. Stop words are common, high frequency words. WordCloud will remove stop words by default but the text can be refined further by utilizing a customizable stop word file.
```python
43: if __name__ == "__main__":
44:     
45:     with open('stop.txt', 'r', encoding='utf8') as f:
46:         stops = f.read().lower().split(sep=None)
47:
48:     while True:
49:         myfile = input('Copy text to cliboard and enter a file name (or exit to quit): ')
50:         
51:         #Give the user a way out
52:         if myfile.lower() in ['quit', 'exit', 'stop', 'q']:
53:             break
54:         
55:         #Top, most common words
56:         text = read_clipboard(stops)
57:         top = get_top_words(text)
58:         generate_cloud(text,myfile)
59:         write_tuples(myfile,'TOP',top)
60:         
```

Notice the `while True` loop on line 48. This is done because it takes time to load all the modules and it allows the user to generate more than one word cloud while running the script.. On line 52, the user is given a way out by allowing a few keywords that will cause it to enter the breakpoint.

On line 56, it calls the `read_clipboard(stops)` function, passing in the stop words list. It starts by reading text from the clipboard with `pyperclip`. Then it filters out the stop words by using list comprehension on line 11. On line 12, which is currently commented out (as an optional step), it can do further filtering to remove most words from the english language. However, this isn't smart enough to recognize plurals and past/future tense forms of english verbs.
```python
09: def read_clipboard(stops):
10:     text = pyperclip.paste().lower().split(sep=None)
11:     text = [x for x in text if x.lower() not in stops]
12:     #text = [x for x in text if x.lower() not in words.words()]
13:     text = ' '.join(text)
14:     return text
```

On line 57, it calls the the `get_top_words(text)` function, passing in the filtered `text` string from the clipboard. This function uses `Counter` (line 17) to get the most commonly occurring words in the string. The returned `top` variable is a list of tuples that will be written to a text file later on, as part of the data collection process.
```python
16: def get_top_words(text):
17:     top = Counter(text.split(sep=None)).most_common(20)
18:     return top
```

Line 58 is where the first word cloud is generated by calling the `generate_cloud(text,myfile)` function. On line 21, the `WordCloud` object is instantiated and on line 22 the text is passed to its generate method. Finally on line 23, it writes the output to an image file with the file name that was passed to it.
```python
20: def generate_cloud(text,myfile):
21:     wc = WordCloud(max_font_size=80, width = 800, height=400).generate(text)
22:     wc.generate(text)
23:     wc.to_file(myfile.split(sep='.')[0] + '.png')
```

On line 59 it makes a function call to write csv data: `write_tuples(myfile,'TOP',top)`. It iterates through and writes the text from each element of the tuple (i), separated by commas. It can be useful to collect this data for later analysis.
```python
33: def write_tuples(myfile,flag,lot):
34:     #myfile is the description / company name
35:     #lot is the list of tuples
36:     #flag specifies if it is coming from top words or capital words
37:     with open('counts.txt', 'a') as f:
38:         for i in lot:
39:             s = (myfile + ',' + flag + ',' + str(i[0]) + ',' + str(i[1]))
40:             f.write(s + '\n')
41:         f.close()

```

The second code block repeats the same process, except for the first step on line 61 where it calls a function `get_capitalized_words` which uses a regular expression on line 27  to find all the capitalized words in the originally copied text. A second word cloud is then generated from the capital words, filtered for stop words and (most) english words, leaving (mostly) specific technical terms.
```python
61:         #Capital, key words
62:         text = get_capitalized_words(stops)
63:         generate_cloud(text,'CAP_' + myfile)
64:         cap = get_top_words(text)
65:         write_tuples(myfile,'CAP',cap)
```

We can find all capitalized words using the regex search string `[A-Z]\w+` on line 27.
```python
25: def get_capitalized_words(stops):
26:     text = pyperclip.paste()
27:     capwords = re.findall("[A-Z]\w+", text)
28:     capwords = [x for x in capwords if x.lower() not in stops]
29:     capwords = [x for x in capwords if x.lower() not in words.words()]
30:     text = '\n'.join(capwords)
31:     return text
```



I hope you will find this script useful or at least interesting enough to give it a try. See below for the complete script. Copy it and save it in a directory along with stops.txt.
## Complete Script
```python
01: from wordcloud import WordCloud
02: from collections import Counter
03: from nltk.corpus import words
04: import pyperclip
05: import re
06: 
07: #nltk.download('words') - only had to do this once, the first time
08: 
09: def read_clipboard(stops):
10:     text = pyperclip.paste().lower().split(sep=None)
11:     text = [x for x in text if x.lower() not in stops]
12:     #text = [x for x in text if x not in words.words()]
13:     text = ' '.join(text)
14:     return text
15: 
16: def get_top_words(text):
17:     top = Counter(text.split(sep=None)).most_common(20)
18:     return top
19: 
20: def generate_cloud(text,myfile):
21:     wc = WordCloud(max_font_size=80, width = 800, height=400).generate(text)
22:     wc.generate(text)
23:     wc.to_file(myfile.split(sep='.')[0] + '.png')
24: 
25: def get_capitalized_words(stops):
26:     text = pyperclip.paste()
27:     capwords = re.findall("[A-Z]\w+", text)
28:     capwords = [x for x in capwords if x.lower() not in stops]
29:     capwords = [x for x in capwords if x.lower() not in words.words()]
30:     text = '\n'.join(capwords)
31:     return text
32: 
33: def write_tuples(myfile,flag,lot):
34:     #myfile is the description / company name
35:     #lot is the list of tuples
36:     #flag specifies if it is coming from top words or capital words
37:     with open('counts.txt', 'a') as f:
38:         for i in lot:
39:             s = (myfile + ',' + flag + ',' + str(i[0]) + ',' + str(i[1]))
40:             f.write(s + '\n')
41:         f.close()
42: 
43: if __name__ == "__main__":
44:     
45:     with open('stop.txt', 'r', encoding='utf8') as f:
46:         stops = f.read().lower().split(sep=None)
47:     
48:     while True:
49:         myfile = input('Copy text to cliboard and enter a file name (or exit to quit): ')
50:         
51:         #Give the user a way out
52:         if myfile.lower() in ['quit', 'exit', 'stop', 'q']:
53:             break
54:         
55:         #Top, most common words
56:         text = read_clipboard(stops)
57:         top = get_top_words(text)
58:         generate_cloud(text,myfile)
59:         write_tuples(myfile,'TOP',top)
60:         
61:         #Capital, key words
62:         text = get_capitalized_words(stops)
63:         generate_cloud(text,'CAP_' + myfile)
64:         cap = get_top_words(text)
65:         write_tuples(myfile,'CAP',cap)
66: 
```