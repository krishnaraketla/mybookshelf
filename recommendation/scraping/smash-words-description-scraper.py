from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from tqdm import tqdm
import pandas as pd
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

def extract_genres(genres_element):
    genres = []
    spans = genres_element.find_elements(By.TAG_NAME, "span")
    for span in spans:
        anchor_tags = span.find_elements(By.TAG_NAME, "a")
        for tag in anchor_tags:
            genre = tag.text
            genres.append(genre)
    return genres

if __name__ == "__main__":
    webdriver_path = '/Users/krishna/Downloads/chromedriver-mac-arm64/chromedriver'
    service = Service(executable_path=webdriver_path)
    driver = webdriver.Chrome(service=service)

    df = pd.read_csv('recommendation/scraping/books_url.csv')
    book_urls = df.url.to_list()

    book_data = []
    for book_url in tqdm(book_urls):
        try:
            driver.get(book_url)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "font-weight-bolder")))
            time.sleep(3)

            title_element = driver.find_element(By.CLASS_NAME, "font-weight-bolder")
            title = title_element.text

            description_element = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/div/main/div[2]/div[1]/div[2]/div[2]/div[2]')
            description = description_element.get_attribute("textContent").strip()

            # Replace any \n in the description with a space
            description = description.replace("\n", " ")

            try:
                categories_element = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/div/main/div[2]/div[2]/div/div/div/table/tbody/tr[6]/td')
                genres = extract_genres(categories_element)
            except NoSuchElementException:
                genres = []

            print("Title:", title)
            print("Description:", description)
            print("Genres:", genres)
            print()

            book_data.append({
                "title": title,
                "description": description,
                "genres": genres
            })
            time.sleep(0.5)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            time.sleep(0.5)

    df = pd.DataFrame(data=book_data, columns=book_data[0].keys())
    df.to_csv("smashbook_details1.csv", index=False)

    driver.quit()