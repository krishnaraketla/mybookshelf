#%%
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

# %%
def get_total_lines(file_path):
    with open(file_path, 'r') as f:
        return sum(1 for _ in f)
    
#%%
def read_json_in_chunks(file_path, chunk_size=500, total_lines=100):
    total_lines = get_total_lines(file_path)
    chunk_list = []
    lines_read = 0
    with pd.read_json(file_path, lines=True, chunksize=chunk_size) as reader:
        for chunk in tqdm(reader, desc=f"Loading {file_path}", total=total_lines//chunk_size, unit="chunk"):
            chunk_list.append(chunk)
            lines_read += len(chunk)
            if lines_read >= total_lines:
                break
    return pd.concat(chunk_list, ignore_index=True)
    
# %%
goodreads_book_works = read_json_in_chunks('./data/goodreads_book_works.json')
columns_to_keep = ['work_id', 'best_book_id', 'original_title', 'original_language_id', 'default_description_language_code']
goodreads_book_works = goodreads_book_works[columns_to_keep]
goodreads_book_works.to_csv("./data/book_works-full.csv")

#%%
goodreads_books = read_json_in_chunks('./data/goodreads_books.json')
# columns_to_keep = ['work_id', 'best_book_id', 'original_title', 'original_language_id', 'default_description_language_code']
# goodreads_book_works = goodreads_book_works[columns_to_keep]
goodreads_books.to_csv("./data/books.csv")

# %%
