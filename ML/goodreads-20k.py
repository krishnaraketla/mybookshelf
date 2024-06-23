#%%
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

# %%
# Function to get the total number of lines in a file
def get_total_lines(file_path):
    with open(file_path, 'r') as f:
        return sum(1 for _ in f)
    
#%%
num_lines = get_total_lines("../ML/data/user_id_map.csv")
num_lines
# %%
num_lines = get_total_lines("../ML/data/book_id_map.csv")
num_lines
# %%
num_lines = get_total_lines("../ML/data/goodreads_interactions.csv")
num_lines
# %%
