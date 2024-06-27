import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix, vstack
from sklearn.metrics.pairwise import cosine_similarity

book_id_map_df = pd.read_csv("ML/data/book_id_map.csv")
book_works_df = pd.read_csv("ML/data/book_works.csv")

book_id_map = dict(zip(book_id_map_df['book_id_csv'], book_id_map_df['book_id']))

def get_work_id(book_id):
    return book_id_map[book_id]

# Define the function to get original title by work_id
def get_original_title_by_book_id(work_id, book_works_df):
    # Find the row with the matching best_book_id
    match = book_works_df[book_works_df['best_book_id'] == work_id]
    
    # If a match is found, return the original title
    if not match.empty:
        return match['original_title'].values[0]
    else:
        return None

def build_user_item_matrix(interactions):
    user_item_matrix = interactions.pivot(index='user_id', columns='book_id', values='rating')
    
    user_means = user_item_matrix.mean(axis=1)
    user_item_matrix = user_item_matrix.sub(user_means, axis=0)
    
    # Count number of ratings a book has received
    book_rating_counts = user_item_matrix.notna().sum(axis=0)
    
    user_item_matrix = user_item_matrix.fillna(0)
    
    # Normalize the ratings by dividing by the book rating counts
    normalized_user_item_matrix = user_item_matrix.div(book_rating_counts, axis=1).fillna(0)
    
    user_item_csr = csr_matrix(normalized_user_item_matrix.values)
    
    return user_item_csr, book_rating_counts, user_item_matrix.columns

def predict_new_ratings(new_user_csr, user_item_csr, similarities):
    new_user_dense = new_user_csr.toarray()
    user_item_dense = user_item_csr.toarray()
    
    predicted_ratings = new_user_dense.copy()
    
    for book_idx in range(new_user_dense.shape[1]):
        if new_user_dense[0, book_idx] == 0:
            book_ratings = user_item_dense[:, book_idx]
            
            weighted_sum = np.dot(similarities, book_ratings)
            sum_of_weights = np.sum(np.abs(similarities))
            
            if sum_of_weights != 0:
                predicted_rating = weighted_sum / sum_of_weights
            else:
                predicted_rating = 0
            
            # Assign the predicted rating to the book
            predicted_ratings[0, book_idx] = predicted_rating
    
    return predicted_ratings

def get_top_n_predictions(new_user_csr, user_item_csr, similarities, n=10):
    predicted_ratings = predict_new_ratings(new_user_csr, user_item_csr, similarities)
    
    predicted_ratings = predicted_ratings.flatten()
    
    top_n_indices = np.argsort(predicted_ratings)[-n:][::-1]
    
    top_n_ratings = predicted_ratings[top_n_indices]
    
    return top_n_indices, top_n_ratings

if __name__ == "__main__":
    # Load the interactions data
    interactions = pd.read_csv("ML/data/interactions.csv")
    # Build the user-item matrix
    user_item_csr, book_rating_counts, columns = build_user_item_matrix(interactions)
    
    new_user_ratings = pd.DataFrame({
    'user_id': 9999999999,
    'book_id': [7300, 1201, 100385, 530615, 48625, 14870, 7170, 19782, 1146577],
    'rating': [5, 4, 3, 5, 1, 3, 2, 5, 1]
    })
    
    new_user_matrix = new_user_ratings.pivot(index='user_id', columns='book_id', values='rating')
    
    new_user_matrix = new_user_matrix.reindex(columns=columns)
    
    new_user_means = new_user_matrix.mean(axis=1)
    new_user_matrix = new_user_matrix.sub(new_user_means, axis=0)
    
    new_user_matrix = new_user_matrix.fillna(0)
    
    normalized_new_user_item_matrix = new_user_matrix.div(book_rating_counts, axis=1).fillna(0)
    
    new_user_csr = csr_matrix(normalized_new_user_item_matrix.values)
    
    # Compute cosine similarity
    similarities = cosine_similarity(new_user_csr, user_item_csr)
    
    # Get top n predictions
    top_n_indices, top_n_ratings = get_top_n_predictions(new_user_csr, user_item_csr, similarities, n=10)
    
    # Convert indices back to book_ids
    top_n_book_ids = columns[top_n_indices]
    
    top_n_ratings_denormalized = top_n_ratings + new_user_means.values[0]
    
    print("Top N Book IDs: ", top_n_book_ids)
    print("Top N Denormalized Ratings: ", top_n_ratings_denormalized)
    
    # Display results
    print("Books you have rated:")
    for idx, row in new_user_ratings.iterrows():
        work_id = get_work_id(row['book_id'])
        title = get_original_title_by_book_id(work_id, book_works_df)
        print(f"Book ID: {row['book_id']}, Title: {title}, Rating: {row['rating']}")
    
    print("\nBooks we recommend:")
    for book_id, rating in zip(top_n_book_ids, top_n_ratings_denormalized):
        work_id = get_work_id(book_id)
        title = get_original_title_by_book_id(work_id, book_works_df)
        print(f"Book ID: {book_id}, Title: {title}, Predicted Rating: {rating:.2f}")
    
    
    
    
    
    
    
    
    
    

    