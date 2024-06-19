#%%
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

#%%
# Load the datasets
books_data = pd.read_csv('../data/books_data.csv')
books_rating = pd.read_csv('../data/books_rating.csv')

#%%
# Function to get the total number of lines in a file
def get_total_lines(file_path):
    with open(file_path, 'r') as f:
        return sum(1 for _ in f)

# Function to read JSON in chunks with progress bar
def read_json_in_chunks(file_path, chunk_size=500):
    total_lines = get_total_lines(file_path)
    chunk_list = []
    with pd.read_json(file_path, lines=True, chunksize=chunk_size) as reader:
        for chunk in tqdm(reader, desc=f"Loading {file_path}", total=total_lines//chunk_size, unit="chunk"):
            chunk_list.append(chunk)
    return pd.concat(chunk_list, ignore_index=True)

#%%
# Load JSON datasets in chunks
goodreads_book_authors = read_json_in_chunks('../data/goodreads_book_authors.json')

#%%
goodreads_book_series = read_json_in_chunks('../data/goodreads_book_series.json')

#%%
goodreads_book_works = read_json_in_chunks('../data/goodreads_book_works.json')

#%%
series = read_json_in_chunks('../data/series.json')

#%%
# Display the first few rows of books_data
print(books_data.head())

#%%
# Display the info of books_data
print(books_data.info())

#%%
# Check for missing values in books_data
print(books_data.isnull().sum())

#%%
# Descriptive statistics for books_data
print(books_data.describe())

#%%
# Display the first few rows of books_rating
print(books_rating.head())

#%%
# Display the info of books_rating
print(books_rating.info())

#%%
# Check for missing values in books_rating
print(books_rating.isnull().sum())

#%%
# Descriptive statistics for books_rating
print(books_rating.describe())

#%%
# Display the first few rows of goodreads_book_authors
print(goodreads_book_authors.head())

#%%
# Display the info of goodreads_book_authors
print(goodreads_book_authors.info())

#%%
# Check for missing values in goodreads_book_authors
print(goodreads_book_authors.isnull().sum())

#%%
# Descriptive statistics for goodreads_book_authors
print(goodreads_book_authors.describe())

#%%
# Display the first few rows of goodreads_book_series
print(goodreads_book_series.head())

#%%
# Display the info of goodreads_book_series
print(goodreads_book_series.info())

#%%
# Check for missing values in goodreads_book_series
print(goodreads_book_series.isnull().sum())

#%%
# Descriptive statistics for goodreads_book_series
print(goodreads_book_series.describe())

#%%
# Display the first few rows of goodreads_book_works
print(goodreads_book_works.head())

#%%
# Display the info of goodreads_book_works
print(goodreads_book_works.info())

#%%
# Check for missing values in goodreads_book_works
print(goodreads_book_works.isnull().sum())

#%%
# Descriptive statistics for goodreads_book_works
print(goodreads_book_works.describe())

#%%
# Display the first few rows of series
print(series.head())

#%%
# Display the info of series
print(series.info())

#%%
# Check for missing values in series
print(series.isnull().sum())

#%%
# Descriptive statistics for series
print(series.describe())
