from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import json

# Set up Selenium with Chrome
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
service = Service('/Users/krishna/Downloads/chromedriver-mac-arm64/chromedriver')  # Update with your chromedriver path
driver = webdriver.Chrome(service=service, options=chrome_options)

def get_genres(url):
    driver.get(url)
    time.sleep(3)  # Wait for JavaScript to load content

    genres = {}
    a_tags = driver.find_elements(By.TAG_NAME, 'a')
    for a_tag in a_tags:
        href = a_tag.get_attribute('href')
        if href and '/shelves/home/' in href:
            genre_name = a_tag.text.strip()
            relative_url = href.replace(url, '')  # Store relative URL
            if relative_url not in genres:
                genres[relative_url] = genre_name  # Use the URL as the key and genre name as the value
    
    return genres

if __name__ == "__main__":

    base_url = 'https://www.smashwords.com'
    
    # genres = {}
    # genres = get_genres(base_url)

    # # Save the genres with subcategories to a JSON file
    # with open('recommendation/scraping/genres_init.json', 'w', encoding='utf-8') as jsonfile:
    #     json.dump(genres, jsonfile, ensure_ascii=False, indent=4)
        
    with open('recommendation/scraping/genres_full.json', 'r', encoding='utf-8') as jsonfile:
        genres = json.load(jsonfile)
    
    # subcategories = {}
    # for genre_url, genre_name in genres.items():
    #     print(base_url + genre_url)
    #     subcategories.update(get_genres(base_url + genre_url))
    
    # with open('recommendation/scraping/genres_full.json', 'w', encoding='utf-8') as jsonfile:
    #     json.dump(subcategories, jsonfile, ensure_ascii=False, indent=4)
    
    genres_map = {}
    id = 1
    for genre_url, genre_name in genres.items():
        if genre_name not in genres_map:
            genres_map[genre_name] = {"id" : id, "genre_url": genre_url}
            id+=1
    
    with open('recommendation/scraping/genres_map.json', 'w', encoding='utf-8') as jsonfile:
        json.dump(genres_map, jsonfile, ensure_ascii=False, indent=4)
        
    print("Genres with sub-categories have been saved to 'genres_map.json'")

    # Close the browser
    driver.quit()