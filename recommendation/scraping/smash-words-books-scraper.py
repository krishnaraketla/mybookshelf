from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import json
import csv

# Set up Selenium with Chrome
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
service = Service('/Users/krishna/Downloads/chromedriver-mac-arm64/chromedriver')  # Update with your chromedriver path
driver = webdriver.Chrome(service=service, options=chrome_options)

def get_books(url):
    driver.get(url)
    time.sleep(3)  # Wait for JavaScript to load content

    books = {}
    a_tags = driver.find_elements(By.TAG_NAME, 'a')
    for a_tag in a_tags:
        href = a_tag.get_attribute('href')
        if href and '/books/view/' in href:
            book_name = a_tag.text.strip()
            relative_url = href.replace(url, '')  # Store relative URL
            if relative_url not in books:
                books[relative_url] = book_name  # Use the URL as the key and book name as the value
    
    return books

if __name__ == "__main__":

    genre_url = 'https://www.smashwords.com/shelves/home/892/any/any'
    
    
    books_map = get_books(genre_url)
    with open('recommendation/scraping/books_map.json', 'w', encoding='utf-8') as jsonfile:
        json.dump(books_map, jsonfile, ensure_ascii=False, indent=4)
        
    # Load the JSON data
    with open('recommendation/scraping/books_map.json', 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)

    # Open the CSV file for writing
    with open('recommendation/scraping/books_url.csv', 'w', newline='', encoding='utf-8') as csv_file:
        csv_writer = csv.writer(csv_file)
    
        # Write the header
        csv_writer.writerow(['title', 'url'])
        
        # Write the data
        for url, title in data.items():
            # Replace newline characters with a space
            cleaned_title = title.replace('\n', ' ')
            csv_writer.writerow([cleaned_title, url])

    print("Data has been converted to 'output.csv'")
        
    print("books with have been saved to 'books_map.json'")

    # Close the browser
    driver.quit()   