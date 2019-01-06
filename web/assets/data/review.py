'''
crawl Playful Kiss (2010) comment from https://mydramalist.com
URL: https://mydramalist.com/20-playful-kiss/reviews
'''

import requests
from bs4 import BeautifulSoup
import csv

dramaComments = []
page = 8

def get_html(url):
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status
        #site encoding
        r.encoding = 'utf-8'
        return r.text
    except:
        print('ERROR')

def get_content(url):
    html = get_html(url)
    soup = BeautifulSoup(html, 'lxml')

    # find comment list
    commentList = soup.find('div', class_='app-body')
    comments = commentList.find_all('div', class_='review')

    for comment in comments:
       dramaComment = {}
       dramaComment['name'] = comment.find('a', class_='text-primary').text
       dramaComment['vote'] = comment.find('div', class_='user-stats').small.b.text
       
       dramaComment['overall'] = comment.find('div', class_='rating-overall').b.span.text
       dramaComment['story'] = comment.find('div', class_='review-rating').findChildren()[1].text
       dramaComment['cast'] = comment.find('div', class_='review-rating').findChildren()[2].span.text
       dramaComment['music'] = comment.find('div', class_='review-rating').findChildren()[4].span.text
       dramaComment['rewatch'] = comment.find('div', class_='review-rating').findChildren()[6].span.text
       
       dramaComments.append(dramaComment)
    
    return dramaComments

# write download contents to local file
res = ['name', 'vote', 'time', 'review']
def saveCSV(contents):
    with  open('review.csv', 'a+') as f:
        
        wr = csv.writer(f, quoting=csv.QUOTE_ALL, lineterminator='\n')
        wr.writerow(['name', 'vote', 'overall', 'story', 'cast', 'music', 'rewatch'])
        for comment in contents:
            wr.writerow(comment.values())

def main():
    url = 'https://mydramalist.com/20-playful-kiss/reviews?page='
    urlList = []

    for i in range(page):
        urlList.append(url + str(i + 1))
    

    for url in urlList:
        content = get_content(url)
    
    saveCSV(content)

if __name__ == '__main__':
    main()