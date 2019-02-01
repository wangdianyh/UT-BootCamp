
# coding: utf-8

# In[1]:


import pandas as pd
from bs4 import BeautifulSoup as bs
import requests
import pymongo


# In[2]:


# get html page
def get_page_data(url):
    base_url = url;
    # get page data
    r = requests.get(base_url, timeout=30)
    page_text = r.text
    soup = bs(page_text, 'lxml')
    
    return soup


# NASA Mars News

# In[3]:


base_url = 'https://mars.nasa.gov/news'
soup = get_page_data(base_url)


# In[4]:


news_p = soup.find('div', id='page').find('div', class_='slide').find('div', class_='rollover_description_inner').text.strip()


# In[5]:


news_title = soup.find('div', id='page').find('div', class_='slide').find('div', class_='content_title').find('a').text.strip()


# In[6]:


news_p


# In[7]:


news_title


# In[8]:


full_page_url = soup.find('div', id='page').find('div', class_='slide').find('a')['href']


# JPL Mars Space Images - Featured Image

# In[9]:


# get full image from page
page_detail_url = base_url + full_page_url[5:]


# In[10]:


page_soup = get_page_data(page_detail_url)


# In[11]:


image_url = page_soup.find('figure', class_='main_image').find('img')['src']


# In[12]:


featured_image_url = base_url[:-5] + image_url


# Mars Weather

# In[8]:


twitter_url = 'https://twitter.com/marswxreport?lang=en'
twitter_soup = get_page_data(twitter_url)


# In[21]:


def get_mars_weather():
    twit_list = twitter_soup.find('ol', id='stream-items-id').find_all('li', class_='stream-item')
    for li in twit_list:
        title = li.find('span', class_='FullNameGroup').find('strong', class_='fullname').text
        if(title == 'Mars Weather'):
            mars_weather = li.find('p', class_='TweetTextSize').text
            break
     
    return mars_weather


# In[76]:


mars_weather = get_mars_weather()[:-26]


# In[77]:


mars_weather


# Mars Facts

# In[42]:


facts_url = 'https://space-facts.com/mars/'


# In[56]:


facts_table = pd.read_html(facts_url)


# In[67]:


facts_df = pd.DataFrame(facts_table[0]).set_index(0).rename(columns={1: 'Value'})


# In[68]:


del facts_df.index.name


# In[70]:


# convert data to a HTML table string
facts_df.to_html()


# Mars Hemispheres

# In[32]:


hemi_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
hemi_soup = get_page_data(hemi_url)


# In[33]:


# get list div
hemi_list_div = hemi_soup.find('div', id='product-section').find_all('div', class_='item')


# In[34]:


# get url in list
hemi_urls = []
for item in hemi_list_div:
    a = item.find('a', class_='itemLink')['href']
    hemi_urls.append(a)


# In[35]:


# find sample image
hemi_base = 'https://astrogeology.usgs.gov/'
sampe_urls = []
for hemi_url in hemi_urls:
    url = hemi_base + hemi_url
    soup = get_page_data(url)
    title = soup.find('h2', class_='title').text
    img = soup.find('div', class_='downloads').find('ul').find('li').find('a')['href']
    sampe_urls.append(
        {
            'title': title,
            'img_url': img
        }
    )


# In[24]:


# save data into mongo db
client = pymongo.MongoClient('mongodb://localhost:27017/')
# create db
db = client.mars_db
hemi_col = db['Hemispheres']


# In[41]:


if hemi_col.count() == 0:
    hemi_col.insert_many(sampe_urls)
else:
    hemi_col.remove()
    hemi_col.insert_many(sampe_urls)


# output data for external call

# In[7]:


def outputData():
    output_dict = {
        'news_title': news_title,
        'news_content': news_p,
        'img_url': featured_image_url,
        'weather': mars_weather,
        'fact_html': facts_df.to_html()
    }

    return output_dict

